
(function(){
  const SYN={
    fatigue:["fatigue","fatigué","mort","cramé","ko","hs","rincé","courbature","jambes lourdes"],
    temps:["pas le temps","peu de temps","vite","rapide","30","45","demi heure"],
    seance:["seance","séance","programme","training","entrainement","workout","je fais quoi"],
    conseil:["conseille","recommande","quoi faire","choix","meilleur"],
    foot:["foot","football","entrainement","terrain"],
    match:["match","competition","tournoi"],
    douleur:["douleur","mal","gêne","bobo","tiraillement","pincement"],
    machine:["machine prise","occupée","pas libre","indisponible","salle pleine","salle blindée"],
    seche:["seche","sèche","maigrir","perdre du poids","perdre du gras"],
    muscle:["muscle","masse","grossir","hypertrophie"],
    explosif:["explosif","puissant","puissance","vitesse","athletique","athlétique"],
    nutrition:["manger","repas","whey","creatine","créatine","proteine","protéine"]
  };
  function expand(q){
    let e=" "+q+" ";
    Object.entries(SYN).forEach(([k,arr])=>arr.forEach(w=>{ if(q.includes(BF_UTIL.normalize(w))) e+=" "+k+" "+arr.map(BF_UTIL.normalize).join(" "); }));
    return e;
  }
  function paramsFromText(text){
    const q=expand(BF_UTIL.normalize(text));
    const p={goal:"athletic",duration:"60",fatigue:"medium",football:"none",pain:"none",intensity:"normal",free:text};
    if(q.includes("jambe"))p.goal="legs"; if(q.includes("haut"))p.goal="upper"; if(q.includes("recup")||q.includes("léger")||q.includes("leger")){p.goal="recovery";p.intensity="easy";}
    if(q.includes("seche")||q.includes("perdre"))p.goal="fatloss"; if(q.includes("muscle")||q.includes("masse"))p.goal="muscle"; if(q.includes("pre match"))p.goal="prematch";
    if(q.includes("30"))p.duration="30"; else if(q.includes("45"))p.duration="45"; else if(q.includes("75"))p.duration="75";
    if(q.includes("fatigue")||q.includes("mort")||q.includes("crame"))p.fatigue="high";
    if(q.includes("foot")&&q.includes("demain"))p.football="trainingTomorrow"; if(q.includes("foot")&&q.includes("aujourd"))p.football="trainingToday";
    if(q.includes("match")&&q.includes("demain"))p.football="matchTomorrow"; if(q.includes("match")&&q.includes("aujourd"))p.football="matchToday";
    if(q.includes("genou"))p.pain="knee"; if(q.includes("adduct"))p.pain="adductor"; if(q.includes("cheville"))p.pain="ankle"; if(q.includes("epaule"))p.pain="shoulder"; if(q.includes("dos"))p.pain="back";
    return p;
  }
  function recommend(text=""){
    const p=paramsFromText(text), n=BF_UTIL.nowInfo();
    if(p.football==="matchToday") return "Match aujourd’hui : pas de muscu lourde. Activation légère uniquement.";
    if(p.football==="matchTomorrow") return "Match demain : je conseille haut du corps modéré ou séance pré-match légère. Pas de jambes lourdes.";
    if(p.football==="trainingTomorrow") return "Foot demain : je conseille séance haut du corps. Sinon full body allégé sans finisher.";
    if(p.fatigue==="high") return "Fatigué : séance récupération/légère. Charges -10 à -20 %, moins de séries, pas d’échec.";
    if(p.pain!=="none") return "Avec une gêne : séance adaptée, charge légère, amplitude confortable, pas de mouvement douloureux.";
    if(n.day==="mardi") return "Aujourd’hui : séance jambes si tu es frais. Si foot demain ou jambes lourdes : haut du corps.";
    if(n.day==="jeudi") return "Aujourd’hui : séance haut du corps. Très bon choix pour progresser sans cramer les jambes.";
    if(n.day==="samedi") return "Aujourd’hui : full body. Si match demain : allège et enlève le cardio.";
    if(n.day==="dimanche") return "Aujourd’hui : repos, match ou récupération légère.";
    return "Je conseille haut du corps ou repos actif selon ta fatigue. Tu peux aussi générer une séance personnalisée.";
  }
  function replacement(text){
    const q=BF_UTIL.normalize(text);
    const map={presse:"presse","leg curl":"legcurl","leg extension":"legext","tirage":"tirage","rowing":"row","chest":"chest","shoulder":"shoulder","epaule":"shoulder","pec deck":"pecdeck","reverse":"reverse","adducteur":"add","abducteur":"abd","mollet":"calves","abdo":"abs","velo":"warmup"};
    for(const [word,key] of Object.entries(map)){ if(q.includes(word)) return BF_DATA.replacements[key]||"Je n’ai pas trouvé cette machine."; }
    return "Dis-moi quelle machine est prise. Exemple : presse prise, tirage vertical occupé, chest press indisponible.";
  }
  function createCustom(text){
    const p=paramsFromText(text);
    window.BF_APP.generateCustom(p);
    return "C’est fait : j’ai généré une séance dans l’onglet Perso.";
  }
  function answer(text){
    const q=expand(BF_UTIL.normalize(text));
    if(q.includes("cree")||q.includes("crée")||q.includes("genere")||q.includes("séance perso")||q.includes("seance perso")) return createCustom(text);
    if((q.includes("seance")||q.includes("programme"))&&(q.includes("conseil")||q.includes("quoi faire")||q.includes("aujourd"))) return recommend(text);
    if(q.includes("machine")||q.includes("occup")||q.includes("indisponible")||q.includes("remplacer")) return replacement(text);
    if(q.includes("nutrition")||q.includes("manger")||q.includes("whey")||q.includes("creatine")||q.includes("protéine")||q.includes("proteine")) return BF_NUTRITION.answer(text);
    if(q.includes("charge")||q.includes("poids")||q.includes("kg")) return "Charge : les 2 dernières reps doivent être dures mais propres. Si tu peux faire beaucoup plus, augmente. Si la technique casse, baisse.";
    if(q.includes("repos")||q.includes("pause")) return "Repos : gros exercices 1min30-2min, exercices moyens 1min15, accessoires environ 1min.";
    if(q.includes("echec")||q.includes("échec")) return "Pas besoin d’aller à l’échec. Pour ton objectif foot/athlétique : garde 1-2 reps en réserve.";
    if(q.includes("genou")) return "Genou : baisse charge/amplitude, évite presse/leg extension lourd. Douleur vive, gonflement ou instabilité = stop.";
    if(q.includes("fatigue")||q.includes("mort")||q.includes("crame")) return "Fatigue : baisse 10-20 %, enlève une série, supprime le cardio. Si tu es cramé : récupération.";
    if(q.includes("seche")||q.includes("maigrir")) return BF_NUTRITION.answer("je veux sécher");
    if(q.includes("muscle")||q.includes("masse")) return BF_NUTRITION.answer("prendre muscle");
    if(q.includes("explosif")||q.includes("puissant")) return "Explosivité : construis la force sur presse/leg curl/fessiers/mollets + transfert terrain avec accélérations et appuis.";
    if(q.includes("performance")||q.includes("perf")) return "Va dans Perfs : note machine, charge, reps, séries et ressenti. L’app affichera la dernière perf sous chaque exercice.";
    return "Je peux t’aider sur : séance conseillée, séance personnalisée, machine prise, charge, repos, douleur, nutrition, sèche, muscle, explosivité et performances.";
  }
  window.BF_COACH={answer,paramsFromText,recommend,replacement};
})();
