// Builds the Court Atlas site from src/ into the workspace root.
// Topic pages come from src/pages/; tournament/<id>.html and player/<slug>.html are rendered here with src/views.js.
// Also writes sitemap.xml, robots.txt and .artifact/index.html, a head-less copy of the home page for publishing as a claude.ai artifact.
// Refresh draws first with: node scripts/fetch-draws.mjs (.github/workflows/refresh.yml does both every 15 minutes).
// Pages with poll:true, and the pages of tournaments in progress, also refresh results in the browser with live.js.
import fs from 'fs';
import crypto from 'crypto';
const OUT = '.';
// Canonical origin for <link rel="canonical">, Open Graph and structured data. Change it if the site moves.
const SITE = 'https://winterai-newchapter.github.io/Court-Atlas/';
const BRAND = 'Court Atlas';

const PAGES = [
  {f:'season',  t:'Season Map', map:true, live:true, poll:true,
   title:'2026 Tennis Tournament Map & Results | Court Atlas',
   desc:'Every 2026 ATP and WTA tournament on a world map, with finals, scores, live draws and the next matches of events in progress.'},
  {f:'history', t:'History',
   title:'Tennis History Timeline, 1874 to 2026 | Court Atlas',
   desc:'Key moments in tennis from Wingfield’s 1874 patent to electronic line calling, plus the all-time Grand Slam singles title leaders.'},
  {f:'archive', t:'Past Champions',
   title:'Grand Slam Singles Champions Since 2000 (ATP & WTA) | Court Atlas',
   desc:'Every Australian Open, Roland Garros, Wimbledon and US Open singles champion since 2000, with a most-majors leaderboard by era.'},
  {f:'rackets', t:'Rackets',
   title:'Tennis Racket Specs Compared: Head Size, Weight, Pattern | Court Atlas',
   desc:'Head size, strung weight and string pattern for popular Babolat, Head, Wilson, Yonex and Tecnifibre frames, and which pros use them.'},
  {f:'strings', t:'Strings',
   title:'Which Tennis String Is Right for You? String Finder, Tension & Best Strings | Court Atlas',
   desc:'Answer seven questions to get a string type, gauge and tension for your game, then compare popular strings, hybrids and gauges, and learn when to restring and how to protect your arm.'},
  {f:'players', t:'Players', live:true,
   title:'ATP & WTA Top 10 Players 2026: Profiles, Form & Records | Court Atlas',
   desc:'Profiles of the 2026 ATP and WTA top 10 with recent form, win rate by surface and Elo, plus a page for every player in the covered draws.'},
  {f:'stats',   t:'Statistics', live:true,
   title:'2026 Tennis Statistics: Ranking Points, Titles & Majors | Court Atlas',
   desc:'Charts of 2026 ATP and WTA ranking points, title counts across covered tournaments and career Grand Slam titles for the top 10.'},
];
const HOME = {title:'Court Atlas: 2026 ATP & WTA Tennis Season Map, Draws & Results',
  desc:'Follow the 2026 tennis season: a world map of ATP and WTA tournaments, live draws with win probabilities, player form and past champions.'};
const ASSETS = ['styles.css','data.js','draws.js','common.js','views.js','map.js','parse.js','live.js'];
// Asset URLs carry a content hash (?v=…) so browsers and CDNs that cache CSS/JS for hours still load each new build
const VER = Object.fromEntries(ASSETS.map(f => [f, crypto.createHash('md5').update(fs.readFileSync(`src/${f}`)).digest('hex').slice(0, 8)]));
const asset = (base, f) => `${base}${f}?v=${VER[f]}`;

// The same data and view code the browser runs, evaluated here to render static pages
const V = new Function(['data.js','draws.js','common.js','views.js'].map(f => fs.readFileSync(`src/${f}`, 'utf8')).join('\n;\n')
  + '\nreturn {STRING_DB, STRING_TYPE, STRING_FAQ, buyLinks, affNote, T, LV, SF, PEOPLE, DRAWS, SRC, FETCHED, TOP, MATCHES, setBase, methodNote, tournamentBody, playerBody, status, range, pTour, record, esc, utc, pName, pWiki, drawKeys};')();

