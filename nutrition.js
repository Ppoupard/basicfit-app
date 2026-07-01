
(function(){
  function weight(){ const w=parseFloat((BF_UTIL.$("nutritionWeight")?.value||"75").replace(",",".")); return isFinite(w)&&w>30&&w<180?w:75; }
  function plan(){
    const w=weight(), goal=BF_UTIL.$("nutritionGoal").value, moment=BF_UTIL.$("nutritionMoment").value, hunger=BF_UTIL.$("nutritionHunger").value;
    let pLow=Math.round(w*1.4), pHigh=Math.round(w*2.0);
    if(goal==="cut"){ pLow=Math.round(w*1.8); pHigh=Math.round(w*2.3); }
    const waterLow=(w*0.03).toFixed(1), waterHigh=(w*0.035).toFixed(1);
    let out=`<strong>Protéines :</strong> ${pLow}-${pHigh} g/jour environ.<br><strong>Eau :</strong> ${waterLow}-${waterHigh} L/jour + transpiration.<br><br>`;
    if(goal==="cut") out+="<strong>Sèche :</strong> garde les protéines hautes, légumes, féculents autour du sport, limite sodas/grignotage.<br>";
    if(goal==="muscle") out+="<strong>Muscle :</strong> mange assez, protéines à chaque repas, féculents autour de la séance, progression à la salle.<br>";
    if(goal==="performance") out+="<strong>Performance :</strong> repas simple, glucides autour de l’effort, hydratation sérieuse.<br>";
    if(goal==="match") out+="<strong>Foot/match :</strong> glucides digestes, pas trop gras juste avant, eau régulièrement.<br>";
    if(goal==="recovery") out+="<strong>Récupération :</strong> protéines + glucides + eau + sommeil. Ne saute pas le repas après grosse séance.<br>";
    if(moment==="before") out+="<br><strong>Avant séance :</strong> 1h30-3h avant : riz/pâtes/pommes de terre + œufs/jambon/poulet + eau. Si rapide : banane + skyr.";
    if(moment==="after") out+="<br><strong>Après séance :</strong> protéines 25-40 g + glucides. Exemple : riz/pommes de terre + poulet/œufs/jambon + légumes.";
    if(moment==="evening") out+="<br><strong>Soir tard :</strong> repas léger utile : skyr/fromage blanc + fruit, ou œufs/jambon + féculent modéré.";
    if(moment==="matchday") out+="<br><strong>Jour de match :</strong> repas 3-4h avant, digeste, riche en glucides, pas trop gras.";
    if(hunger==="low") out+="<br><strong>Pas faim :</strong> skyr, compote, banane, eau. Évite le repas lourd.";
    if(hunger==="high") out+="<br><strong>Très faim :</strong> protéine + féculent + légumes, mange lentement.";
    return out;
  }
  function answer(text){
    const q=BF_UTIL.normalize(text);
    if(q.includes("avant")) return "Avant salle : 1h30-3h avant, féculent + protéine + eau. Si tu as peu de temps : banane + skyr.";
    if(q.includes("apres")||q.includes("après")) return "Après salle : protéines + glucides + eau. Exemple riz/pommes de terre + poulet/œufs/jambon + légumes.";
    if(q.includes("seche")||q.includes("maigrir")||q.includes("perdre")) return "Sèche : déficit léger, protéines hautes, muscu conservée, légumes, féculents autour du sport. Ne coupe pas tout.";
    if(q.includes("muscle")||q.includes("masse")) return "Prise de muscle : protéines à chaque repas, assez de calories, féculents autour de la séance, sommeil.";
    if(q.includes("whey")) return "Whey : pratique, pas obligatoire. Elle sert juste à atteindre tes protéines.";
    if(q.includes("creatine")||q.includes("créatine")) return "Créatine : option intéressante force/puissance, souvent 3-5 g/jour. Repas/sommeil/entraînement restent prioritaires.";
    if(q.includes("match")) return "Match : glucides digestes + hydratation. Évite repas très gras juste avant. Repas 3-4h avant si possible.";
    if(q.includes("eau")||q.includes("boire")) return "Hydratation : bois régulièrement. Après grosse transpiration : eau + repas salé.";
    return "Je peux répondre sur : avant/après séance, sèche, prise de muscle, protéines, whey, créatine, hydratation, match, repas tardif.";
  }
  window.BF_NUTRITION = {
    init(){
      BF_UTIL.$("generateNutritionBtn")?.addEventListener("click",()=>{ BF_UTIL.$("nutritionResult").innerHTML=plan(); });
      BF_UTIL.$("sendNutritionBtn")?.addEventListener("click",()=>window.BF_NUTRITION.send());
      BF_UTIL.$("nutritionInput")?.addEventListener("keydown",e=>{ if(e.key==="Enter") window.BF_NUTRITION.send(); });
    },
    send(){
      const input=BF_UTIL.$("nutritionInput"); const text=input.value.trim(); if(!text)return;
      window.BF_APP.addMessage("nutrition","user",text); input.value="";
      setTimeout(()=>window.BF_APP.addMessage("nutrition","bot",answer(text)),150);
    },
    answer
  };
})();
