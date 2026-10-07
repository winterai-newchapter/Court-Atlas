/* Live results: while a tournament is being played, re-reads its Wikipedia draw pages every minute and calls back
   with fresh data, so finished matches appear without waiting for the next site build. Needs parse.js and views.js. */
const LIVE_API = 'https://en.wikipedia.org/w/api.php';
const LIVE_EVERY = 60e3;
// Status follows the viewer's clock, not the build time
TODAY.setTime(Date.now());

// Watch every in-progress draw (or only tournament `only`) and call onUpdate() after each poll that brought new results
function liveWatch(onUpdate, only){
  const jobs = T.filter(t => (!only || t.id === only) && status(t) === 'live')
    .flatMap(t => Object.entries(t.w || {}).filter(([tour]) => tour !== 'Team').map(([tour, title]) => ({key:`${t.id}/${tour}`, title})));
  const stamp = document.getElementById('livestamp');
  if (!jobs.length){ if (stamp) stamp.hidden = true; return; }
  const show = (txt, err) => { if (stamp){ stamp.hidden = false; stamp.classList.toggle('err', !!err); stamp.innerHTML = `<span class="livedot" aria-hidden="true"></span>${txt}`; } };
  const hm = x => x.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  let timer = null, busy = false;
  async function poll(){
    if (busy) return;
    busy = true;
    try {
      const q = new URLSearchParams({action:'query', prop:'revisions', rvprop:'ids|timestamp|content', rvslots:'main',
        titles:jobs.map(j => j.title).join('|'), redirects:'1', format:'json', formatversion:'2', origin:'*'});
      const r = await (await fetch(`${LIVE_API}?${q}`)).json();
      const alias = {};
      for (const n of r.query.normalized || []) alias[n.to] = n.from;
      for (const n of r.query.redirects || []) alias[n.to] = alias[n.from] || n.from;
      let changed = 0;
      for (const p of r.query.pages){
        if (p.missing || !p.revisions) continue;
        const rev = p.revisions[0], asked = alias[p.title] || p.title;
        for (const j of jobs.filter(x => x.title === asked)){
          if (SRC[j.key] && SRC[j.key].rev >= rev.revid) continue;
          const parsed = WIKIDRAW.parseDraw(rev.slots.main.content);
          if (!parsed.matches.length) continue;
          DRAWS[j.key] = WIKIDRAW.toDraw(parsed, PEOPLE);
          SRC[j.key] = {u:WIKIDRAW.wiki(p.title), rev:rev.revid, at:rev.timestamp};
          changed++;
        }
      }
      if (changed){ reindex(); onUpdate(); }
      show(`Live · results checked ${hm(new Date())}`);
    } catch (e){
      show('Live update paused, retrying', true);
    }
    busy = false;
  }
  const start = () => { if (!timer){ poll(); timer = setInterval(poll, LIVE_EVERY); } };
  const stop = () => { clearInterval(timer); timer = null; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  if (!document.hidden) start();
}
