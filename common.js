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
function hbars(box, rows, max, ticks, unit){
  box.innerHTML = rows.map(r => `<div class="hb${r.me ? ' me' : ''}" title="${r.tip}"><span class="nm">${r.n}</span><span class="track"><span class="fill" style="width:${Math.max(.5, r.v/max*100)}%"></span></span><span class="v">${r.v.toLocaleString('en-US')}${unit}</span></div>`).join('')
    + `<div class="axis"><span></span><div>${ticks.map(t => `<span>${t.toLocaleString('en-US')}</span>`).join('')}</div><span></span></div>`;
}

function segInit(id, cb){
  document.querySelectorAll(`#${id} button`).forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll(`#${id} button`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cb(b.dataset.v);
  }));
}
