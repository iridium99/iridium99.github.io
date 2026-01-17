(function(){
  const NAMESPACE = 'iridium99.github.io';
  const TOTAL_KEY = 'total_visits';

  const onlineEl = document.getElementById('vw-online');
  const totalEl = document.getElementById('vw-total');

  function pad(n){ return n < 10 ? '0' + n : '' + n; }
  function minuteKey(date){
    // YYYYMMDDHHmm
    return 'active_' + [
      date.getFullYear(),
      pad(date.getMonth()+1),
      pad(date.getDate()),
      pad(date.getHours()),
      pad(date.getMinutes())
    ].join('');
  }

  async function countapiHit(key){
    try {
      const res = await fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
      if(!res.ok) throw new Error('CountAPI hit failed');
      const data = await res.json();
      return typeof data.value === 'number' ? data.value : null;
    } catch (e) {
      console.warn('CountAPI hit error:', e);
      return null;
    }
  }

  async function countapiGet(key){
    try {
      const res = await fetch(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
      if(!res.ok) throw new Error('CountAPI get failed');
      const data = await res.json();
      return typeof data.value === 'number' ? data.value : 0;
    } catch (e) {
      // Key might not exist yet; treat as zero
      return 0;
    }
  }

  function msUntilNextMinute(){
    const now = Date.now();
    return 60000 - (now % 60000);
  }

  async function updateTotalVisits(){
    // Increment total visits on each page load and display value
    const value = await countapiHit(TOTAL_KEY);
    if(totalEl) totalEl.textContent = value !== null ? value.toLocaleString() : '—';
  }

  async function hitAndShowOnline(){
    const now = new Date();
    const key = minuteKey(now);
    // Signal presence once per minute
    await countapiHit(key);
    const count = await countapiGet(key);
    if(onlineEl) onlineEl.textContent = count.toLocaleString();
  }

  async function refreshOnline(){
    const now = new Date();
    const key = minuteKey(now);
    const count = await countapiGet(key);
    if(onlineEl) onlineEl.textContent = count.toLocaleString();
  }

  function startOnlineScheduler(){
    // Align to minute boundary for subsequent hits
    setTimeout(() => {
      hitAndShowOnline();
      setInterval(hitAndShowOnline, 60000);
    }, msUntilNextMinute());

    // Poll current minute count periodically to reflect other visitors
    setInterval(refreshOnline, 15000);
  }

  function init(){
    updateTotalVisits();
    hitAndShowOnline();
    startOnlineScheduler();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
