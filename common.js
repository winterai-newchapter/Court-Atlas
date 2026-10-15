/* Shared helpers for every Court Atlas page */
const $ = s => document.querySelector(s);
const SVGNS = 'http://www.w3.org/2000/svg';
const SVG_TAGS = ['svg','g','path','circle','rect','text','line','title','a'];
const el = (tag, attrs={}, html='') => {
  const n = SVG_TAGS.includes(tag) ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (html !== '') n.innerHTML = html;
  return n;
};
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const d = s => new Date(s + 'T12:00:00');
const fmt = s => { const x = d(s); return `${MON[x.getMonth()]} ${x.getDate()}`; };
const range = t => { const a = d(t.s), b = d(t.e); return a.getMonth() === b.getMonth() ? `${MON[a.getMonth()]} ${a.getDate()}–${b.getDate()}` : `${fmt(t.s)} – ${fmt(t.e)}`; };
const status = t => TODAY < d(t.s) ? 'up' : (TODAY > d(t.e) ? 'done' : 'live');
const ST = {done:'Completed', live:'In progress', up:'Upcoming'};
const monthsOf = t => { const a = d(t.s).getMonth(), b = d(t.e).getMonth(); const r = []; for (let m = a; m <= b; m++) r.push(m); return r; };
const age = b => { const x = d(b); let a = TODAY.getFullYear() - x.getFullYear(); if (TODAY < new Date(TODAY.getFullYear(), x.getMonth(), x.getDate())) a--; return a; };

/* Equal Earth projection matching the pre-projected land paths in map.js */
function project(lon, lat){
  const A1=1.340264, A2=-0.081106, A3=0.000893, A4=0.003796, M=Math.sqrt(3)/2;
  const lam = lon*Math.PI/180, phi = lat*Math.PI/180;
  const l = Math.asin(M*Math.sin(phi)), l2 = l*l, l6 = l2*l2*l2;
  const x = lam*Math.cos(l)/(M*(A1 + 3*A2*l2 + l6*(7*A3 + 9*A4*l2)));
  const y = l*(A1 + A2*l2 + l6*(A3 + A4*l2));
  return [MAP.t[0] + MAP.s*x, MAP.t[1] - MAP.s*y];
}
function surfaceShape(sf, x, y, r){
  if (sf === 'hard') return el('circle', {class:'shape', cx:x, cy:y, r, fill:'var(--hard)'});
  if (sf === 'clay') return el('rect', {class:'shape', x:x-r*.88, y:y-r*.88, width:r*1.76, height:r*1.76, fill:'var(--clay)'});
  return el('path', {class:'shape', d:`M${x} ${y-r*1.15}L${x+r*1.15} ${y}L${x} ${y+r*1.15}L${x-r*1.15} ${y}Z`, fill:'var(--grass)'});
}

/* Horizontal bar chart: rows [{n, v, tip, me}] */
const hbarsHtml = (rows, max, ticks, unit) => rows.map(r => `<div class="hb${r.me ? ' me' : ''}" title="${r.tip}"><span class="nm">${r.n}</span><span class="track"><span class="fill" style="width:${Math.max(.5, r.v/max*100)}%"></span></span><span class="v">${r.v.toLocaleString('en-US')}${unit}</span></div>`).join('')
  + `<div class="axis"><span></span><div>${ticks.map(t => `<span>${t.toLocaleString('en-US')}</span>`).join('')}</div><span></span></div>`;
function hbars(box, rows, max, ticks, unit){ box.innerHTML = hbarsHtml(rows, max, ticks, unit); }

/* ---------- topic page content ----------
   Tables and lists the History, Past Champions and Rackets pages show. build.mjs writes them into the static HTML
   so search engines and AI crawlers that do not run JavaScript can read them; the pages re-render them when filtered. */
const timelineHtml = () => HISTORY.map(h => `<li class="${h.big ? 'big' : ''}"><div class="yr">${h.y}</div><h3>${h.t}</h3><p>${h.d}</p></li>`).join('');
const recordsHtml = () => `<thead><tr><th></th><th>Player</th><th>Country</th><th class="n">Titles</th></tr></thead><tbody>${RECORDS.map(r => `<tr><td class="ex">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="n">${r[3]}</td></tr>`).join('')}</tbody>`;
const slam4Html = () => SLAMS.map(s => `<div><b><i class="dot ${s.sf}"></i>${s.n}</b><span class="ex">${s.d}</span></div>`).join('');
const racketTable = (list = RACKETS, sel = null) => `<thead><tr><th>Model</th><th class="n">Head</th><th class="n">Weight</th><th>Pattern</th><th>Played by (line)</th></tr></thead><tbody>${list.map(r => `<tr class="${sel === r.m ? 'hl' : ''}"><td>${r.m}</td><td class="n">${r.h}</td><td class="n">${r.w} g</td><td class="mono">${r.p}</td><td class="ex">${r.who || '—'}</td></tr>`).join('')}</tbody>`;

