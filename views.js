/* Match records, Elo model and HTML builders. Used by the browser pages and by build.mjs,
   which renders the static tournament/ and player/ pages with the same functions. Needs data.js, draws.js and common.js. */
let BASE = '';
const setBase = b => { BASE = b; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
const slugify = n => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/ø/g, 'o').replace(/đ/g, 'd')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const TBY = Object.fromEntries(T.map(t => [t.id, t]));
const TOP = {};
['ATP','WTA'].forEach(tour => PLAYERS[tour].forEach(p => { TOP[slugify(p.n)] = {...p, tour}; }));
const TOURLABEL = {ATP:'ATP singles', WTA:'WTA singles'};

const pName = s => PEOPLE[s] ? PEOPLE[s][0] : s;
const wikiUrl = title => 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_'));
const pWiki = s => wikiUrl(PEOPLE[s][2] || PEOPLE[s][0]);
const pHref = s => `${BASE}player/${s}.html`;
const tHref = t => `${BASE}tournament/${t.id}.html`;
const pLink = (s, label) => PEOPLE[s] ? `<a class="pl" href="${pHref(s)}">${esc(label || pName(s))}</a>` : esc(label || s);
// For names typed into data.js (finals, rankings): link when the player appears in a covered draw
const nameLink = n => PEOPLE[slugify(n)] ? pLink(slugify(n), n) : esc(n);

const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const utc = iso => { const x = new Date(iso); return `${MON3[x.getUTCMonth()]} ${x.getUTCDate()}, ${x.getUTCFullYear()}, ${String(x.getUTCHours()).padStart(2,'0')}:${String(x.getUTCMinutes()).padStart(2,'0')} UTC`; };
const COMPILED = 'October 5, 2026';

/* ---------- sources ---------- */
const RANK_SRC = {ATP:wikiUrl('ATP rankings'), WTA:wikiUrl('WTA rankings')};
const srcTitle = u => decodeURIComponent(u.split('/wiki/')[1]).replace(/_/g, ' ');
// One attribution line for a draw/result page: link, revision time, fetch time
const srcLine = key => {
  const s = SRC[key];
  if (!s) return `<p class="src">Source: entered by hand from Wikipedia’s 2026 season pages · compiled ${COMPILED}</p>`;
  return `<p class="src">Source: <a href="${s.u}" rel="external">Wikipedia, ${esc(srcTitle(s.u))}</a> · page revised <time datetime="${s.at}">${utc(s.at)}</time> · fetched <time datetime="${FETCHED}">${utc(FETCHED)}</time></p>`;
};
const srcStatic = (links, note) => `<p class="src">Source: ${links.map(([u, l]) => `<a href="${u}" rel="external">${esc(l)}</a>`).join(', ')}${note ? ` · ${note}` : ''}</p>`;

/* ---------- matches ---------- */
const ROUND_ORDER = ['first round','second round','third round','fourth round','quarterfinals','semifinals','final'];
const rIx = label => { const i = ROUND_ORDER.indexOf(label.toLowerCase()); return i < 0 ? 99 : i; };
// MATCHES, BYP and ELO are filled by reindex() below, and rebuilt in place when live.js brings in newer draws
const MATCHES = [];
const played = m => m.w >= 0;
const counts = m => m.w >= 0 && !m.wo;       // walkovers are listed but never counted
const winner = m => m.w === 0 ? m.a : m.b;
const loser = m => m.w === 0 ? m.b : m.a;
const opp = (m, s) => m.a === s ? m.b : m.a;
const BYP = {};
const pMatches = s => BYP[s] || [];
const pTour = s => (pMatches(s)[0] || {}).tour || (TOP[s] || {}).tour || '';

function record(s, f = () => true){
  let w = 0, l = 0;
  pMatches(s).filter(m => counts(m) && f(m)).forEach(m => winner(m) === s ? w++ : l++);
  return {w, l, n:w + l, pct:w + l ? w / (w + l) : null};
}
const surfaceRec = s => Object.fromEntries(['hard','clay','grass'].map(sf => [sf, record(s, m => m.t.sf === sf)]));
const recent = (s, n = 10) => pMatches(s).filter(counts).slice(-n).reverse();
const h2h = (a, b) => pMatches(a).filter(m => opp(m, a) === b);
const titles = s => pMatches(s).filter(m => played(m) && m.round.toLowerCase() === 'final' && winner(m) === s);

