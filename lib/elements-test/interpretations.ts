// Les 32 textes d'interprétation, générés depuis docs/test-4-elements/spec-v2.md.
// Ne pas éditer à la main : modifier la spec puis lancer scripts/build-elements-interpretations.py

export interface Interpretation {
  titre: string;
  sousTitre: string;
  couleur: string;
  texte: string;
}

export const INTERPRETATIONS: Record<string, Interpretation> = {
  "maitrise-feu": {
    titre: "🔥 Feu maîtrisé",
    sousTitre: "Force élevée · Ombre faible",
    couleur: "#E67E22",
    texte: "Le Feu anime votre être. Vous êtes un moteur pour ceux qui vous entourent, porté par une volonté ardente et un enthousiasme contagieux. Votre courage et votre créativité font de vous un initiateur naturel. Veillez simplement à ne pas consumer ce que vous souhaitez éclairer — la maîtrise du Feu, c'est savoir réchauffer sans brûler.",
  },
  "maitrise-eau": {
    titre: "💧 Eau maîtrisée",
    sousTitre: "Force élevée · Ombre faible",
    couleur: "#2E86C1",
    texte: "L'Eau coule en vous avec une sagesse profonde. Votre cœur perçoit ce que les autres ne voient pas encore. Empathie, douceur et intuition sont vos dons naturels. Vous savez aimer, pardonner, et tenir compagnie dans la nuit. Continuez à laisser couler sans vous noyer — votre profondeur est une lumière.",
  },
  "maitrise-air": {
    titre: "🌬️ Air maîtrisé",
    sousTitre: "Force élevée · Ombre faible",
    couleur: "#8E44AD",
    texte: "L'Air habite votre esprit avec clarté. Intelligence, humour et sens de la communication font de vous un pont entre les êtres. Vous savez nommer les choses juste, éclairer une situation d'un seul mot. Ancrez vos idées dans la réalité pour qu'elles portent leurs fruits bien au-delà de vous.",
  },
  "maitrise-terre": {
    titre: "🌿 Terre maîtrisée",
    sousTitre: "Force élevée · Ombre faible",
    couleur: "#58A845",
    texte: "La Terre vous soutient et vous ancre. Vous êtes le pilier silencieux sur lequel les autres s'appuient sans toujours le savoir. Votre persévérance, votre intégrité et votre sens du devoir sont des ressources rares. Permettez-vous parfois la légèreté de l'Air et l'ardeur du Feu — l'ancrage ne doit pas devenir immobilité.",
  },
  "puissant-feu": {
    titre: "🔥 Feu puissant",
    sousTitre: "Force élevée · Ombre élevée",
    couleur: "#E67E22",
    texte: "Le Feu est votre élément dominant — dans ses dons comme dans ses excès. Courage, élan et passion cohabitent avec la colère, l'impatience ou l'orgueil. Vous n'êtes ni en manque ni en déséquilibre : vous êtes en surchauffe. Tout est là, mais rien n'est encore canalisé. Le travail n'est pas d'éteindre — c'est de forger. Donnez à cette force une forme, un rythme, une direction, et elle deviendra votre plus grand allié.",
  },
  "puissant-eau": {
    titre: "💧 Eau puissante",
    sousTitre: "Force élevée · Ombre élevée",
    couleur: "#2E86C1",
    texte: "L'Eau vous habite tout entier — la profondeur comme les marées. Empathie, douceur et intuition vont de pair avec la susceptibilité, la mélancolie ou la dépendance affective. Vous ressentez beaucoup, parfois trop, et le courant vous emporte autant qu'il vous porte. Votre apprentissage est celui des berges : donner un lit à ce fleuve, pour qu'il nourrisse sans inonder.",
  },
  "puissant-air": {
    titre: "🌬️ Air puissant",
    sousTitre: "Force élevée · Ombre élevée",
    couleur: "#8E44AD",
    texte: "L'Air souffle fort en vous — vif, brillant, mais aussi dispersé. Intelligence, humour et aisance verbale s'accompagnent de bavardage, de nervosité ou d'inconstance. Vous pensez vite, parlez vite, changez vite. La leçon de l'Air puissant n'est pas de ralentir l'esprit, mais de lui donner un point fixe : une intention, un silence, un ancrage d'où le vent peut souffler sans tout emporter.",
  },
  "puissant-terre": {
    titre: "🌿 Terre puissante",
    sousTitre: "Force élevée · Ombre élevée",
    couleur: "#58A845",
    texte: "La Terre vous donne votre poids et votre force — mais aussi votre lourdeur. Persévérance, fiabilité et sens du concret cohabitent avec la rigidité, l'entêtement ou la méfiance. Vous tenez bon, parfois jusqu'à ne plus bouger. Ce qui vous est demandé n'est pas de lâcher la structure, mais de l'aérer : laisser le Feu la réchauffer, l'Eau la traverser, l'Air la faire respirer.",
  },
  "desequilibre-feu": {
    titre: "🔥 Feu déséquilibré",
    sousTitre: "Ombre élevée · Force faible",
    couleur: "#E67E22",
    texte: "Votre Feu brûle sans direction ni maîtrise. Colère, orgueil et impulsivité signalent une énergie considérable qui n'a pas encore trouvé son axe. Ce n'est pas l'énergie qui manque — c'est le canal. La première étape est de reconnaître ces flammes sans les fuir ni les laisser tout consumer.",
  },
  "desequilibre-eau": {
    titre: "💧 Eau déséquilibrée",
    sousTitre: "Ombre élevée · Force faible",
    couleur: "#2E86C1",
    texte: "Les profondeurs de l'Eau peuvent devenir des abîmes. Mélancolie, dépendance affective et passivité signalent un monde intérieur riche mais sans mouvement. L'Eau stagnante se corrompt — il vous faut retrouver le courant, accepter le changement, et laisser entrer la lumière dans les zones d'ombre.",
  },
  "desequilibre-air": {
    titre: "🌬️ Air déséquilibré",
    sousTitre: "Ombre élevée · Force faible",
    couleur: "#8E44AD",
    texte: "Un Air non maîtrisé disperse et égare. Bavardage, manipulation et instabilité mentale révèlent un intellect brillant qui tourne à vide. La parole sans substance s'évapore. Votre premier exercice est le silence — non pas pour vous taire, mais pour écouter ce que vous dites vraiment.",
  },
  "desequilibre-terre": {
    titre: "🌿 Terre déséquilibrée",
    sousTitre: "Ombre élevée · Force faible",
    couleur: "#58A845",
    texte: "Une Terre trop lourde devient pierre. Rigidité, avarice, entêtement et routine signalent un ancrage devenu prison. Ce qui devait vous soutenir vous paralyse. L'initiation commence précisément là : accepter que le mouvement ne détruit pas — il transforme.",
  },
  "absent-feu": {
    titre: "🔥 Feu absent",
    sousTitre: "Ni force ni ombre",
    couleur: "#E67E22",
    texte: "Le Feu est presque inexistant dans votre nature actuelle. Manque de volonté, d'initiative et de confiance en soi peuvent en être les signes. Ce n'est pas une condamnation — c'est une invitation. Le Feu s'allume, il s'apprend. Commencez par un acte courageux, même petit. La flamme naît du frottement.",
  },
  "absent-eau": {
    titre: "💧 Eau absente",
    sousTitre: "Ni force ni ombre",
    couleur: "#2E86C1",
    texte: "L'Eau est quasi absente de votre paysage intérieur. Une certaine sécheresse émotionnelle, une difficulté à ressentir ou à vous laisser toucher peut en témoigner. Votre chemin passe par l'ouverture du cœur — la méditation, l'art, la nature et la relation authentique sont vos portes d'entrée.",
  },
  "absent-air": {
    titre: "🌬️ Air absent",
    sousTitre: "Ni force ni ombre",
    couleur: "#8E44AD",
    texte: "L'Air brille par son absence. Rigidité mentale, difficulté à communiquer ou à voir les choses sous plusieurs angles peuvent en être les symptômes. Cultiver la curiosité, lire, dialoguer, voyager intérieurement — voilà comment raviver ce souffle qui manque encore.",
  },
  "absent-terre": {
    titre: "🌿 Terre absente",
    sousTitre: "Ni force ni ombre",
    couleur: "#58A845",
    texte: "La Terre vous fait défaut. Instabilité, manque de constance, projets inachevés et difficulté à tenir dans la durée en sont souvent les signes. Apprendre à finir ce que l'on commence, à honorer ses engagements, à accepter la lenteur — telle est votre école du moment.",
  },
  "bi-feu-eau": {
    titre: "🔥💧 Feu + Eau",
    sousTitre: "Le Volcan et la Source",
    couleur: "#8B3A5C",
    texte: "Vous portez en vous deux forces opposées et complémentaires : la passion du Feu et la profondeur de l'Eau. Vous êtes capable d'une intensité émotionnelle rare, d'un amour ardent et d'une créativité puissante. Mais ces deux éléments se combattent aussi : l'impulsivité contre la sensibilité, la volonté contre l'abandon. Votre chemin est l'alchimie intérieure — transformer la tension en vapeur créatrice.",
  },
  "bi-feu-air": {
    titre: "🔥🌬️ Feu + Air",
    sousTitre: "La Flamme et le Vent",
    couleur: "#B86B3A",
    texte: "Feu et Air se nourrissent mutuellement en vous : le Vent attise la Flamme, la Flamme réchauffe l'Air. Enthousiasme, intelligence, éloquence et charisme sont vos armes naturelles. Vous pouvez inspirer, convaincre, transformer les idées en actes. Le risque : s'embraser trop vite, brûler les étapes. L'ancrage dans la Terre vous manque peut-être.",
  },
  "bi-feu-terre": {
    titre: "🔥🌿 Feu + Terre",
    sousTitre: "Le Forgeron",
    couleur: "#9A7A2E",
    texte: "La combinaison Feu et Terre produit l'artisan, le bâtisseur, le guerrier patient. Vous avez à la fois l'élan et la persistance, le courage et la méthode. Vous menez vos projets du début à la fin avec une puissance rare. Veillez à ne pas devenir inflexible — ni la chaleur humaine (Eau) ni la légèreté (Air) ne doivent disparaître de votre vie.",
  },
  "bi-eau-air": {
    titre: "💧🌬️ Eau + Air",
    sousTitre: "Le Poète",
    couleur: "#5E63B6",
    texte: "L'union de l'Eau et de l'Air produit une sensibilité fine et une intelligence du cœur. Vous ressentez profondément et vous savez mettre des mots justes sur ce que les autres n'arrivent pas à exprimer. Empathie, créativité et subtilité vous définissent. Attention à la dispersion et au manque d'ancrage : sans Terre ni Feu, les plus belles idées restent dans les nuages.",
  },
  "bi-eau-terre": {
    titre: "💧🌿 Eau + Terre",
    sousTitre: "La Source et le Rocher",
    couleur: "#3A8A7A",
    texte: "Eau et Terre forment en vous une nature profonde, stable et nourricière. Vous êtes un roc pour ceux qui vous entourent : fiable, loyal, attentionné. Votre patience est légendaire, votre dévouement sans faille. Le danger est l'immobilisme et la résignation — sans Feu pour vous propulser ni Air pour vous libérer, vous risquez de vous ensabler dans la routine ou la mélancolie.",
  },
  "bi-air-terre": {
    titre: "🌬️🌿 Air + Terre",
    sousTitre: "L'Architecte",
    couleur: "#6E7A4A",
    texte: "Air et Terre ensemble font le penseur pragmatique, l'architecte de la réalité. Vous avez à la fois la clarté mentale et le sens concret, la stratégie et l'exécution. Vous construisez des choses solides et cohérentes. Ce qui peut vous manquer : la chaleur du Feu pour vous engager pleinement et la douceur de l'Eau pour toucher les cœurs au-delà des idées.",
  },
  "tri-sans-terre": {
    titre: "🔥💧🌬️ Feu + Eau + Air",
    sousTitre: "Il manque la Terre",
    couleur: "#58A845",
    texte: "Vous êtes riche en intensité, en émotion et en intelligence — mais vous manquez d'ancrage. Vos projets commencent avec passion, vos idées fusent, vos émotions débordent... mais les résultats concrets tardent. La Terre est votre grande leçon : finir, concrétiser, s'engager dans la durée. Sans elle, vous brûlez sans laisser de trace durable.",
  },
  "tri-sans-air": {
    titre: "🔥💧🌿 Feu + Eau + Terre",
    sousTitre: "Il manque l'Air",
    couleur: "#8E44AD",
    texte: "Vous avez la passion, la profondeur et la constance — mais la communication et la légèreté vous font défaut. Vous ressentez énormément mais peinez à exprimer, à partager, à vous connecter avec légèreté aux autres. L'Air est votre porte d'ouverture : apprendre à parler de soi, à rire, à laisser entrer de la clarté dans votre monde dense.",
  },
  "tri-sans-eau": {
    titre: "🔥🌬️🌿 Feu + Air + Terre",
    sousTitre: "Il manque l'Eau",
    couleur: "#2E86C1",
    texte: "Vous avez l'élan, l'intelligence et la solidité — mais votre monde émotionnel est peu habité. Vous agissez, vous pensez, vous construisez, mais vous touchez rarement les cœurs, ni le vôtre ni celui des autres. L'Eau est votre invitation : ralentir, ressentir, s'autoriser la vulnérabilité. C'est là que l'humain en vous attend.",
  },
  "tri-sans-feu": {
    titre: "💧🌬️🌿 Eau + Air + Terre",
    sousTitre: "Il manque le Feu",
    couleur: "#E67E22",
    texte: "Vous êtes sensible, intelligent et fiable — mais il vous manque l'étincelle. La volonté, l'audace et l'initiative sont vos zones d'ombre. Vous attendez souvent que les choses viennent à vous plutôt que de les provoquer. Le Feu est votre défi : oser, prendre votre place, agir même sans garantie. La vie récompense ceux qui s'avancent.",
  },
  "equilibre-parfait": {
    titre: "⚖️ Équilibre parfait",
    sousTitre: "Les 4 éléments quasi égaux",
    couleur: "#5D4E8C",
    texte: "Vos quatre éléments sont en harmonie remarquable. Vous portez en vous la chaleur du Feu, la profondeur de l'Eau, la clarté de l'Air et la solidité de la Terre — sans qu'aucun n'écrase les autres. Cette rare équanimité est le but même du travail initiatique selon Bardon. Elle n'est pas figée : continuez à l'observer, à l'entretenir. L'équilibre se maintient par la vigilance, pas par l'inaction.",
  },
  "desequilibre-total": {
    titre: "🌑 Déséquilibre total",
    sousTitre: "Les ombres dominent partout",
    couleur: "#2C2C2C",
    texte: "Vos quatre miroirs noirs sont chargés. Cela signifie une grande honnêteté de votre part — ou une période de vie particulièrement éprouvante. Ne vous découragez pas : voir clairement ses ombres est déjà un acte courageux. Pour Bardon, c'est précisément le point de départ. Commencez par un seul défaut, un seul élément, et travaillez-le patiemment. La transformation commence par un pas.",
  },
  "qualites-abondantes": {
    titre: "✨ Qualités abondantes",
    sousTitre: "Les forces dominent partout",
    couleur: "#8C6D1F",
    texte: "Vous avez reconnu en vous une grande richesse de qualités dans les quatre éléments. Que ce soit une réalité ou une aspiration profonde, c'est une boussole précieuse. Bardon rappelle cependant que les miroirs doivent être sincères — non pas ce que nous voudrions être, mais ce que nous sommes aujourd'hui. Revenez régulièrement à cette évaluation avec une honnêteté renouvelée.",
  },
  "opposition-feu-eau": {
    titre: "🔥💧 Feu et Eau en opposition",
    sousTitre: "Tension intérieure",
    couleur: "#6B3A5C",
    texte: "Feu et Eau s'affrontent en vous avec une intensité particulière — vous êtes tiraillé entre l'action et le repli, la passion et la mélancolie, la domination et la douceur. Ces contradictions peuvent être épuisantes, mais elles sont aussi la marque des natures les plus profondes. La clé : ne pas choisir entre les deux, mais apprendre à les laisser coexister. La vapeur naît de leur rencontre.",
  },
  "opposition-air-terre": {
    titre: "🌬️🌿 Air et Terre en opposition",
    sousTitre: "Tête contre corps",
    couleur: "#4A6B3A",
    texte: "Votre esprit court plus vite que votre corps ne suit, ou l'inverse : vos habitudes pèsent trop pour que vos idées puissent s'envoler. Air veut liberté, Terre veut structure. Vous naviguez entre l'idéal et le possible, entre l'inspiration et l'application. Votre travail : faire dialoguer le rêveur et l'artisan qui vivent en vous.",
  },
  "initiant-sincere": {
    titre: "🌟 Initiant sincère",
    sousTitre: "Toutes les ombres reconnues, toutes les forces cultivées",
    couleur: "#8C6D1F",
    texte: "Vous avez coché des qualités ET des défauts dans chaque élément, avec équanimité. C'est le profil de celui qui s'observe vraiment — ni complaisant ni trop sévère. Bardon appelle cela l'introspection juste. Vous êtes sur la voie. Le miroir blanc et le miroir noir sont les deux yeux de la conscience. Vous apprenez à voir avec les deux.",
  },
};
