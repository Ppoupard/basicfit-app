
window.BF_DATA = {
  machines: {
    warmup:{name:"Vélo",sets:"8 à 10 min",reps:"tranquille",rest:"—",desc:"Chauffe sans taper dans les genoux."},
    presse:{name:"Presse à cuisses",sets:"4 séries",reps:"8 à 10 reps",rest:"1min30-2min",desc:"Pieds largeur épaules, genoux dans l’axe, descente contrôlée, ne verrouille pas les genoux.",main:true},
    legcurl:{name:"Leg curl",sets:"4 séries",reps:"10 à 12 reps",rest:"1min30",desc:"Arrière des cuisses. Priorité pour sprint et protection du genou.",main:true},
    legext:{name:"Leg extension",sets:"3 séries",reps:"10 à 12 reps",rest:"1min15",desc:"Devant des cuisses. Contrôle propre, commence léger si gêne genou."},
    glute:{name:"Machine fessiers",sets:"3 séries",reps:"10 par jambe",rest:"1min",desc:"Puissance, accélération et stabilité du bassin."},
    add:{name:"Adducteurs",sets:"3 séries",reps:"12 à 15 reps",rest:"1min",desc:"Intérieur des cuisses, utile pour le foot et les changements de direction."},
    abd:{name:"Abducteurs",sets:"3 séries",reps:"12 à 15 reps",rest:"1min",desc:"Hanches et appuis. Important pour stabilité."},
    calves:{name:"Mollets",sets:"4 séries",reps:"12 à 15 reps",rest:"1min",desc:"Monte sur la pointe, bloque 1 seconde, redescends doucement."},
    tirage:{name:"Tirage vertical",sets:"4 séries",reps:"8 à 10 reps",rest:"1min30",desc:"Tire vers le haut de poitrine, épaules basses, pas derrière la nuque.",main:true},
    chest:{name:"Chest press",sets:"4 séries",reps:"8 à 10 reps",rest:"1min30",desc:"Poussée haut du corps. Reviens doucement sans avancer les épaules."},
    row:{name:"Rowing assis",sets:"4 séries",reps:"10 reps",rest:"1min30",desc:"Tire vers le ventre, dos droit, épaules basses.",main:true},
    shoulder:{name:"Shoulder press",sets:"3 séries",reps:"8 à 10 reps",rest:"1min30",desc:"Poussée épaules. Ne force pas si douleur/pincement."},
    reverse:{name:"Reverse pec deck",sets:"3 séries",reps:"12 à 15 reps",rest:"1min",desc:"Arrière d’épaules et posture. Protège les épaules.",main:true},
    pecdeck:{name:"Pec deck",sets:"2 à 3 séries",reps:"12 reps",rest:"1min",desc:"Complément pectoraux, mouvement propre."},
    triceps:{name:"Triceps machine / poulie",sets:"3 séries",reps:"10 à 12 reps",rest:"1min",desc:"Arrière du bras. Coudes stables."},
    biceps:{name:"Curl biceps machine",sets:"2 à 3 séries",reps:"10 à 12 reps",rest:"1min",desc:"Devant du bras, contrôle sans balancer."},
    abs:{name:"Machine abdos",sets:"3 séries",reps:"12 à 15 reps",rest:"1min",desc:"Contracte les abdos, ne tire pas avec le cou."},
    plank:{name:"Gainage planche",sets:"3 séries",reps:"30 à 45 sec",rest:"45 sec",desc:"Stabilité, duels et appuis."},
    cardio:{name:"Cardio vélo",sets:"10 tours",reps:"20 sec rapide / 40 sec lent",rest:"—",desc:"À supprimer si match proche ou grosse fatigue."}
  },
  sessions: {
    s1:{title:"Séance 1 — Jambes puissantes",subtitle:"Puissance jambes, prévention, appuis, accélération.",keys:["warmup","presse","legcurl","legext","glute","add","abd","calves","plank"]},
    s2:{title:"Séance 2 — Haut du corps",subtitle:"Dos fort, épaules solides, puissance dans les duels.",keys:["warmup","tirage","chest","row","shoulder","reverse","pecdeck","triceps","biceps","abs"]},
    s3:{title:"Séance 3 — Full body athlétique",subtitle:"Corps complet, condition physique et puissance générale.",keys:["warmup","presse","legcurl","tirage","chest","row","shoulder","abs","calves","cardio"]}
  },
  perfMachines: [
    ["presse","Presse à cuisses"],["legcurl","Leg curl"],["legext","Leg extension"],["glute","Machine fessiers"],["add","Adducteurs"],["abd","Abducteurs"],["calves","Mollets"],["tirage","Tirage vertical"],["chest","Chest press"],["row","Rowing assis"],["shoulder","Shoulder press"],["reverse","Reverse pec deck"],["pecdeck","Pec deck"],["triceps","Triceps"],["biceps","Biceps"],["abs","Machine abdos"],["plank","Gainage"],["cardio","Cardio vélo"]
  ],
  replacements: {
    presse:"Remplacement presse : leg extension 3x12 + leg curl 3x12. Si tu maîtrises : hack squat léger. Le plus simple : leg extension + leg curl puis reviens à la presse.",
    legcurl:"Remplacement leg curl : autre leg curl si dispo, sinon machine fessiers + presse pieds hauts contrôlée. Reviens au leg curl dès qu’il est libre.",
    legext:"Remplacement leg extension : presse pieds un peu plus bas, hack squat léger, ou une série de presse en plus. Si genou sensible, ne force pas.",
    tirage:"Remplacement tirage vertical : rowing assis, machine dorsaux, tirage prise différente, ou assisted pull-up si tu maîtrises. Le plus simple : rowing assis.",
    row:"Remplacement rowing : tirage vertical, rowing machine poitrine appuyée, tirage poulie basse si dispo.",
    chest:"Remplacement chest press : pec deck, machine développé convergent, ou pompes inclinées. Le plus simple : pec deck.",
    shoulder:"Remplacement shoulder press : élévations latérales machine/câble léger, reverse pec deck, ou développé épaules machine alternative. Si épaule sensible, évite lourd.",
    pecdeck:"Remplacement pec deck : chest press plus léger, câble vis-à-vis si tu sais faire, ou pompes inclinées.",
    reverse:"Remplacement reverse pec deck : face pull à la poulie, rowing léger coudes ouverts, ou tirage horizontal léger.",
    add:"Remplacement adducteurs : isométrie légère en serrant un ballon/serviette entre les genoux. Pas d’à-coups.",
    abd:"Remplacement abducteurs : machine fessiers, abduction poulie si tu connais, ou pas chassés élastique si dispo.",
    calves:"Remplacement mollets : mollets à la presse, mollets debout guidé/Smith, ou mollets au poids du corps lentement.",
    abs:"Remplacement machine abdos : gainage planche 3x30-45 sec, dead bug contrôlé ou crunch machine.",
    warmup:"Remplacement vélo : tapis incliné facile, elliptique ou rameur tranquille. Si genou/cheville sensible, vélo reste le meilleur."
  },
  questionGroups: {
    "Séance":["Quelle séance tu me conseilles aujourd’hui ?","Je fais quoi aujourd’hui ?","J’ai que 45 minutes","Je suis fatigué","J’ai foot demain","J’ai match demain"],
    "Créer":["Crée une séance jambes 45 min","Crée une séance haut du corps","Crée une séance légère","Crée une séance avec douleur genou","Crée une séance sèche"],
    "Machines":["La presse est prise","Le tirage vertical est occupé","Par quoi remplacer le chest press ?","Je ne sens pas le bon muscle","Comment régler le siège ?"],
    "Progression":["Quelle charge je mets ?","Quand augmenter le poids ?","Combien de repos ?","Je dois aller à l’échec ?","Je stagne, je fais quoi ?"],
    "Nutrition":["Je mange quoi avant la salle ?","Je mange quoi après la salle ?","Je veux sécher","Whey ou pas ?","Créatine ou pas ?","J’ai match demain je mange quoi ?"]
  }
};