/* ---------- Elo ----------
   Everyone starts at 1500. Each counted 2026 match moves both players by K·(result − expected),
   K = 250 / (matches played + 5)^0.4, so ratings settle as a player's sample grows (the FiveThirtyEight tennis Elo).
   A separate rating is kept per surface; a prediction blends overall and surface ratings 50/50. */
const ELO0 = 1500;
const ELO = {};
const eloOf = s => ELO[s] || (ELO[s] = {r:ELO0, n:0, sf:{hard:{r:ELO0, n:0}, clay:{r:ELO0, n:0}, grass:{r:ELO0, n:0}}});
const expect = (ra, rb) => 1 / (1 + Math.pow(10, (rb - ra) / 400));
const kf = n => 250 / Math.pow(n + 5, .4);
const eloStep = (a, b) => { const e = expect(a.r, b.r), ka = kf(a.n), kb = kf(b.n); a.r += ka * (1 - e); b.r -= kb * (1 - e); a.n++; b.n++; };
const blended = (s, sf) => { const e = eloOf(s); return .5 * e.r + .5 * e.sf[sf].r; };
function predict(a, b, sf){
  const ra = blended(a, sf), rb = blended(b, sf);
  return {p:expect(ra, rb), ra, rb, ea:eloOf(a), eb:eloOf(b), thin:eloOf(a).n < 8 || eloOf(b).n < 8};
}
const eloRank = tour => Object.keys(ELO).filter(s => pTour(s) === tour && ELO[s].n >= 10).sort((x, y) => ELO[y].r - ELO[x].r);

function reindex(){
  MATCHES.length = 0;
  for (const k in BYP) delete BYP[k];
  for (const k in ELO) delete ELO[k];
  for (const [key, dr] of Object.entries(DRAWS)){
    const [id, tour] = key.split('/'), t = TBY[id];
    dr.m.forEach(([ri, a, b, w, sc]) => MATCHES.push({key, t, tour, round:dr.rounds[ri], ro:rIx(dr.rounds[ri]), a, b, w, sc, wo:sc === 'w/o'}));
    // A final decided in the draw counts as the result even before it is entered by hand in data.js
    const fin = dr.m.find(([ri, , , w]) => w >= 0 && dr.rounds[ri].toLowerCase() === 'final');
    if (fin && !t.res.some(r => r.t === tour)){
      const [, a, b, w, sc] = fin;
      t.res.push({t:tour, w:pName(w === 0 ? a : b), r:pName(w === 0 ? b : a), sc});
    }
  }
  MATCHES.sort((x, y) => d(x.t.s) - d(y.t.s) || x.t.id.localeCompare(y.t.id) || x.ro - y.ro);
  MATCHES.forEach(m => [m.a, m.b].forEach(s => (BYP[s] = BYP[s] || []).push(m)));
  MATCHES.filter(counts).forEach(m => {
    const W = eloOf(winner(m)), L = eloOf(loser(m));
    eloStep(W, L); eloStep(W.sf[m.t.sf], L.sf[m.t.sf]);
  });
}
reindex();

/* ---------- draw state ---------- */
const drawKeys = t => Object.keys(DRAWS).filter(k => k.startsWith(t.id + '/'));
const pending = key => MATCHES.filter(m => m.key === key && m.w < 0);
function entrants(key){
  const dr = DRAWS[key], ms = MATCHES.filter(m => m.key === key);
  const num = s => /^\d+$/.test(dr.e[s]) ? +dr.e[s] : 999;
  return Object.keys(dr.e).map(s => {
    const lost = ms.find(m => played(m) && loser(m) === s);
    const won = ms.find(m => played(m) && m.round.toLowerCase() === 'final' && winner(m) === s);
    const next = ms.find(m => m.w < 0 && (m.a === s || m.b === s));
    return {s, seed:dr.e[s], lost, won, next, out:!!lost};
  }).sort((x, y) => num(x.s) - num(y.s) || x.out - y.out || pName(x.s).localeCompare(pName(y.s)));
}