// Past Champions: PAST_SLAMS merged with this season's finished Slam finals from T.
// A view is {tour:'all'|'ATP'|'WTA', era:'all'|'2000'|…, who:highlighted name or null, col:highlighted Slam column or -1}
const SLAM_IDS = ['ao','rg','wim','uso'];
const CHAMPS = {ATP:{...PAST_SLAMS.ATP}, WTA:{...PAST_SLAMS.WTA}};
['ATP','WTA'].forEach(tour => {
  const row = SLAM_IDS.map(id => { const r = T.find(t => t.id === id).res.find(x => x.t === tour); return r ? r.w : undefined; });
  if (row.some(Boolean)) CHAMPS[tour][2026] = row;
});
const archTours = A => A.tour === 'all' ? ['ATP','WTA'] : [A.tour];
const archYears = A => Object.keys(CHAMPS.ATP).map(Number).filter(y => A.era === 'all' || (y >= +A.era && y < +A.era + 10)).sort((a,b) => b - a);
function champsTable(A){
  const name = (n, tour) => n === null ? '<span class="ex">Not held</span>' : n === undefined ? '<span class="ex">—</span>'
    : `<button type="button" class="who${A.who === n ? ' on' : ''}" data-n="${n}">${n}</button>${A.tour === 'all' ? ` <small class="ex">${tour}</small>` : ''}`;
  return `<thead><tr><th>Year</th>${SLAMS.map((s, i) => `<th class="${A.col === i ? 'col' : ''}"><i class="dot ${s.sf}"></i> ${s.n}</th>`).join('')}</tr></thead>
  <tbody>${archYears(A).map(y => `<tr><td class="n">${y}</td>${SLAMS.map((s, i) => `<td class="${A.col === i ? 'col' : ''}">${archTours(A).map(t => `<div>${name((CHAMPS[t][y] || [])[i], t)}</div>`).join('')}</td>`).join('')}</tr>`).join('')}</tbody>`;
}
// Most-majors leaderboard: the rows (for click handlers), the panel's title and caption, and the bars
function champsBoard(A){
  const c = {}, ys = archYears(A);
  ys.forEach(y => archTours(A).forEach(t => (CHAMPS[t][y] || []).forEach((n, i) => {
    if (!n) return;
    (c[n] = c[n] || {n, t, v:0, ev:[]}); c[n].v++; c[n].ev.push(`${SLAMS[i].n} ${y}`);
  })));
  const rows = Object.values(c).sort((a,b) => b.v - a.v || a.n.localeCompare(b.n)).slice(0, 12);
  const max = Math.max(4, Math.ceil(rows[0].v / 4) * 4);
  return {rows, title:`Most majors${A.tour === 'all' ? '' : `, ${A.tour}`}`, cap:`Singles titles won ${ys[ys.length-1]}–${ys[0]}`,
    html:hbarsHtml(rows.map(r => ({n:`${r.n}${A.tour === 'all' ? ` (${r.t})` : ''}`, v:r.v, me:A.who === r.n, tip:`${r.n} · ${r.ev.join(', ')}`})), max, [0, max/4, max/2, max*3/4, max], '')};
}

function segInit(id, cb){
  document.querySelectorAll(`#${id} button`).forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll(`#${id} button`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cb(b.dataset.v);
  }));
}

/* Product-page links for a STRING_DB entry at Tennis Warehouse and Amazon, driven by SHOP in data.js */
function buyLinks(x){
  if (typeof SHOP === 'undefined') return '';
  const tw = `https://www.tennis-warehouse.com/${x.tw}`;
  const shops = [
    ['Tennis Warehouse', SHOP.twLink ? SHOP.twLink.replace('{url}', encodeURIComponent(tw)) : tw, !!SHOP.twLink],
    ['Amazon', `https://www.amazon.com/dp/${x.amz}${SHOP.amazonTag ? `?tag=${encodeURIComponent(SHOP.amazonTag)}` : ''}`, !!SHOP.amazonTag],
  ];
  return shops.map(([name, url, paid]) => `<a class="buy" rel="${paid ? 'sponsored ' : ''}nofollow noopener" target="_blank" href="${esc(url)}">${name}</a>`).join('');
}
const affNote = () => (typeof SHOP !== 'undefined' && (SHOP.amazonTag || SHOP.twLink))
  ? 'Shop links are affiliate links: Court Atlas may earn a commission at no extra cost to you. Recommendations are not paid for.' : '';

/* Library swatch for a STRING_DB entry: a patch of string bed in the string's colour, with its cross-section in the corner.
   Hybrids show mains and crosses in their two colours. A product photo (img) replaces it when one is set. */
function stringSwatch(x){
  if (x.img) return `<img class="swatch" src="${esc(x.img)}" alt="${esc(x.n)}" width="64" height="64" loading="lazy">`;
  const [m, c = m] = x.col, line = '#7d847f';
  const xs = [10, 22, 34, 46];
  const mains = xs.map(v => `<rect x="${v - 3}" y="2" width="6" height="52" rx="3" fill="${m}" stroke="${line}" stroke-width=".8"/>`).join('');
  // crosses weave over and under the mains
  const crosses = xs.map((v, i) => `<rect x="2" y="${v - 3}" width="52" height="6" rx="3" fill="${c}" stroke="${line}" stroke-width=".8"/>`
    + xs.filter((_, j) => (i + j) % 2).map(u => `<rect x="${u - 3}" y="${v - 3.5}" width="6" height="7" fill="${m}"/><path d="M${u - 3} ${v - 3.5}v7M${u + 3} ${v - 3.5}v7" stroke="${line}" stroke-width=".8"/>`).join('')).join('');
  const r = 7, cx = 55, cy = 55;
  const poly = k => Array.from({length:k}, (_, i) => { const a = Math.PI * 2 * i / k + Math.PI / k; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const prof = x.pf === 'round' ? `<circle cx="${cx}" cy="${cy}" r="${r}"/>` : `<polygon points="${poly({oct:8, hex:6, sq:4}[x.pf])}"/>`;
  return `<svg class="swatch" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${esc(`${x.n}: ${x.sh.toLowerCase()} string`)}">`
    + `<rect width="64" height="64" rx="10" fill="var(--sunk)"/>${mains}${crosses}`
    + `<circle cx="${cx}" cy="${cy}" r="${r + 2.5}" fill="var(--surface)" stroke="var(--line)"/><g fill="${m}" stroke="${line}" stroke-width="1.2">${prof}</g></svg>`;
}
