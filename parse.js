/* Wikipedia draw parser, shared by scripts/fetch-draws.mjs (build time) and live.js (in the browser).
   Reads the {{nTeamBracket}} templates of a singles draw page into matches; toDraw() packs them into the DRAWS shape. */
const WIKIDRAW = (() => {
  const slug = n => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/ø/g, 'o').replace(/đ/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ROUND_ORDER = ['first round','second round','third round','fourth round','round robin','quarterfinals','semifinals','final'];
  const roundIx = label => { const i = ROUND_ORDER.indexOf(label.toLowerCase().trim()); return i < 0 ? 99 : i; };

  // Pull every {{nTeamBracket...}} (or, with kind 'RR', {{nTeamRR...}}) template out of the wikitext, matching braces.
  function brackets(text, kind = 'Bracket'){
    const res = [];
    let i = 0;
    while ((i = text.indexOf('{{', i)) >= 0){
      if (!new RegExp('^\\{\\{\\s*\\d+Team' + kind).test(text.slice(i, i + 40))){ i += 2; continue; }
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

  // Round-robin group tables put several |key=value pairs on one line, so split on pipes outside [[...]] and {{...}}.
  function rrParams(tpl){
    const p = {}, body = tpl.slice(2, -2), parts = [];
    let depth = 0, start = 0;
    for (let i = 0; i < body.length; i++){
      const two = body.slice(i, i + 2);
      if (two === '{{' || two === '[['){ depth++; i++; }
      else if (two === '}}' || two === ']]'){ depth--; i++; }
      else if (body[i] === '|' && !depth){ parts.push(body.slice(start, i)); start = i + 1; }
    }
    parts.push(body.slice(start));
    for (const part of parts){
      const m = part.match(/^\s*([A-Za-z0-9/-]+)\s*=([\s\S]*)$/);
      if (m) p[m[1]] = m[2].trim();
    }
    return p;
  }
  // Bold winner's view "6–2, 7–6<sup>(7–4)</sup>" -> "6–2, 7–6(4)" (loser's tiebreak points, as in the brackets)
  function rrScore(v){
    let s = v.replace(/'''/g, '').replace(/&nbsp;/g, ' ').trim();
    if (/w\/o/i.test(s)) return 'w/o';
    s = s.replace(/<sup>\s*\(?\s*(\d+)\s*[–-]\s*(\d+)\s*\)?\s*<\/sup>/g, (_, a, b) => `(${Math.min(+a, +b)})`)
      .replace(/<sup>\s*\(?\s*(\d+)\s*\)?\s*<\/sup>/g, '($1)').replace(/<[^>]+>/g, '').replace(/(\d)\s*-\s*(\d)/g, '$1–$2');
    return s.replace(/\s*\b(ret|retired|def)\.?\s*$/i, (_, f) => f.toLowerCase().startsWith('d') ? ' def.' : ' ret.');
  }
  // Every pairing of each {{nTeamRR}} group: played ones carry the winner (the bold side) and score, the rest stay pending.
  function roundRobin(body, seen, entry){
    for (const tpl of brackets(body, 'RR')){
      const p = rrParams(tpl), teams = {};
      for (let n = 1; p[`team-${n}`] !== undefined; n++){
        const t = team(p[`team-${n}`]);
        if (!t) continue;
        teams[n] = t;
        const sd = (p[`seed-${n}`] || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
        entry[t.name] = entry[t.name] || {flag: t.flag, seed: '', article: t.article};
        if (sd) entry[t.name].seed = sd;
        if (t.flag) entry[t.name].flag = t.flag;
      }
      const ns = Object.keys(teams).map(Number);
      for (const i of ns) for (const j of ns){
        if (j <= i) continue;
        const ij = p[`${i}v${j}`] || '', ji = p[`${j}v${i}`] || '';
        const w = ij.includes("'''") ? 0 : ji.includes("'''") ? 1 : -1;
        const a = teams[i].name, b = teams[j].name;
        seen.set('round robin|' + [a, b].sort().join('|'), {round: 'Round robin', a, b, w, sc: w < 0 ? '' : rrScore(w === 0 ? ij : ji)});
      }
    }
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
    roundRobin(body, seen, entry);
    const matches = [...seen.values()].sort((x, y) => roundIx(x.round) - roundIx(y.round));
    return {matches, entry};
  }

  const wiki = title => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%2C/g, ',').replace(/%27/g, "'");
  // matches/entry from parseDraw -> {rounds, e, m} for DRAWS, adding unseen players to people (the PEOPLE table)
  function toDraw({matches, entry}, people){
    const ent = {};
    for (const [n, e] of Object.entries(entry)){
      const s = slug(n);
      if (!people[s]) people[s] = e.article === n ? [n, e.flag] : [n, e.flag, e.article];
      else if (!people[s][1] && e.flag) people[s][1] = e.flag;
      ent[s] = e.seed;
    }
    const rounds = [...new Set(matches.map(m => m.round))];
    return {rounds, e: ent, m: matches.map(m => [rounds.indexOf(m.round), slug(m.a), slug(m.b), m.w, m.sc])};
  }
  return {slug, parseDraw, toDraw, wiki};
})();