/* ---------- HTML pieces ---------- */
const pct = x => x === null ? '—' : Math.round(x * 100) + '%';
const formChips = s => `<span class="form">${recent(s, 10).reverse().map(m => {
  const w = winner(m) === s;
  return `<i class="${w ? 'w' : 'l'}" title="${w ? 'Won' : 'Lost'} vs ${esc(pName(opp(m, s)))} · ${esc(m.t.name)}, ${esc(m.round)}${m.sc ? ' · ' + esc(m.sc) : ''}">${w ? 'W' : 'L'}</i>`;
}).join('')}</span>`;
const surfaceTable = s => {
  const r = surfaceRec(s);
  return `<div class="sfrec">${['hard','clay','grass'].map(sf => `<div><span><i class="dot ${sf}"></i>${SF[sf]}</span><span class="track"><span class="fill ${sf}" style="width:${r[sf].pct === null ? 0 : r[sf].pct * 100}%"></span></span><b class="mono">${pct(r[sf].pct)}</b><span class="ex mono">${r[sf].w}–${r[sf].l}</span></div>`).join('')}</div>`;
};
const r0 = x => Math.round(x);
// A pending match with both players known: probability bar plus the full working
function predCard(m){
  const sf = m.t.sf, P = predict(m.a, m.b, sf), pa = P.p, pb = 1 - pa;
  const sa = surfaceRec(m.a)[sf], sb = surfaceRec(m.b)[sf], ra = record(m.a), rb = record(m.b);
  const ms = h2h(m.a, m.b).filter(counts), wa = ms.filter(x => winner(x) === m.a).length;
  const seed = s => { const e = DRAWS[m.key].e[s]; return e ? ` <span class="ex">(${esc(e)})</span>` : ''; };
  return `<div class="pred">
  <p class="eyebrow">${esc(m.round)} · ${esc(m.tour)}</p>
  <div class="pn"><span>${pLink(m.a)}${seed(m.a)}</span><b class="mono">${pct(pa)}</b></div>
  <div class="pbar" role="img" aria-label="Win probability: ${esc(pName(m.a))} ${pct(pa)}, ${esc(pName(m.b))} ${pct(pb)}"><span style="width:${pa * 100}%"></span></div>
  <div class="pn"><span>${pLink(m.b)}${seed(m.b)}</span><b class="mono">${pct(pb)}</b></div>
  ${P.thin ? '<p class="ex warn">Low confidence: one player has fewer than 8 rated matches.</p>' : ''}
  <details class="why"><summary>How this is calculated</summary>
    <table class="basis"><thead><tr><th></th><th>${esc(pName(m.a))}</th><th>${esc(pName(m.b))}</th></tr></thead><tbody>
      <tr><td>Overall Elo</td><td class="mono">${r0(P.ea.r)} <span class="ex">(${P.ea.n} m)</span></td><td class="mono">${r0(P.eb.r)} <span class="ex">(${P.eb.n} m)</span></td></tr>
      <tr><td>${SF[sf]}-court Elo</td><td class="mono">${r0(P.ea.sf[sf].r)} <span class="ex">(${P.ea.sf[sf].n} m)</span></td><td class="mono">${r0(P.eb.sf[sf].r)} <span class="ex">(${P.eb.sf[sf].n} m)</span></td></tr>
      <tr><td>Blended (50/50)</td><td class="mono"><b>${r0(P.ra)}</b></td><td class="mono"><b>${r0(P.rb)}</b></td></tr>
      <tr><td>2026 record</td><td class="mono">${ra.w}–${ra.l}</td><td class="mono">${rb.w}–${rb.l}</td></tr>
      <tr><td>${SF[sf]}-court record</td><td class="mono">${sa.w}–${sa.l} · ${pct(sa.pct)}</td><td class="mono">${sb.w}–${sb.l} · ${pct(sb.pct)}</td></tr>
      <tr><td>Head-to-head</td><td class="mono">${wa}</td><td class="mono">${ms.length - wa}</td></tr>
      <tr><td>Last 10</td><td>${formChips(m.a)}</td><td>${formChips(m.b)}</td></tr>
    </tbody></table>
    <p class="ex">P(${esc(pName(m.a))}) = 1 / (1 + 10<sup>(${r0(P.rb)} − ${r0(P.ra)}) / 400</sup>) = <b>${pct(pa)}</b>. Records, head-to-head and form are shown for context; they already feed the Elo ratings and are not added again. <a href="${BASE}players.html#method">About the model</a></p>
  </details>
</div>`;
}
const matchLine = (m, focus) => {
  if (!played(m)) return `<li><span>${pLink(m.a)} <span class="ex">vs</span> ${pLink(m.b)}</span><span class="st up">Not played</span></li>`;
  const w = winner(m), l = loser(m);
  return `<li class="${focus ? (w === focus ? 'won' : 'lost') : ''}"><span><b>${pLink(w)}</b> <span class="ex">d.</span> ${pLink(l)}</span><span class="mono ex">${esc(m.sc || '—')}</span></li>`;
};
const methodNote = () => `<div class="panel method" id="method">
  <h3>How the win probabilities work</h3>
  <p>Every completed match in the 2026 draws this site covers (${MATCHES.filter(counts).length.toLocaleString('en-US')} matches from ${Object.keys(DRAWS).length} Wikipedia draw pages, walkovers excluded) updates an Elo rating. Everyone starts at ${ELO0}; after each match the winner gains and the loser drops K × (1 − expected score), with K = 250 / (matches played + 5)<sup>0.4</sup>, so a player’s rating moves less as their record grows. A separate rating is kept for hard, clay and grass. For a match, each player’s overall and surface ratings are averaged, and the chance of winning is 1 / (1 + 10<sup>(opponent − player) / 400</sup>).</p>
  <p class="ex">Limits: only covered tournaments count (no Challengers, qualifying or most 250s), every rating starts fresh in January, and injuries or retirements mid-event are not modelled. Treat the numbers as an estimate, not a forecast.</p>
</div>`;

