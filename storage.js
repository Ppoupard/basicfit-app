
window.BF_STORE = {
  get(key, fallback=null){
    try{ const v=localStorage.getItem(key); return v===null ? fallback : JSON.parse(v); }
    catch(e){ return fallback; }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); },
  remove(key){ localStorage.removeItem(key); }
};
window.BF_UTIL = {
  normalize(s){
    return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g," ").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
  },
  nowInfo(){
    const now=new Date();
    const jours=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
    const mois=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
    const hour=now.getHours();
    let moment="journée";
    if(hour<11) moment="matin"; else if(hour<14) moment="midi"; else if(hour<18) moment="après-midi"; else if(hour<22) moment="soir"; else moment="nuit";
    return {now, day:jours[now.getDay()], dateText:`${jours[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]}`, time:`${hour}h${String(now.getMinutes()).padStart(2,"0")}`, hour, moment};
  },
  $(id){ return document.getElementById(id); },
  toast(text){ console.log(text); }
};
