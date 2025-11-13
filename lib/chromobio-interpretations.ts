/**
 * ChromobioTest Color Interpretations
 *
 * Interpretation Rules:
 * - More than 5 remaining colors = EXCESS (En excès)
 * - Less than 4 remaining colors = SHORTAGE (En déficience)
 * - 4-5 remaining colors = BALANCED (Équilibré)
 */

export interface ColorInterpretation {
  id: number;
  name: string;
  mantra: string;
  symbolism: string;
  temperament: string[];
  properties: string[];
  excess: string;
  shortage: string;
  bodyParts?: string;
  organs?: string;
  chakra?: string;
  element?: string;
  note?: string;
}

export const CHROMOBIO_INTERPRETATIONS: Record<string, ColorInterpretation> = {
  fr: {
    1: { // Magenta
      id: 1,
      name: 'Magenta',
      mantra: 'JE SUIS UN, JE CONÇOIS, J\'AIME',
      symbolism: 'L\'Amour Universel, parfait équilibre entre le bleu roi et le rouge. Force universelle qui pousse à aimer pour créer quelque chose d\'unique. C\'est le doudou de la couleur.',
      temperament: ['Amoureux, affectif', 'Fusionnel, sentimental', 'Rêveur, romantique, juvénile, tendre', 'Perfectionniste'],
      properties: [
        'Cicatrisant et nutriment affectif',
        'Urgence affective',
        'Aide en cas de dépendance',
        'Aphrodisiaque',
        'Normalisant artériel'
      ],
      excess: 'Dépendance affective, sentiment d\'abandon. L\'âme demande à ce qu\'on s\'occupe d\'elle. Dépendance à un aliment (chocolat, sucre...), à une substance (alcool, drogue...), à un médicament (antidépresseur)...',
      shortage: 'Rejet affectif (peut-être dû à une rupture sentimentale). Traumatisme affectif.',
      bodyParts: 'Thorax, sternum, vertèbres thoraciques 4, 5 et 6',
      organs: 'Cœur, système cardiaque, artères, veines capillaires',
      chakra: '8ème chakra (étoile de l\'âme)'
    },
    2: { // Pourpre
      id: 2,
      name: 'Pourpre',
      mantra: 'JE MÉDITE ET JE TRANSCENDE',
      symbolism: 'De toutes les couleurs du spectre, c\'est sans aucun doute le pourpre qui est la plus énigmatique. C\'est une porte ultime ouvrant vers les mystères de l\'univers. Liée à la méditation et à la transcendance, elle symbolise le monde de l\'Esprit, de la spiritualité et de la religion.',
      temperament: ['Spirituel, religieux', 'Secret, énigmatique, mystique', 'Guide spirituel, maître à penser', 'Autoritaire, protecteur', 'Méditatif'],
      properties: [
        'Nutriment spirituel',
        'Calme les angoisses profondes',
        'Restructurant',
        'Aide à la communication avec son moi Supérieur',
        'Elargit la perception cosmique'
      ],
      excess: 'Extrémisme religieux. Mystique. Medium (parler avec les morts...)',
      shortage: 'Personne athée. Perte de repères spirituels.'
    },
    3: { // Violet
      id: 3,
      name: 'Violet',
      mantra: 'J\'AI LA FOI, J\'EXPÉRIMENTE L\'UNITÉ, JE SAIS',
      symbolism: 'Cette couleur est un guide pour l\'humain. Elle nous indique le chemin. C\'est la couleur du Patriarche, du père de famille qui, par son autorité, mène le groupe. Le Violet nous accompagne vers le chemin de la spiritualité.',
      temperament: ['Masculin', 'Paternel', 'Manager, chef de groupe', 'Organisé, structuré', 'Patriarche'],
      properties: [
        'Nutriment psychique',
        'Immunostimulant',
        'Restructurant',
        'Rigidifiant'
      ],
      excess: 'Autoritaire, jugement, accusation, défi, trop rigide, trop de règles, trop structuré, trop organisé.',
      shortage: 'Quelqu\'un qui n\'aime pas les règles, l\'autorité. Problèmes avec le père, mensonge, rébellion.',
      bodyParts: 'Mémoire, matière grise, veines',
      organs: 'Os du crâne sphénoïde, l\'hyoïde et les os wormiens. Palais, langue, langage et la verbalisation.',
      chakra: '7ème CHAKRA - Chakra de la couronne - Sahasrara',
      element: 'Ether',
      note: 'SI'
    },
    4: { // Bleu Roi
      id: 4,
      name: 'Bleu Roi',
      mantra: 'JE ME TRANSFORME',
      symbolism: 'Se retrouve dans le monde maritime bien au large des côtes, lorsque l\'océan plonge dans les abysses d\'un monde inexploré. Tel un gouffre sans fin, elle capture l\'esprit et l\'amène dans les profondeurs abyssales. Groupe, famille, société.',
      temperament: ['Profond, cohérent', 'Homogène, harmonieux', 'Métaphysique, immatériel', 'Humanitaire', 'Sombre, ténébreux', 'Insondable, impénétrable'],
      properties: [
        'Calmant psychique',
        'Soporifique',
        'Hypnotique',
        'Somnifère',
        'Harmonisant'
      ],
      excess: 'Hypersomnie. Hypnose.',
      shortage: 'Insomnie. Déconnecté.',
      bodyParts: 'Sommet du crâne, os temporaux, os pariétaux',
      organs: 'Cortex cérébral, épiphyse, sang veineux',
      chakra: '6ème Chakra - 3ème œil - Ajna',
      note: 'LA'
    },
    5: { // Indigo
      id: 5,
      name: 'Indigo',
      mantra: 'JE SUIS EN PAIX',
      symbolism: 'Se retrouve haut dans le ciel, où elle apparaît à l\'aube et au crépuscule. Le bleu outremer a l\'art d\'inspirer un profond sentiment de paix, de sérénité et de tranquillité. C\'est le grand pacificateur. Capacités extrasensorielles.',
      temperament: ['Serein, pacifique', 'Calme, tranquille', 'Patient, prudent', 'Tempéré, modéré', 'Attentif, intuitif'],
      properties: [
        'Anti-stress',
        'Calmant',
        'Concentration',
        'Tranquillisant',
        'Relaxant',
        'Sédatif'
      ],
      excess: 'Personne qui n\'a pas les pieds sur terre. Vit dans un monde imaginaire. Lent mentalement et physiquement.',
      shortage: 'Manque de concentration. Manque d\'intuition. Pas connecté à la bibliothèque universelle.'
    },
    6: { // Bleu
      id: 6,
      name: 'Bleu',
      mantra: 'JE SUIS EN PAIX',
      symbolism: 'Couleur qui ouvre l\'horizon. Étroitement lié au rêve, à l\'évasion. Comme l\'eau qui désaltère, le bleu est rafraîchissant et pur. Il permet de retrouver un calme intérieur. Communication paisible.',
      temperament: ['Céleste', 'Calme', 'Tranquille', 'Rêveur', 'Dans son monde'],
      properties: [
        'Anti-stress',
        'Calmant',
        'Tranquillisant',
        'Relaxant',
        'Sédatif'
      ],
      excess: 'Trop rêveur, déconnecté de la réalité.',
      shortage: 'Difficulté à trouver la paix intérieure. Agitation mentale.',
      bodyParts: 'Voies respiratoires, audition, thyroïde',
      organs: 'Voies respiratoires supérieures: nez, pharynx, larynx, cordes vocales. Oreilles. Thermorégulation, glande thyroïde.'
    },
    7: { // Cyan
      id: 7,
      name: 'Cyan',
      mantra: 'JE COMMUNIQUE',
      symbolism: 'Se retrouve dans le ciel diurne lorsque celui-ci est dégagé. De toutes les couleurs de l\'arc-en-ciel, le cyan est la teinte la plus froide. C\'est la première des 3 couleurs primaires "matière".',
      temperament: ['Aérien, vaporeux', 'Éthéré, évanescent', 'Placide', 'Communicatif, réceptif', 'Frais, froid'],
      properties: [
        'Anti-inflammatoire',
        'Rafraîchissant',
        'Contre irritant',
        'Antipyrétique',
        'Dispersant'
      ],
      excess: 'Logorhée (parle sans arrêt), diarrhée verbale.',
      shortage: 'Flegmatique, manque de franchise.',
      bodyParts: 'ORL, cou, nuque, vertèbres C4, C5 et C6',
      chakra: '5ème CHAKRA - Chakra de la gorge - Vishuddha',
      element: 'Ether',
      note: 'SOL'
    },
    8: { // Bleu Turquoise
      id: 8,
      name: 'Bleu Turquoise',
      mantra: 'JE CRÉE ET JE PARTAGE',
      symbolism: 'Se trouve dans l\'eau de mer la plus proche du rivage, là où la transition se fait entre le monde terrestre et le monde marin. Transition entre subconscient et conscient. Le bleu turquoise représente la créativité exprimée pour les autres.',
      temperament: ['Créatif pour les autres', 'Inspiré', 'Travaille avec les autres, en réseau', 'Se laisse porter par la vie', '"Up to date", suit l\'évolution'],
      properties: [
        'Anti-inflammatoire',
        'Anti-œdémateux',
        'Lâcher prise et se laisser aller par l\'évolution'
      ],
      excess: 'Altruiste. Peut se faire exploiter par les autres.',
      shortage: 'N\'aime pas partager ses idées.'
    },
    9: { // Vert Turquoise
      id: 9,
      name: 'Vert Turquoise',
      mantra: 'JE CRÉE QUELQUE CHOSE D\'ORIGINAL',
      symbolism: 'Se retrouve dans les eaux des lagons tropicaux. Créée par la nature, résultant d\'une combinaison entre la couleur des algues et du ciel. Elle représente la créativité exprimée de manière individuelle, l\'individuation.',
      temperament: ['Fluide, coulant, flottant', 'Propre, pur, immaculé', 'Variant, changeant', 'Cyclique, éphémère, lunatique'],
      properties: [
        'Nettoyant',
        'Décrassant',
        'Purifiant',
        'Hygiénique',
        'Catabolisant'
      ],
      excess: 'Se laisse emporter par les tendances, par la vague. Béni oui oui (le dernier qui a parlé a raison).',
      shortage: 'N\'aime pas le changement.',
      chakra: 'Chakra Turquoise: Ananda Khanda'
    },
    10: { // Vert
      id: 10,
      name: 'Vert',
      mantra: 'J\'OUVRE MON CŒUR - JE PARDONNE - COMPASSION',
      symbolism: 'La couleur que l\'on retrouve le plus souvent dans la nature. Couleur des arbres et de leur feuillage. Le vert est une couleur sans exagération qui évoque une sensation de neutralité et de détachement. Point exact de neutralité sur lequel repose l\'axe de la balance chromatique.',
      temperament: ['Naturel', 'Équilibré, neutre', 'Libre, indépendant', 'Autonome, détaché', 'Distant, solitaire'],
      properties: [
        'Équilibrant',
        'Neutralisant',
        'Homéostatique',
        'Déparasitant',
        'Antibiotique'
      ],
      excess: 'Personne trop indépendante, ermite, marginal.',
      shortage: 'Dépendance à une personne, un objet, une situation.',
      chakra: 'Chakra du Cœur - ANAHATA',
      element: 'Air, Matière Gazeuse',
      note: 'FA'
    },
    11: { // Citron (Vert Citron)
      id: 11,
      name: 'Citron',
      mantra: 'JE DÉCOUVRE',
      symbolism: 'Couleur saisissante tel un citron vert. Le vert citron ose aller de l\'avant, avec un goût d\'aventure. Oser sortir de chez soi et partir à l\'aventure.',
      temperament: ['Aventurier', 'Freelance', 'Curieux', 'Chercheur', 'Ouvert à de nouveaux horizons', 'Surprenant'],
      properties: [
        'Rafraîchissant',
        'Stimulant émotionnel',
        'Anti-inflammatoire',
        'Anti-oxydant',
        'Antiseptique'
      ],
      excess: 'Trop aventurier (part sans filet ni garde-fou). Casse-cou, utopiste.',
      shortage: 'Envie de faire des choses mais ne passe pas à l\'acte.'
    },
    12: { // Pomme (Vert Pomme)
      id: 12,
      name: 'Pomme',
      mantra: 'JE M\'OUVRE À L\'EXTÉRIEUR, JE M\'ADAPTE',
      symbolism: 'Apporte la première touche de fraîcheur printanière. Agit comme une véritable charnière, faisant passer la vision des couleurs chaudes aux couleurs neutres et froides. Elle donne malléabilité et flexibilité.',
      temperament: ['Ouvert, tolérant', 'Accessible, disponible', 'Flexible, souple', 'Malléable, indiscipliné'],
      properties: [
        'Stimulant de la vision',
        'Antiallergique, intolérance',
        'Expectorant',
        'Assouplit les articulations',
        'Souplesse mentale'
      ],
      excess: 'Se fait avoir par les autres. Influençable. Laxiste. Brouillon.',
      shortage: 'Rigidité d\'esprit mais aussi au niveau des articulations. Peu ouvert. A du mal à se remettre en question.',
      bodyParts: 'Diaphragme, tendons et ligaments, vertèbres thoraciques 6, 7 et 8',
      organs: 'Système visuel, plasticité cérébrale, vésicule biliaire'
    },
    13: { // Jaune
      id: 13,
      name: 'Jaune',
      mantra: 'J\'AI CONFIANCE EN MOI, JE PRENDS CONSCIENCE QUE J\'EXISTE',
      symbolism: 'Couleur du soleil qui apporte la lumière sur terre. Le jaune apporte la plus grande clarté sur notre vision, la perception de soi et la vision sur le monde. Elle permet de se positionner au sein de notre environnement.',
      temperament: ['Clair, lumineux', 'Lucide, éveillé', 'Conscient', 'Réfléchi, intelligent', 'Individualiste', 'Esprit analytique', 'Gestionnaire', 'Confiance en soi'],
      properties: [
        'Stimulant intellectuel',
        'Stimulant lymphatique',
        'Stimulant de la digestion',
        'Stimulant de l\'estomac',
        'Antidiabétique'
      ],
      excess: 'Égocentrique.',
      shortage: 'Je ne suis rien, je n\'existe pas. Échec scolaire.',
      bodyParts: 'Ventre, épigastre, vertèbres thoraciques 9, 10 et 11',
      organs: 'Fonctions digestives, estomac, pancréas',
      chakra: '3ème chakra - Chakra du plexus solaire - Manipûra',
      element: 'Feu',
      note: 'Mi'
    },
    14: { // Or
      id: 14,
      name: 'Or',
      mantra: 'J\'AIME LA VIE',
      symbolism: 'Couleur du soleil et des boutons d\'or. Un incomparable magnétisme s\'en dégage. Le jaune d\'or illumine la journée et réchauffe les cœurs. Il apporte l\'énergie et la confiance nécessaires à l\'éveil de sa conscience. Il illumine le visage qu\'on montre au monde. Sagesse intérieure.',
      temperament: ['Rayonnant, brillant', 'Confiant, assuré', 'Riche, fortuné'],
      properties: [
        'Stimulant de l\'essence de l\'être',
        'Confiance en la vie',
        'Libération du diaphragme',
        'Stimulant du plexus solaire'
      ],
      excess: 'Mauvais rapport avec l\'argent et la fortune. Personne qui fait sa star. Orgueilleux.',
      shortage: 'Trop discret. Introverti. Peu de confiance en la vie.'
    },
    15: { // Orange
      id: 15,
      name: 'Orange',
      mantra: 'JE SENS - JE RESSENS',
      symbolism: 'Située entre le rouge dynamique et l\'or qui parle de confiance en soi. Assimilée à la bonne humeur et à l\'optimisme. Parle de sexualité et de sensualité. Palpitante, excitante et pleine de mouvement, elle incite à faire la fête, à chanter, danser, boire et manger.',
      temperament: ['Émotionnel, sensible', 'Sensuel, tactile', 'Optimiste, enthousiaste', 'Joyeux, aime faire la fête', 'Épicurien'],
      properties: [
        'Stimulant et excitant sensoriel',
        'Aide en cas de choc émotionnel',
        'Antidépresseur',
        'Décongestionnant'
      ],
      excess: 'Stress, agitation, pression. Hypersensible émotionnellement. Tension, énervement, précipitation. Don Juan. Aime les plaisirs de la vie.',
      shortage: 'Problème de vitalité générale. Manque de joie de vivre et de bonne humeur. Dépression. Pas d\'écoute dans ses émotions. Paralysie, froideur, immobilisation, stagnation.',
      bodyParts: 'Hypogastre, pubis, vertèbres thoraciques 12 lombaires 1 et 2',
      organs: 'Glandes surrénales, système nerveux sympathique, fonctions locomotrices',
      chakra: '2ème chakra - Chakra Sacré - Swadhisthana',
      element: 'Eau',
      note: 'Ré'
    },
    16: { // Rouge
      id: 16,
      name: 'Rouge',
      mantra: 'JE VIS',
      symbolism: 'La couleur la plus chaude et la plus physique du spectre lumineux. Représente tout ce qui est en rapport avec le feu. C\'est le "café de la couleur". Dynamique et vif, le rouge est volontaire et plein de vie. On associe la couleur rouge au sang et à l\'énergie de la vie.',
      temperament: ['Dynamique et travailleur', 'Actif, sportif', 'Sanguin, énergique', 'Courageux, volontaire', 'Chaud, brûlant, vivant'],
      properties: [
        'Stimulant physique et dynamisant',
        'Augmente l\'énergie et fortifie',
        'Augmente la température du corps',
        'Accélère la cicatrisation'
      ],
      excess: 'Hyperactivité physique. Colère intérieure et/ou extérieure. Agressif - violent - intempestif. Si la personne est calme: colère intériorisée. Hypertension artérielle.',
      shortage: 'Fatigué, épuisé physiquement. Hypoactivité. Personne passive. Aime le calme. Fait de l\'hypotension. Manque de courage pour se lancer.',
      chakra: '1er Chakra - Chakra racine - Mulhadara',
      element: 'Terre',
      note: 'Do'
    },
    17: { // Ecarlate
      id: 17,
      name: 'Écarlate',
      mantra: 'JE ME SENS EN SÉCURITÉ',
      symbolism: 'Représente le monde matériel et physique. C\'est la matérialisation de notre création. Le meilleur exemple est l\'utérus qui accueille l\'enfant. L\'écarlate est la mère. Une couleur très sécurisante qui procure une sensation de cocooning et d\'enveloppement.',
      temperament: ['Féminin, maternel', 'Nourricier, fertile', 'Abondant, prospère', 'Stable, enraciné', 'Concret, tangible', 'Incarné, corporel'],
      properties: [
        'Hydratant pour la peau',
        'Cicatrisant physique',
        'Renforce et nourrit les tissus et les muscles',
        'Irrigue les muqueuses'
      ],
      excess: 'Radin. Mère poule. Hyperactivité au niveau des organes génitaux féminins: fibromes, kystes.',
      shortage: 'Relation avec la mère (rejet de la mère?). Problème de sécurité. Insouciance. Instable. Dépensier. Les carences, la privation, la pauvreté, l\'infécondité, les blessures physiques.',
      bodyParts: 'Bassin, fesses, jambes, pieds, vertèbres sacrées 1 à 5',
      organs: 'Matrice, vessie, artères'
    },
    18: { // Framboise
      id: 18,
      name: 'Framboise',
      mantra: 'J\'AI ENVIE DE CRÉER',
      symbolism: 'Apparaît juste après la couleur magenta. Après avoir eu l\'intention de créer, il est important de matérialiser sa création. Cette couleur représente l\'acte de création. C\'est la volonté de créer et de jouer. Elle procure une sensation d\'euphorie créative.',
      temperament: ['Infantile, jeune', 'Tendre, vulnérable', 'Actif, Créatif', 'Joyeux'],
      properties: [
        'Créativité',
        'Joie de créer',
        'Cicatrisation émotionnelle',
        'Rajeunissant, antivieillissement',
        'Adoucissant tissulaire',
        'Hydrate la peau'
      ],
      excess: 'Agit sans réfléchir.',
      shortage: 'Quelqu\'un qui a des idées mais qui ne sait pas comment faire. Ne trouve pas la façon de le faire, les outils pour réaliser. A envie de passer à l\'action mais n\'y arrive pas.',
      bodyParts: 'Thorax, sternum, vertèbres thoraciques 4, 5 et 6',
      organs: 'Cœur, système cardiaque, artères, veines capillaires'
    }
  }
};

/**
 * Helper function to get interpretation based on color count
 */
export function getInterpretation(colorId: number, count: number, lang: string = 'fr'): {
  status: 'excess' | 'balanced' | 'shortage';
  message: string;
} {
  const interpretation = CHROMOBIO_INTERPRETATIONS[lang]?.[colorId];

  if (!interpretation) {
    return {
      status: 'balanced',
      message: ''
    };
  }

  if (count > 5) {
    return {
      status: 'excess',
      message: interpretation.excess
    };
  } else if (count < 4) {
    return {
      status: 'shortage',
      message: interpretation.shortage
    };
  } else {
    return {
      status: 'balanced',
      message: 'Équilibré'
    };
  }
}
