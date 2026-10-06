// Downloads the Wikipedia singles draw for every tournament in src/data.js that names one (field `w`),
// parses the bracket templates into matches, and writes src/draws.js.
// Run: node scripts/fetch-draws.mjs && node build.mjs
import fs from 'fs';

const UA = {'User-Agent': 'CourtAtlas/1.0 (https://github.com/winterai-newchapter/court-atlas)'};
const API = 'https://en.wikipedia.org/w/api.php';
const { T, PLAYERS } = new Function(fs.readFileSync('src/data.js', 'utf8') + ';return {T, PLAYERS};')();

export const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/ø/g, 'o').replace(/đ/g, 'd')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ROUND_ORDER = ['first round','second round','third round','fourth round','quarterfinals','semifinals','final'];
const roundIx = label => { const i = ROUND_ORDER.indexOf(label.toLowerCase().trim()); return i < 0 ? 99 : i; };

async function fetchPages(titles){
  const out = {};
  for (let i = 0; i < titles.length; i += 10){
    const batch = titles.slice(i, i + 10);
    const q = new URLSearchParams({action:'query', prop:'revisions', rvprop:'ids|timestamp|content', rvslots:'main',
      titles: batch.join('|'), redirects:'1', format:'json', formatversion:'2'});
    const r = await (await fetch(`${API}?${q}`, {headers: UA})).json();
    const alias = {};
    for (const n of r.query.normalized || []) alias[n.to] = n.from;
    for (const n of r.query.redirects || []) alias[n.to] = alias[n.from] || n.from;
    for (const p of r.query.pages){
      const asked = alias[p.title] || p.title;
      if (p.missing){ out[asked] = null; continue; }
      const rev = p.revisions[0];
      out[asked] = {title: p.title, rev: rev.revid, at: rev.timestamp, text: rev.slots.main.content};
    }
  }
  return out;
}