const FONTS = base => `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="${asset(base, 'styles.css')}">`;
const header = (cur, base = '') => `<header class="top"><div class="wrap">
  <a class="brand" href="${base}index.html"><b>Court Atlas</b><span>2026 season</span></a>
  <nav id="nav">${PAGES.map(p => `<a href="${base}${p.f}.html"${p.f === cur ? ' class="on" aria-current="page"' : ''}>${p.t}</a>`).join('')}</nav>
</div></header>`;
const footer = base => `<footer><p>Data: Wikipedia and manufacturer specs. Win probabilities are an <a href="${base}players.html#method">Elo estimate</a>.</p></footer>`;
const scripts = (p, base) => [p.map && 'map.js', 'data.js', p.live && 'draws.js', 'common.js', p.live && 'views.js', p.poll && 'parse.js', p.poll && 'live.js']
  .filter(Boolean).map(f => `<script src="${asset(base, f)}"></script>`).join('\n');

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const ld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const crumbsLd = crumbs => ({'@context':'https://schema.org', '@type':'BreadcrumbList',
  itemListElement: crumbs.map(([name, path], i) => ({'@type':'ListItem', position:i + 1, name, item:SITE + path}))});
const crumbsHtml = (crumbs, base) => `<p class="crumb">${crumbs.map(([n, path], i) => i === crumbs.length - 1
  ? `<span aria-current="page">${V.esc(n)}</span>` : `<a href="${base}${path || 'index.html'}">${V.esc(n)}</a><span aria-hidden="true">/</span>`).join('')}</p>`;
const WEBSITE = {'@context':'https://schema.org', '@type':'WebSite', name:BRAND, url:SITE, inLanguage:'en', description:HOME.desc};

