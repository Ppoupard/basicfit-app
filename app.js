
(function(){
  const DATA=window.BF_DATA;
  let currentSession="s1";

  function el(id){ return BF_UTIL.$(id); }
  function showView(view){
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    el(view+"View")?.classList.add("active");
    document.querySelectorAll(".app-nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderExercise(key,i,prefix){
    const ex=typeof key==="string"?DATA.machines[key]:key;
    const perfKey=typeof key==="string"?key:(ex.perfKey||"other");
    const id=`${prefix}-${i}-${perfKey}`;
    return `<article class="exercise-card">
      <div class="exercise-top">
        <input type="checkbox" data-check="${id}" />
        <div>
          <div class="exercise-title">${ex.name}</div>
          <div class="tags">${ex.main?'<span class="tag main">priorité</span>':''}<span class="tag">${ex.sets}</span><span class="tag">${ex.reps}</span><span class="tag">repos ${ex.rest}</span></div>
        </div>
      </div>
      <p class="exercise-desc">${ex.desc}</p>
      <div class="perf-line" data-perf-key="${perfKey}">Dernière perf : —</div>
    </article>`;
  }
  function bindChecks(){
    document.querySelectorAll("[data-check]").forEach(box=>{
      const k="bf_v14_check_"+box.dataset.check;
      box.checked=localStorage.getItem(k)==="true";
      box.closest(".exercise-card")?.classList.toggle("done",box.checked);
      box.addEventListener("change",()=>{
        localStorage.setItem(k,box.checked?"true":"false");
        box.closest(".exercise-card")?.classList.toggle("done",box.checked);
      });
    });
  }
  function renderSession(){
    const s=DATA.sessions[currentSession];
    el("sessionContent").innerHTML=`<div class="session-title"><h2>${s.title}</h2><p class="session-subtitle">${s.subtitle}</p></div>${s.keys.map((k,i)=>renderExercise(k,i,currentSession)).join("")}`;
    bindChecks();
    window.BF_PERF?.init?.();
  }
  function reduceSets(s){return s.replace("4 séries","3 séries").replace("3 séries","2 séries").replace("2 à 3 séries","2 séries").replace("10 tours","6 tours");}
  function adapt(key,ctx){
    const ex={...DATA.machines[key], perfKey:key};
    if(ctx.easy){ ex.sets=reduceSets(ex.sets); ex.desc+=" Adapté : charge plus légère, technique parfaite."; }
    if(ctx.short && ["pecdeck","biceps","triceps","calves","cardio","glute"].includes(key)) ex.skip=true;
    if(ctx.veryShort && ["legext","glute","add","abd","shoulder","pecdeck","biceps","triceps","calves","cardio"].includes(key)) ex.skip=true;
    if(ctx.noLegs && ["presse","legext","glute","calves","cardio"].includes(key)) ex.skip=true;
    if(ctx.pain==="knee"&&["presse","legext"].includes(key)){ ex.desc+=" Genou : amplitude réduite, pas lourd, stop si douleur."; ex.reps="12 reps propres"; ex.sets=reduceSets(ex.sets); }
    if(ctx.pain==="adductor"&&key==="add"){ ex.desc+=" Adducteurs : très léger, pas d’à-coups."; ex.sets="2 séries"; }
    if(ctx.pain==="ankle"&&["calves","cardio"].includes(key)){ ex.desc+=" Cheville : contrôlé ou remplace par vélo tranquille."; ex.sets="2 séries"; }
    if(ctx.pain==="shoulder"&&["shoulder","chest"].includes(key)){ ex.desc+=" Épaule : charge réduite, amplitude confortable."; ex.sets="2 séries"; }
    return ex;
  }
  function buildCustom(p){
    let keys=[];
    const noLegs=p.football==="matchTomorrow"||p.football==="matchToday"||p.goal==="prematch";
    if(p.goal==="legs") keys=["warmup","presse","legcurl","legext","glute","add","abd","calves","plank"];
    else if(p.goal==="upper") keys=["warmup","tirage","chest","row","shoulder","reverse","pecdeck","triceps","biceps","abs"];
    else if(p.goal==="recovery") keys=["warmup","abd","add","legcurl","tirage","reverse","abs"];
    else if(p.goal==="fatloss") keys=["warmup","presse","legcurl","tirage","chest","row","abs","cardio"];
    else if(p.goal==="muscle") keys=["warmup","presse","legcurl","tirage","chest","row","shoulder","pecdeck","triceps","biceps","abs"];
    else if(p.goal==="prematch") keys=["warmup","tirage","chest","row","reverse","abs"];
    else keys=["warmup","presse","legcurl","tirage","chest","row","shoulder","abs","calves","cardio"];
    if(noLegs && p.goal!=="upper") keys=["warmup","tirage","chest","row","reverse","triceps","biceps","abs"];
    const ctx={easy:p.fatigue==="high"||p.intensity==="easy"||p.football==="matchTomorrow"||p.football==="matchToday",short:p.duration==="45",veryShort:p.duration==="30",noLegs,pain:p.pain};
    const exercises=keys.map(k=>adapt(k,ctx)).filter(e=>!e.skip);
    const notes=[];
    if(p.football==="matchToday") notes.push("Match aujourd’hui : séance très légère uniquement.");
    if(p.football==="matchTomorrow") notes.push("Match demain : priorité jambes fraîches, pas de finisher.");
    if(p.fatigue==="high") notes.push("Fatigue élevée : charges -10 à -20 %, pas d’échec.");
    if(p.pain!=="none") notes.push("Gêne indiquée : aucune douleur vive acceptée.");
    return {title:`Séance personnalisée — ${p.duration} min`,exercises,notes};
  }
  function formCustomParams(){
    return {goal:customGoal.value,duration:customDuration.value,fatigue:customFatigue.value,football:customFootball.value,pain:customPain.value,intensity:customIntensity.value,free:customRequest.value.trim()};
  }
  function generateCustom(params=formCustomParams()){
    const plan=buildCustom(params);
    const notes=plan.notes.length?`<div class="hint">${plan.notes.map(n=>"• "+n).join("<br>")}</div>`:"";
    customOutput.className="";
    customOutput.innerHTML=`<div class="section-title"><h2>${plan.title}</h2><p class="session-subtitle">${params.free?params.free:"Séance générée depuis tes choix."}</p></div>${notes}${plan.exercises.map((e,i)=>renderExercise(e,i,"custom")).join("")}`;
    BF_STORE.set("bf_v14_custom_html",customOutput.innerHTML);
    bindChecks(); BF_PERF.updateExerciseLines?.();
    showView("custom");
  }
  function addMessage(target,type,text){
    const log=target==="nutrition"?el("nutritionChat"):el("coachChat");
    const div=document.createElement("div"); div.className="msg "+type; div.textContent=text; log.appendChild(div); log.scrollTop=log.scrollHeight;
  }
  function botMessage(target,text){ addMessage(target,"bot",text); }
  function renderQuestions(){
    const grid=el("questionsGrid");
    grid.innerHTML=Object.entries(DATA.questionGroups).map(([cat,qs])=>`<article class="question-card"><h3>${cat}</h3>${qs.map(q=>`<button data-question="${q.replace(/"/g,'&quot;')}">${q}</button>`).join("")}</article>`).join("");
    grid.querySelectorAll("[data-question]").forEach(b=>b.addEventListener("click",()=>{ showView("coach"); coachInput.value=b.dataset.question; sendCoach(); }));
  }
  function sendCoach(){
    const text=coachInput.value.trim(); if(!text) return;
    addMessage("coach","user",text); coachInput.value="";
    setTimeout(()=>addMessage("coach","bot",BF_COACH.answer(text)),150);
  }
  function updateToday(){
    const n=BF_UTIL.nowInfo();
    todayLine.textContent=`${n.dateText} • ${n.time} • ${n.moment}`;
    const advice=BF_COACH.recommend("quelle séance aujourd’hui");
    dailyAdviceText.textContent=advice;
  }
  function init(){
    const isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
    const standalone=window.navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches;
    if(isiOS&&!standalone) installHint.classList.remove("hidden");

    document.querySelectorAll(".app-nav button").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
    document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.open)));
    document.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>{ showView("coach"); coachInput.value=b.dataset.quick; sendCoach(); }));
    document.querySelectorAll("[data-timer]").forEach(b=>b.addEventListener("click",()=>BF_TIMER.start(Number(b.dataset.timer))));
    soundBtn.addEventListener("click",()=>BF_TIMER.toggleSound());

    sessionTabs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ currentSession=b.dataset.session; sessionTabs.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b)); renderSession(); }));
    resetChecksBtn.addEventListener("click",()=>{ Object.keys(localStorage).forEach(k=>{ if(k.startsWith("bf_v14_check_")) localStorage.removeItem(k); }); renderSession(); });
    generateCustomBtn.addEventListener("click",()=>generateCustom());
    sendCoachBtn.addEventListener("click",sendCoach);
    coachInput.addEventListener("keydown",e=>{ if(e.key==="Enter") sendCoach(); });
    openRecommendedBtn.addEventListener("click",()=>showView("sessions"));

    renderSession();
    const saved=BF_STORE.get("bf_v14_custom_html","");
    if(saved){ customOutput.className=""; customOutput.innerHTML=saved; bindChecks(); }
    BF_PERF.init();
    BF_NUTRITION.init();
    renderQuestions();
    updateToday();
    BF_TIMER.update();
    if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
  window.BF_APP={showView,generateCustom,addMessage,botMessage};
  document.addEventListener("DOMContentLoaded",init);
})();
