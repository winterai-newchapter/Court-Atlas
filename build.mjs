// Builds the Court Atlas site from src/ into the workspace root.
// Also writes .artifact/index.html, a head-less copy of the home page for publishing as a claude.ai artifact.
import fs from 'fs';
const OUT = '.';
const PAGES = [
  {f:'season',  t:'Season Map', map:true},
  {f:'history', t:'History'},
  {f:'archive', t:'Past Champions'},
  {f:'rackets', t:'Rackets'},
  {f:'strings', t:'Strings'},
  {f:'players', t:'Players'},
  {f:'stats',   t:'Statistics'},
];
const ASSETS = ['styles.css','data.js','common.js','map.js'];
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="styles.css">`;
const header = cur => `<header class="top"><div class="wrap">
  <a class="brand" href="index.html"><b>Court Atlas</b><span>2026 season</span></a>
  <nav id="nav">${PAGES.map(p => `<a href="${p.f}.html"${p.f === cur ? ' class="on" aria-current="page"' : ''}>${p.t}</a>`).join('')}</nav>
</div></header>`;
const footer = `<footer><p>Data: Wikipedia’s 2026 ATP Tour, WTA Tour, ATP Masters 1000 and WTA 1000 pages and the ATP/WTA rankings of September 28, 2026, compiled on October 5, 2026. Some ATP 250 and 500 dates are by tournament week, and events from October on may change. Finals without a confirmed score are marked “Score not recorded”. Racket specs are manufacturer figures.</p></footer>`;
const scripts = map => `${map ? '<script src="map.js"></script>\n' : ''}<script src="data.js"></script>\n<script src="common.js"></script>`;
const doc = (title, head, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
${head}
</head>
<body>
${body}
</body>
</html>
`;

for (const f of ASSETS) fs.copyFileSync(`src/${f}`, `${OUT}/${f}`);

// Home page
const homeBody = `${header('')}
<main class="wrap">
${fs.readFileSync('src/pages/index.html','utf8')}
</main>
<div class="wrap">${footer}</div>`;
const homeHead = `${FONTS}\n${scripts(true)}`;
fs.writeFileSync(`${OUT}/index.html`, doc('Court Atlas', homeHead, homeBody));
fs.mkdirSync('.artifact', {recursive:true});
fs.writeFileSync('.artifact/index.html', `<title>Court Atlas</title>\n${homeHead}\n${homeBody}\n`);

// Topic pages
PAGES.forEach((p, i) => {
  const prev = PAGES[i-1], next = PAGES[i+1];
  const np = `<nav class="nextprev" aria-label="More topics">
  ${prev ? `<a href="${prev.f}.html"><small>← Previous</small><b>${prev.t}</b></a>` : `<a href="index.html"><small>← Back to</small><b>Home</b></a>`}
  ${next ? `<a class="next" href="${next.f}.html"><small>Next →</small><b>${next.t}</b></a>` : `<a class="next" href="index.html"><small>Back to →</small><b>Home</b></a>`}
</nav>`;
  fs.writeFileSync(`${OUT}/${p.f}.html`, doc(`${p.t} · Court Atlas`, `${FONTS}\n${scripts(p.map)}`, `${header(p.f)}
<main class="wrap page">
<p class="crumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>${p.t}</span></p>
${fs.readFileSync(`src/pages/${p.f}.html`,'utf8')}
${np}
</main>
<div class="wrap">${footer}</div>`));
});
console.log('built:', ['index.html', ...PAGES.map(p => p.f + '.html'), ...ASSETS].join(' '));