function doc({title, desc, path, head, body, jsonld = [], type = 'website'}){
  const url = SITE + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${V.esc(title)}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
${jsonld.map(ld).join('\n')}
${head}
</head>
<body>
${body}
</body>
</html>
`;
}
const urls = [];
const write = (path, html) => {
  fs.mkdirSync(`${OUT}/${path}`.replace(/\/[^/]*$/, ''), {recursive:true});
  fs.writeFileSync(`${OUT}/${path}`, html);
  urls.push(path === 'index.html' ? '' : path);
};

for (const f of ASSETS) fs.copyFileSync(`src/${f}`, `${OUT}/${f}`);

// Home page
const homeBody = `${header('')}
<main class="wrap">
${fs.readFileSync('src/pages/index.html','utf8')}
</main>
<div class="wrap">${footer('')}</div>`;
const homeHead = `${FONTS('')}\n${scripts({map:true, live:true, poll:true}, '')}`;
write('index.html', doc({title:HOME.title, desc:HOME.desc, path:'', head:homeHead, body:homeBody, jsonld:[WEBSITE]}));
fs.mkdirSync('.artifact', {recursive:true});
fs.writeFileSync('.artifact/index.html', `<title>${BRAND}</title>\n${homeHead}\n${homeBody}\n`);

// Static index of every player with a page, injected into players.html so each profile is one plain link away
const byTour = tour => Object.keys(V.PEOPLE).filter(s => V.pTour(s) === tour).sort((a, b) => V.pName(a).localeCompare(V.pName(b)));
const allPlayers = ['ATP','WTA'].map(tour => `<details class="round allp"><summary>${tour === 'ATP' ? 'ATP men' : 'WTA women'} <span class="ex">${byTour(tour).length} players</span></summary><ul class="plinks">${byTour(tour).map(s => `<li><a class="pl" href="player/${s}.html">${V.esc(V.pName(s))}</a></li>`).join('')}</ul></details>`).join('');

// Topic pages
// String library table and FAQ, rendered as static HTML so search engines and AI crawlers can read them
const stringLib = `<div class="panel tablebox" style="padding:8px 14px"><table id="lib"><thead><tr><th>String</th><th>Type</th><th>Shape</th><th class="n">Gauges (mm)</th><th>Price</th><th>Good for</th><th>Shop</th></tr></thead><tbody>${V.STRING_DB.map(x => `<tr data-ty="${x.ty}"><td><b>${V.esc(x.n)}</b><div class="ex">${V.esc(x.note)}</div></td><td>${V.STRING_TYPE[x.ty]}</td><td>${V.esc(x.sh)}</td><td class="n">${x.g.map(g => g.toFixed(2)).join(' / ')}</td><td class="num">${'$'.repeat(x.tier)}</td><td>${x.tags.map(t => `<span class="chip">${t}</span>`).join(' ')}</td><td class="buys">${V.buyLinks(x.n)}</td></tr>`).join('')}</tbody></table></div>`;
const stringFaq = V.STRING_FAQ.map(([q, a]) => `<details class="round faq"><summary>${V.esc(q)}</summary><p>${V.esc(a)}</p></details>`).join('');
const fill = src => src.replace('<!--STRING_LIB-->', stringLib).replace('<!--STRING_FAQ-->', stringFaq).replace(/<!--AFF_NOTE-->/g, V.affNote() ? V.affNote() + ' ' : '');
const pageLd = {
  season: () => ({'@context':'https://schema.org', '@type':'ItemList', name:'2026 tennis tournaments',
    itemListElement: V.T.map((t, i) => ({'@type':'ListItem', position:i + 1, url:`${SITE}tournament/${t.id}.html`, name:t.name}))}),
  strings: () => ({'@context':'https://schema.org', '@type':'FAQPage',
    mainEntity: V.STRING_FAQ.map(([q, a]) => ({'@type':'Question', name:q, acceptedAnswer:{'@type':'Answer', text:a}}))}),
  players: () => ({'@context':'https://schema.org', '@type':'ItemList', name:'ATP and WTA top 10, September 28, 2026',
    itemListElement: Object.keys(V.TOP).map((s, i) => ({'@type':'ListItem', position:i + 1, url:`${SITE}player/${s}.html`, name:V.TOP[s].n}))}),
};
PAGES.forEach((p, i) => {
  const prev = PAGES[i-1], next = PAGES[i+1];
  const np = `<nav class="nextprev" aria-label="More topics">
  ${prev ? `<a href="${prev.f}.html"><small>← Previous</small><b>${prev.t}</b></a>` : `<a href="index.html"><small>← Back to</small><b>Home</b></a>`}
  ${next ? `<a class="next" href="${next.f}.html"><small>Next →</small><b>${next.t}</b></a>` : `<a class="next" href="index.html"><small>Back to →</small><b>Home</b></a>`}
</nav>`;
  const crumbs = [['Home', ''], [p.t, `${p.f}.html`]];
  const src = fill(fs.readFileSync(`src/pages/${p.f}.html`, 'utf8').replace('<!--ALL_PLAYERS-->', allPlayers).replace('<!--METHOD-->', V.methodNote()));
  write(`${p.f}.html`, doc({title:p.title, desc:p.desc, path:`${p.f}.html`, head:`${FONTS('')}\n${scripts(p, '')}`,
    jsonld:[crumbsLd(crumbs), ...(pageLd[p.f] ? [pageLd[p.f]()] : [])],
    body:`${header(p.f)}
<main class="wrap page">
${crumbsHtml(crumbs, '')}
${src}
${np}
</main>
<div class="wrap">${footer('')}</div>`}));
});

// Tournament and player pages: static HTML. A tournament in progress also loads the scripts and re-renders its body as results come in.
const sub = (cur, crumbs, body) => `${header(cur, '../')}
<main class="wrap page">
${crumbsHtml(crumbs, '../')}
${body}
</main>
<div class="wrap">${footer('../')}</div>`;
V.setBase('../');
const EVSTATUS = 'https://schema.org/EventScheduled';
for (const t of V.T){
  const st = V.status(t), tours = t.tour === 'BOTH' ? 'ATP & WTA' : t.tour;
  const hasDraw = V.drawKeys(t).some(k => !k.endsWith('/Team'));
  const lead = st === 'live' ? 'live draw, next matches with win probabilities and results so far'
    : st === 'done' ? `${t.res.length ? `final result (won by ${t.res.map(r => r.w).join(' and ')})` : 'results'}${hasDraw ? ', full draw and every player' : ''}`
    : hasDraw ? 'draw, players and first-round win probabilities' : 'dates, venue and surface';
  const title = `${t.name} 2026: ${st === 'up' ? 'Draw, Dates & Preview' : st === 'live' ? 'Live Draw, Results & Predictions' : 'Results & Draw'} | ${BRAND}`;
  const desc = `${t.name} 2026 (${tours} ${V.LV[t.lv].n}, ${V.SF[t.sf].toLowerCase()} court, ${t.city}, ${V.range(t)}): ${lead}.`;
  const crumbs = [['Home', ''], ['Season Map', 'season.html'], [t.name, `tournament/${t.id}.html`]];
  const event = {'@context':'https://schema.org', '@type':'SportsEvent', name:`${t.name} 2026`, sport:'Tennis', url:`${SITE}tournament/${t.id}.html`,
    startDate:t.s, endDate:t.e, eventStatus:EVSTATUS, eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode', description:desc,
    location:{'@type':'Place', name:t.city, address:{'@type':'PostalAddress', addressLocality:t.city, addressCountry:t.co}, geo:{'@type':'GeoCoordinates', latitude:t.lat, longitude:t.lon}},
    ...(Object.keys(t.w || {}).length ? {sameAs:Object.keys(t.w).map(k => V.SRC[`${t.id}/${k}`]?.u).filter(Boolean)} : {})};
  const live = st === 'live' && hasDraw;
  const body = live ? `<p class="livestamp" id="livestamp" hidden></p>
<div id="tbody">${V.tournamentBody(t)}</div>
<script>setBase('../'); liveWatch(() => { $('#tbody').innerHTML = tournamentBody(TBY['${t.id}']); }, '${t.id}');</script>` : V.tournamentBody(t);
  write(`tournament/${t.id}.html`, doc({title, desc, path:`tournament/${t.id}.html`, jsonld:[crumbsLd(crumbs), event],
    head:live ? `${FONTS('../')}\n${scripts({live:true, poll:true}, '../')}` : FONTS('../'), body:sub('season', crumbs, body)}));
}
for (const s of Object.keys(V.PEOPLE)){
  const name = V.pName(s), top = V.TOP[s], r = V.record(s), tour = V.pTour(s);
  const title = `${name} 2026: Results, Form, Head-to-Head & Surface Record | ${BRAND}`;
  const desc = `${name}${top ? `, world No. ${top.rk} (${tour})` : ` (${tour})`}: ${r.w}–${r.l} in covered 2026 draws, last 10 matches, win rate on hard, clay and grass, head-to-head records and Elo rating.`;
  const crumbs = [['Home', ''], ['Players', 'players.html'], [name, `player/${s}.html`]];
  const person = {'@type':'Person', name, url:`${SITE}player/${s}.html`, sameAs:[V.pWiki(s)],
    ...(top ? {birthDate:top.b, nationality:{'@type':'Country', name:top.co}} : {})};
  const profile = {'@context':'https://schema.org', '@type':'ProfilePage', url:`${SITE}player/${s}.html`, name:title, dateModified:V.FETCHED, mainEntity:person};
  write(`player/${s}.html`, doc({title, desc, path:`player/${s}.html`, type:'profile', head:FONTS('../'), jsonld:[crumbsLd(crumbs), profile],
    body:sub('players', crumbs, V.playerBody(s))}));
}

fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${V.FETCHED.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
console.log(`built ${urls.length} pages (${V.T.length} tournaments, ${Object.keys(V.PEOPLE).length} players), sitemap.xml, robots.txt, ${ASSETS.join(' ')}`);
