
(function(){
  const KEY="bf_v16_performances";
  const DATA=window.BF_DATA;

  function data(){ return BF_STORE.get(KEY,{}); }
  function save(d){ BF_STORE.set(KEY,d); }
  function e1rm(w,r){ w=parseFloat(String(w).replace(",",".")); r=parseFloat(r); if(!isFinite(w)||!isFinite(r)||w<=0||r<=0)return null; return Math.round(w*(1+r/30)); }
  function label(key){ const f=DATA.perfMachines.find(x=>x[0]===key); return f?f[1]:key; }
  function last(key){ const arr=data()[key]||[]; return arr[arr.length-1]||null; }
  function best(key){ const arr=data()[key]||[]; if(!arr.length)return null; return arr.reduce((b,e)=>(e.score||0)>(b.score||0)?e:b,arr[0]); }
  function advice(entry){
    if(!entry) return "—";
    if(entry.feeling==="facile") return "Augmente légèrement";
    if(entry.feeling==="limite") return "Garde ou baisse";
    return "Garde ou + petit";
  }
  function countAll(){
    const d=data(); let total=0, machines=0, latest=null;
    Object.entries(d).forEach(([k,arr])=>{ if(arr.length){ machines++; total+=arr.length; const l=arr[arr.length-1]; if(!latest||l.id>latest.id) latest=l; }});
    return {total,machines,latest};
  }
  function populateSelects(){
    const html=DATA.perfMachines.map(([k,l])=>`<option value="${k}">${l}</option>`).join("");
    ["perfMachine","perfHistoryMachine"].forEach(id=>{ const el=BF_UTIL.$(id); if(el) el.innerHTML=html; });
    const date=BF_UTIL.$("perfDate"); if(date&&!date.value) date.value=new Date().toLocaleDateString("fr-FR");
  }
  function renderHistory(){
    const box=BF_UTIL.$("perfHistory"); if(!box) return;
    const machine=BF_UTIL.$("perfHistoryMachine")?.value || "presse";
    const arr=data()[machine]||[];
    const b=best(machine);
    if(BF_UTIL.$("perfBest")) BF_UTIL.$("perfBest").textContent=b?`${b.score} kg`:"—";
    if(BF_UTIL.$("perfAdvice")) BF_UTIL.$("perfAdvice").textContent=advice(arr[arr.length-1]);
    if(!arr.length){ box.innerHTML=`<p>Aucune perf sur ${label(machine)}.</p>`; return; }
    const rows=arr.slice().reverse().map(e=>`<tr><td>${e.date}</td><td>${e.weight} kg</td><td>${e.sets}x${e.reps}</td><td>${e.feeling}</td><td>${e.score||"—"} kg</td></tr>`).join("");
    box.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Date</th><th>Charge</th><th>Séries</th><th>Ressenti</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function updateStats(){
    const c=countAll();
    const ids={statPerfCount:c.total,statMachines:c.machines,perfTotal:c.total};
    Object.entries(ids).forEach(([id,v])=>{ const el=BF_UTIL.$(id); if(el) el.textContent=v; });
    const lastEl=BF_UTIL.$("statLastWorkout"); if(lastEl) lastEl.textContent=c.latest?`${c.latest.weight}kg`:"—";
  }
  function updateExerciseLines(){
    document.querySelectorAll("[data-perf-key]").forEach(el=>{
      const k=el.dataset.perfKey, l=last(k);
      if(!l){ el.textContent="Dernière perf : —"; return; }
      el.textContent=`Dernière perf : ${l.weight} kg • ${l.sets}x${l.reps} • ${l.feeling} → ${advice(l)}`;
    });
  }
  function clearInputs(){
    ["perfWeight","perfReps","perfSets","perfNote"].forEach(id=>{ const el=BF_UTIL.$(id); if(el) el.value=""; });
    const f=BF_UTIL.$("perfFeeling"); if(f) f.value="propre";
    const date=BF_UTIL.$("perfDate"); if(date) date.value=new Date().toLocaleDateString("fr-FR");
  }

  window.BF_PERF = {
    label,last,advice,
    init(){
      populateSelects(); renderHistory(); updateStats(); updateExerciseLines();
      BF_UTIL.$("perfHistoryMachine")?.addEventListener("change",renderHistory);
      BF_UTIL.$("savePerfBtn")?.addEventListener("click",()=>{
        const machine=BF_UTIL.$("perfMachine").value;
        const weight=parseFloat(BF_UTIL.$("perfWeight").value.replace(",","."));
        const reps=parseInt(BF_UTIL.$("perfReps").value,10);
        const sets=parseInt(BF_UTIL.$("perfSets").value,10);
        if(!isFinite(weight)||!isFinite(reps)||!isFinite(sets)){ alert("Remplis charge, répétitions et séries."); return; }
        const entry={id:Date.now(),date:BF_UTIL.$("perfDate").value||new Date().toLocaleDateString("fr-FR"),weight,reps,sets,feeling:BF_UTIL.$("perfFeeling").value,note:BF_UTIL.$("perfNote").value.trim(),score:e1rm(weight,reps)};
        const d=data(); if(!d[machine]) d[machine]=[]; d[machine].push(entry); d[machine]=d[machine].slice(-40); save(d);
        BF_UTIL.$("perfHistoryMachine").value=machine; renderHistory(); updateStats(); updateExerciseLines();
        window.BF_APP?.botMessage?.("coach",`Perf sauvegardée : ${label(machine)} — ${weight} kg, ${sets}x${reps}.`);
      });
      BF_UTIL.$("fillLastPerfBtn")?.addEventListener("click",()=>{
        const l=last(BF_UTIL.$("perfMachine").value); if(!l){ alert("Pas encore de perf sur cette machine."); return; }
        BF_UTIL.$("perfWeight").value=l.weight; BF_UTIL.$("perfReps").value=l.reps; BF_UTIL.$("perfSets").value=l.sets; BF_UTIL.$("perfFeeling").value=l.feeling; BF_UTIL.$("perfNote").value=l.note||"";
      });
      BF_UTIL.$("clearPerfBtn")?.addEventListener("click",clearInputs);
      BF_UTIL.$("deleteMachineBtn")?.addEventListener("click",()=>{
        const machine=BF_UTIL.$("perfHistoryMachine").value; if(!confirm("Effacer cette machine ?"))return;
        const d=data(); delete d[machine]; save(d); renderHistory(); updateStats(); updateExerciseLines();
      });
      BF_UTIL.$("exportPerfBtn")?.addEventListener("click",()=>{
        const text=JSON.stringify(data(),null,2);
        navigator.clipboard?.writeText(text).then(()=>alert("Perfs copiées."),()=>alert(text));
      });
    }
  };
})();