/* ---------- full pages ---------- */
function tournamentBody(t){
  const st = status(t), keys = drawKeys(t);
  const res = t.res.length ? `<div class="panel tbox"><h2>Final${t.res.length > 1 ? 's' : ''}</h2><div class="res">${t.res.map(r => `<span class="tour">${r.t}</span><span>🏆 <b>${nameLink(r.w)}</b> <span class="ex">d.</span> ${nameLink(r.r)}</span><span class="score">${esc(r.sc)}</span>`).join('')}</div>
    ${t.note ? `<p class="ex">${esc(t.note)}</p>` : ''}
    ${t.res.map(r => srcLine(`${t.id}/${r.t === 'Mixed' ? 'Team' : r.t}`)).filter((x, i, a) => a.indexOf(x) === i).join('')}</div>` : '';
  const draws = keys.filter(k => !k.endsWith('/Team')).map(key => {
    const tour = key.split('/')[1], dr = DRAWS[key], pend = pending(key), ent = entrants(key);
    const alive = ent.filter(e => !e.out).length;
    const rounds = dr.rounds.map((r, i) => ({r, ms:MATCHES.filter(m => m.key === key && m.round === r)})).filter(x => x.ms.length);
    const cur = [...rounds].reverse().find(x => x.ms.some(played));
    return `<section class="tsec" id="${tour.toLowerCase()}">
  <div class="sec-head"><div><p class="eyebrow">${ent.length} players · ${alive} still in</p><h2>${TOURLABEL[tour]}</h2></div></div>
  ${pend.filter(m => m.a && m.b).length ? `<h3 class="subh">${st === 'up' ? 'First matches' : 'Next matches'}</h3><div class="preds">${pend.slice(0, st === 'up' ? 8 : 16).map(predCard).join('')}</div>` : ''}
  <h3 class="subh">Players</h3>
  <ul class="entrants">${ent.map(e => `<li class="${e.out ? 'out' : 'in'}"><span class="sd mono">${esc(e.seed)}</span>${pLink(e.s)} <span class="ex mono">${esc(PEOPLE[e.s][1])}</span><span class="ex">${e.won ? '🏆 Champion' : e.lost ? `Lost ${esc(e.lost.round.toLowerCase())}` : e.next ? `Next: ${esc(e.next.round.toLowerCase())}` : 'In'}</span></li>`).join('')}</ul>
  <h3 class="subh">Draw by round</h3>
  ${[...rounds].reverse().map(x => `<details class="round"${x === cur || x.ms.some(m => !played(m)) ? ' open' : ''}><summary>${esc(x.r)} <span class="ex">${x.ms.filter(played).length}/${x.ms.length} played</span></summary><ul class="mlist">${x.ms.map(m => matchLine(m)).join('')}</ul></details>`).join('')}
  ${srcLine(key)}
</section>`;
  }).join('');
  const none = !keys.filter(k => !k.endsWith('/Team')).length && t.lv !== 'Team'
    ? `<div class="panel tbox"><p>${st === 'done' ? 'The full draw for this event is not in the covered data yet.' : 'The draw has not been published yet. Players and match predictions appear here once it is out.'}${t.approx ? ' Dates are tentative and may change.' : ''}</p>${srcLine(null)}</div>` : '';
  return `<div class="page-head">
  <p class="eyebrow">${esc(t.city)}, ${esc(t.co)} · ${t.tour === 'BOTH' ? 'ATP &amp; WTA' : t.tour} ${LV[t.lv].n}</p>
  <h1>${esc(t.name)}</h1>
  <div class="meta"><span class="st ${st}">${ST[st]}</span><span class="chip mono">${range(t)}, 2026${t.approx ? ' (tentative)' : ''}</span><span class="chip"><i class="dot ${t.sf}"></i>${SF[t.sf]}${t.indoor ? ' · indoor' : ''}</span>${keys.filter(k => !k.endsWith('/Team')).map(k => `<a class="chip" href="#${k.split('/')[1].toLowerCase()}">${TOURLABEL[k.split('/')[1]]} draw ↓</a>`).join('')}</div>
</div>
${res}${none}${draws}
${draws.includes('class="pred"') ? `<section>${methodNote()}</section>` : ''}
<p class="tlinks"><a class="slamlink" href="${BASE}season.html#${t.id}">See it on the season map →</a>${t.lv === 'GS' ? ` <a class="slamlink" href="${BASE}archive.html#${t.id}">${esc(t.name)} champions since 2000 →</a>` : ''}</p>`;
}

