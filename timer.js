
(function(){
  const KEY_END="bf_v14_timer_end";
  const KEY_SOUND="bf_v14_sound";
  let timer=null;
  let end=Number(localStorage.getItem(KEY_END)||0);
  let soundOn=localStorage.getItem(KEY_SOUND)!=="off";
  let finishedNotified=false;

  function fmt(sec){ const m=Math.floor(sec/60).toString().padStart(2,"0"); const s=(sec%60).toString().padStart(2,"0"); return `${m}:${s}`; }
  function beep(freq=700,duration=.12){
    if(!soundOn) return;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx) return;
      const ctx=new Ctx(), osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type="sine"; osc.frequency.value=freq;
      gain.gain.setValueAtTime(.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.18, ctx.currentTime+.02);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+duration);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+duration+.03);
    }catch(e){}
  }
  function finishSound(){ beep(740,.12); setTimeout(()=>beep(980,.13),140); setTimeout(()=>beep(1180,.15),290); }
  async function notify(){
    try{
      if(!("Notification" in window) || Notification.permission!=="granted") return;
      if(navigator.serviceWorker?.ready){
        const reg=await navigator.serviceWorker.ready;
        reg.showNotification("Repos terminé 💪",{body:"Tu peux repartir sur ta série.",tag:"bf-rest"});
      }
    }catch(e){}
  }
  function update(){
    const display=BF_UTIL.$("timerDisplay"), status=BF_UTIL.$("timerStatus");
    if(!display||!status) return;
    if(!end){
      display.textContent="01:30"; status.textContent=soundOn?"Sons ON":"Sons OFF"; return;
    }
    const left=Math.ceil((end-Date.now())/1000);
    if(left>0){ display.textContent=fmt(left); status.textContent="En cours"; return; }
    display.textContent="GO !"; status.textContent="Repos terminé";
    localStorage.removeItem(KEY_END); end=0; clearInterval(timer); timer=null;
    if(!finishedNotified){ finishedNotified=true; finishSound(); if(navigator.vibrate) navigator.vibrate([200,100,200]); notify(); }
  }
  window.BF_TIMER = {
    start(seconds){
      finishedNotified=false;
      end=Date.now()+seconds*1000;
      localStorage.setItem(KEY_END,String(end));
      clearInterval(timer); timer=setInterval(update,250); update(); beep(440,.08);
    },
    async toggleSound(){
      soundOn=!soundOn; localStorage.setItem(KEY_SOUND,soundOn?"on":"off"); beep(soundOn?660:220,.12); update();
      if("Notification" in window && Notification.permission==="default"){
        try{ await Notification.requestPermission(); }catch(e){}
      }
    },
    update
  };
  document.addEventListener("visibilitychange",update);
  window.addEventListener("focus",update);
  window.addEventListener("pageshow",update);
  setInterval(update,1000);
})();