// Pull every {{nTeamBracket...}} template out of the wikitext, matching braces.
function brackets(text){
  const res = [];
  let i = 0;
  while ((i = text.indexOf('{{', i)) >= 0){
    if (!/^\{\{\s*\d+TeamBracket/.test(text.slice(i, i + 40))){ i += 2; continue; }
    let depth = 0, j = i;
    for (; j < text.length; j++){
      if (text.startsWith('{{', j)){ depth++; j++; }
      else if (text.startsWith('}}', j)){ depth--; j++; if (!depth) break; }
    }
    res.push(text.slice(i, j + 1));
    i = j + 1;
  }
  return res;
}
function params(tpl){
  const p = {};
  for (const line of tpl.split('\n')){
    const m = line.match(/^\s*\|\s*([A-Za-z0-9-]+)\s*=(.*)$/);
    if (m) p[m[1]] = m[2].trim();
  }
  return p;
}
function team(v){
  if (!v) return null;
  const link = v.match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
  if (!link) return null;
  const article = link[1].trim(), name = article.replace(/\s*\([^)]*\)\s*$/, '');
  const flag = (v.match(/flagicon\|([A-Z]{3})/) || [])[1] || '';
  return {name, article, flag, won: v.includes("'''")};
}
function setScore(v){
  if (!v) return null;
  const raw = v.replace(/'''/g, '').replace(/&nbsp;/g, ' ').trim();
  if (!raw) return null;
  const g = raw.match(/^(\d+)/);
  const tb = raw.match(/<sup>\s*(\d+)\s*<\/sup>/);
  const flag = (raw.match(/<sup>\s*([a-z])\s*<\/sup>/i) || [])[1];
  return {g: g ? +g[1] : null, tb: tb ? +tb[1] : null, flag: flag ? flag.toLowerCase() : null, wo: /w\/o/i.test(raw)};
}
function scoreText(win, lose){
  if ([...win, ...lose].some(s => s && s.wo)) return 'w/o';
  const sets = [];
  for (let k = 0; k < Math.max(win.length, lose.length); k++){
    const a = win[k], b = lose[k];
    if (!a || !b || a.g === null || b.g === null) continue;
    const tb = a.tb !== null || b.tb !== null ? `(${Math.min(a.tb ?? 99, b.tb ?? 99)})` : '';
    sets.push(`${a.g}–${b.g}${tb}`);
  }
  const fl = lose.find(s => s && s.flag)?.flag || win.find(s => s && s.flag)?.flag;
  return sets.join(', ') + (fl === 'r' ? ' ret.' : fl === 'd' ? ' def.' : '');
}

function parseDraw(text){
  const cut = text.search(/^==\s*Qualifying/m);
  const body = cut > 0 ? text.slice(0, cut) : text;
  const seen = new Map(), entry = {};
  for (const tpl of brackets(body)){
    const p = params(tpl);
    for (let r = 1; p[`RD${r}`] !== undefined; r++){
      const label = p[`RD${r}`].replace(/<[^>]+>/g, '').trim();
      const slots = Object.keys(p).map(k => k.match(new RegExp(`^RD${r}-team0*(\\d+)$`))).filter(Boolean).map(m => +m[1]);
      const maxSlot = Math.max(0, ...slots);
      for (let k = 1; k < maxSlot; k += 2){
        const get = (n, f) => p[`RD${r}-${f}${n}`] ?? p[`RD${r}-${f}${String(n).padStart(2, '0')}`];
        const a = team(get(k, 'team')), b = team(get(k + 1, 'team'));
        if (!a && !b) continue;
        const sets = n => [1,2,3,4,5].map(s => setScore(p[`RD${r}-score${n}-${s}`] ?? p[`RD${r}-score${String(n).padStart(2, '0')}-${s}`]));
        const sa = sets(k), sb = sets(k + 1);
        for (const [t, n] of [[a, k], [b, k + 1]]) if (t){
          const sd = (get(n, 'seed') || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
          entry[t.name] = entry[t.name] || {flag: t.flag, seed: '', article: t.article};
          if (sd) entry[t.name].seed = sd;
          if (t.flag) entry[t.name].flag = t.flag;
        }
        if (!a || !b) continue;
        const w = a.won && !b.won ? 0 : b.won && !a.won ? 1 : -1;
        const sc = w < 0 ? '' : w === 0 ? scoreText(sa, sb) : scoreText(sb, sa);
        const key = label.toLowerCase() + '|' + [a.name, b.name].sort().join('|');
        const prev = seen.get(key);
        if (!prev || (prev.w < 0 && w >= 0)) seen.set(key, {round: label, a: a.name, b: b.name, w, sc});
      }
    }
  }
  const matches = [...seen.values()].sort((x, y) => roundIx(x.round) - roundIx(y.round));
  return {matches, entry};
}

const jobs = [];
for (const t of T) for (const [tour, title] of Object.entries(t.w || {})) jobs.push({t, tour, title});
const pages = await fetchPages([...new Set(jobs.map(j => j.title))]);
const fetched = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

const SRC = {}, DRAWS = {}, PEOPLE = {};
const wiki = title => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%2C/g, ',').replace(/%27/g, "'");
for (const {t, tour, title} of jobs){
  const pg = pages[title], key = `${t.id}/${tour}`;
  if (!pg){ console.warn(`missing page: ${title}`); continue; }
  SRC[key] = {u: wiki(pg.title), rev: pg.rev, at: pg.at};
  if (tour === 'Team') continue;
  const {matches, entry} = parseDraw(pg.text);
  if (!matches.length){ console.warn(`no draw yet: ${title}`); }
  const ent = {};
  for (const [n, e] of Object.entries(entry)){
    const s = slug(n);
    if (!PEOPLE[s]) PEOPLE[s] = e.article === n ? [n, e.flag] : [n, e.flag, e.article];
    else if (!PEOPLE[s][1] && e.flag) PEOPLE[s][1] = e.flag;
    ent[s] = e.seed;
  }
  const rounds = [...new Set(matches.map(m => m.round))];
  DRAWS[key] = {rounds, e: ent, m: matches.map(m => [rounds.indexOf(m.round), slug(m.a), slug(m.b), m.w, m.sc])};
  // Cross-check the final against the hand-entered result in data.js
  const fin = matches.find(m => m.round.toLowerCase() === 'final' && m.w >= 0);
  const r = t.res.find(x => x.t === tour);
  if (fin && r){
    const w = fin.w === 0 ? fin.a : fin.b;
    if (slug(w) !== slug(r.w)) console.warn(`final mismatch ${key}: data.js says ${r.w}, Wikipedia says ${w}`);
  }
  if (!fin && r) console.warn(`no final in draw for ${key}`);
}
for (const tour of ['ATP','WTA']) for (const p of PLAYERS[tour]) if (!PEOPLE[slug(p.n)]) console.warn(`top-10 player not in any draw: ${p.n}`);

const out = `/* Generated by scripts/fetch-draws.mjs on ${fetched} from Wikipedia. Do not edit by hand. */
const FETCHED = '${fetched}';
const TODAY = new Date(FETCHED);
/* key "<tournament id>/<tour>": u page URL, rev revision id, at revision time */
const SRC = ${JSON.stringify(SRC)};
/* slug: [name, IOC flag code, Wikipedia article if it differs from name] */
const PEOPLE = ${JSON.stringify(PEOPLE)};
/* rounds: labels; e: slug -> seed/entry tag; m: [round index, player A, player B, winner (0 A, 1 B, -1 not played), score] */
const DRAWS = ${JSON.stringify(DRAWS)};
`;
fs.writeFileSync('src/draws.js', out);
const n = Object.values(DRAWS).reduce((a, x) => a + x.m.length, 0);
console.log(`wrote src/draws.js: ${Object.keys(DRAWS).length} draws, ${n} matches, ${Object.keys(PEOPLE).length} players, ${(out.length/1024).toFixed(0)} KB`);