function playerBody(s){
  const [name, flag] = PEOPLE[s], top = TOP[s], tour = pTour(s);
  const all = record(s), ms = pMatches(s), nxt = ms.filter(m => m.w < 0 && m.a && m.b), e = eloOf(s);
  const tl = titles(s), rk = eloRank(tour).indexOf(s);
  const opps = {};
  ms.filter(counts).forEach(m => { const o = opp(m, s); (opps[o] = opps[o] || {o, w:0, l:0, last:m}); winner(m) === s ? opps[o].w++ : opps[o].l++; opps[o].last = m; });
  const oppRows = Object.values(opps).sort((x, y) => (y.w + y.l) - (x.w + x.l) || MATCHES.indexOf(y.last) - MATCHES.indexOf(x.last));
  const byT = [];
  ms.forEach(m => { let g = byT.find(x => x.key === m.key); if (!g) byT.push(g = {key:m.key, t:m.t, ms:[]}); g.ms.push(m); });
  const keysUsed = [...new Set(ms.map(m => m.key))];
  return `<div class="page-head">
  <p class="eyebrow">${tour}${top ? ` · World No. ${top.rk}` : ''}${flag ? ` · ${esc(top ? top.co : flag)}` : ''}</p>
  <h1>${esc(name)}</h1>
  ${top ? `<p>${esc(top.style)}</p>` : ''}
</div>
<section class="pgrid">
  <div class="panel tbox">
    <h2>2026 at a glance</h2>
    <dl class="facts">
      <div><dt>Win–loss (covered events)</dt><dd class="num">${all.w}–${all.l} <span class="ex">${pct(all.pct)}</span></dd></div>
      <div><dt>Titles (covered events)</dt><dd class="num">${tl.length}${tl.length ? ` <span class="ex">${tl.map(m => esc(m.t.name)).join(', ')}</span>` : ''}</dd></div>
      <div><dt>Elo rating</dt><dd class="num">${r0(e.r)} <span class="ex">${rk >= 0 ? `No. ${rk + 1} on the ${tour} tour by Elo` : `from ${e.n} matches`}</span></dd></div>
      ${top ? `<div><dt>Ranking points</dt><dd class="num">${top.pts.toLocaleString('en-US')} <span class="ex">Sept 28, 2026</span></dd></div>
      <div><dt>Age</dt><dd class="num">${age(top.b)} <span class="ex">(born ${fmt(top.b)}, ${top.b.slice(0, 4)})</span></dd></div>
      <div><dt>Plays</dt><dd>${esc(top.h)}</dd></div>
      <div><dt>Career major singles titles</dt><dd class="num">${top.gs}</dd></div>
      <div><dt>Racket</dt><dd>${esc(top.racket)}</dd></div>` : ''}
    </dl>
  </div>
  <div class="panel tbox">
    <h2>Win rate by surface</h2>
    ${surfaceTable(s)}
    <h3 class="subh">Last 10 matches</h3>
    ${formChips(s)}
    <ul class="mlist">${recent(s, 10).map(m => `<li class="${winner(m) === s ? 'won' : 'lost'}"><span><b>${winner(m) === s ? 'W' : 'L'}</b> vs ${pLink(opp(m, s))} <span class="ex">· <a href="${tHref(m.t)}">${esc(m.t.name)}</a>, ${esc(m.round.toLowerCase())}</span></span><span class="mono ex">${esc(m.sc)}</span></li>`).join('')}</ul>
  </div>
</section>
${nxt.length ? `<section><div class="sec-head"><div><p class="eyebrow">${esc(nxt[0].t.name)}</p><h2>Next match</h2></div></div><div class="preds">${nxt.map(predCard).join('')}</div></section>` : ''}
<section>
  <div class="sec-head"><div><p class="eyebrow">Covered 2026 draws</p><h2>Head-to-head</h2></div></div>
  <div class="panel tablebox" style="padding:8px 14px"><table><thead><tr><th>Opponent</th><th class="n">W–L</th><th>Last meeting</th></tr></thead><tbody>
  ${oppRows.map(r => `<tr><td>${pLink(r.o)}</td><td class="n mono">${r.w}–${r.l}</td><td><span class="ex"><a href="${tHref(r.last.t)}">${esc(r.last.t.name)}</a>, ${esc(r.last.round.toLowerCase())} · ${winner(r.last) === s ? 'won' : 'lost'} ${esc(r.last.sc)}</span></td></tr>`).join('')}
  </tbody></table></div>
</section>
<section>
  <div class="sec-head"><div><p class="eyebrow">${ms.length} matches</p><h2>All 2026 results</h2></div></div>
  ${[...byT].reverse().map(g => `<details class="round"><summary><a href="${tHref(g.t)}">${esc(g.t.name)}</a> <span class="ex">${range(g.t)} · ${g.ms.map(m => m.w < 0 ? '·' : winner(m) === s ? 'W' : 'L').join(' ')}</span></summary><ul class="mlist">${g.ms.map(m => matchLine(m, s)).join('')}</ul></details>`).join('')}
</section>
<section>
  <div class="panel tbox srcbox" id="sources">
    <h3>Sources</h3>
    <p class="src">Profile: <a href="${pWiki(s)}" rel="external">Wikipedia, ${esc(PEOPLE[s][2] || name)}</a>${top ? ` · ranking: <a href="${RANK_SRC[tour]}" rel="external">Wikipedia, ${tour} rankings</a> of Sept 28, 2026 · compiled ${COMPILED}` : ''}</p>
    <p class="src">Matches, form, surface records and Elo come from these draw pages, fetched <time datetime="${FETCHED}">${utc(FETCHED)}</time>:</p>
    <ul class="srclist">${keysUsed.map(k => `<li><a href="${SRC[k].u}" rel="external">${esc(srcTitle(SRC[k].u))}</a> <span class="ex">revised ${utc(SRC[k].at)}</span></li>`).join('')}</ul>
  </div>
</section>`;
}
