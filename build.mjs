// Builds the Court Atlas site from src/ into the workspace root.
// Topic pages come from src/pages/; tournament/<id>.html and player/<slug>.html are rendered here with src/views.js.
// Also writes sitemap.xml, robots.txt and .artifact/index.html, a head-less copy of the home page for publishing as a claude.ai artifact.
// Refresh draws first with: node scripts/fetch-draws.mjs
import fs from 'fs';
const OUT = '.';
// Canonical origin for <link rel="canonical">, Open Graph and structured data. Change it if the site moves.
const SITE = 'https://winterai-newchapter.github.io/court-atlas/';
const BRAND = 'Court Atlas';

const PAGES = [
  {f:'season',  t:'Season Map', map:true, live:true,
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
   title:'Tennis Strings Guide & kg–lbs Tension Converter | Court Atlas',
   desc:'Polyester, natural gut, multifilament, synthetic gut and hybrid strings compared, with a tension converter and gauge chart.'},
  {f:'players', t:'Players', live:true,
   title:'ATP & WTA Top 10 Players 2026: Profiles, Form & Records | Court Atlas',
   desc:'Profiles of the 2026 ATP and WTA top 10 with recent form, win rate by surface and Elo, plus a page for every player in the covered draws.'},
  {f:'stats',   t:'Statistics', live:true,
   title:'2026 Tennis Statistics: Ranking Points, Titles & Majors | Court Atlas',
   desc:'Charts of 2026 ATP and WTA ranking points, title counts across covered tournaments and career Grand Slam titles for the top 10.'},
];
const HOME = {title:'Court Atlas: 2026 ATP & WTA Tennis Season Map, Draws & Results',
  desc:'Follow the 2026 tennis season: a world map of ATP and WTA tournaments, live draws with win probabilities, player form and past champions.'};
const ASSETS = ['styles.css','data.js','draws.js','common.js','views.js','map.js'];

// The same data and view code the browser runs, evaluated here to render static pages
const V = new Function(['data.js','draws.js','common.js','views.js'].map(f => fs.readFileSync(`src/${f}`, 'utf8')).join('\n;\n')
  + '\nreturn {T, LV, SF, PEOPLE, DRAWS, SRC, FETCHED, TOP, MATCHES, setBase, methodNote, tournamentBody, playerBody, status, range, pTour, record, esc, utc, pName, pWiki, drawKeys};')();

const FONTS = base => `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="${base}styles.css">`;
const header = (cur, base = '') => `<header class="top"><div class="wrap">
  <a class="brand" href="${base}index.html"><b>Court Atlas</b><span>2026 season</span></a>
  <nav id="nav">${PAGES.map(p => `<a href="${base}${p.f}.html"${p.f === cur ? ' class="on" aria-current="page"' : ''}>${p.t}</a>`).join('')}</nav>
</div></header>`;
const footer = base => `<footer><p>Data: draws, scores and finals from Wikipedia’s 2026 tournament pages, fetched ${V.utc(V.FETCHED)} (each section links its page and revision time). Rankings from Wikipedia’s ATP and WTA rankings pages, September 28, 2026; profiles, history and equipment compiled October 5, 2026. Some ATP 250 and 500 dates are by tournament week, and events from October on may change. Win probabilities are an Elo estimate from covered matches, <a href="${base}players.html#method">explained here</a>. Racket specs are manufacturer figures.</p></footer>`;
const scripts = (p, base) => [p.map && 'map.js', 'data.js', p.live && 'draws.js', 'common.js', p.live && 'views.js']
  .filter(Boolean).map(f => `<script src="${base}${f}"></script>`).join('\n');

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
const homeHead = `${FONTS('')}\n${scripts({map:true, live:true}, '')}`;
write('index.html', doc({title:HOME.title, desc:HOME.desc, path:'', head:homeHead, body:homeBody, jsonld:[WEBSITE]}));
fs.mkdirSync('.artifact', {recursive:true});
fs.writeFileSync('.artifact/index.html', `<title>${BRAND}</title>\n${homeHead}\n${homeBody}\n`);

// Static index of every player with a page, injected into players.html so each profile is one plain link away
const byTour = tour => Object.keys(V.PEOPLE).filter(s => V.pTour(s) === tour).sort((a, b) => V.pName(a).localeCompare(V.pName(b)));
const allPlayers = ['ATP','WTA'].map(tour => `<details class="round allp"><summary>${tour === 'ATP' ? 'ATP men' : 'WTA women'} <span class="ex">${byTour(tour).length} players</span></summary><ul class="plinks">${byTour(tour).map(s => `<li><a class="pl" href="player/${s}.html">${V.esc(V.pName(s))}</a></li>`).join('')}</ul></details>`).join('');

// Topic pages
const pageLd = {
  season: () => ({'@context':'https://schema.org', '@type':'ItemList', name:'2026 tennis tournaments',
    itemListElement: V.T.map((t, i) => ({'@type':'ListItem', position:i + 1, url:`${SITE}tournament/${t.id}.html`, name:t.name}))}),
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
  const src = fs.readFileSync(`src/pages/${p.f}.html`, 'utf8').replace('<!--ALL_PLAYERS-->', allPlayers).replace('<!--METHOD-->', V.methodNote());
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

// Tournament and player pages: static HTML, no scripts
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
  write(`tournament/${t.id}.html`, doc({title, desc, path:`tournament/${t.id}.html`, head:FONTS('../'), jsonld:[crumbsLd(crumbs), event],
    body:sub('season', crumbs, V.tournamentBody(t))}));
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
