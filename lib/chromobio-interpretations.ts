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

export const CHROMOBIO_INTERPRETATIONS: Record<string, Record<number, ColorInterpretation>> = {
  en: {
    1: { // Magenta
      id: 1,
      name: 'Magenta',
      mantra: 'I AM ONE, I CONCEIVE, I LOVE',
      symbolism: 'Universal Love, perfect balance between royal blue and red. Universal force that drives us to love in order to create something unique. It is the comfort blanket of colors.',
      temperament: ['Loving, affectionate', 'Fusional, sentimental', 'Dreamy, romantic, youthful, tender', 'Perfectionist'],
      properties: [
        'Healing and emotional nourishment',
        'Emotional urgency',
        'Helps with dependency',
        'Aphrodisiac',
        'Arterial normalizing'
      ],
      excess: 'Emotional dependency, feelings of abandonment. The soul asks to be taken care of. Dependency on food (chocolate, sugar...), substance (alcohol, drugs...), medication (antidepressants)...',
      shortage: 'Emotional rejection (possibly due to romantic breakup). Emotional trauma.',
      bodyParts: 'Thorax, sternum, thoracic vertebrae 4, 5 and 6',
      organs: 'Heart, cardiac system, arteries, capillary veins',
      chakra: '8th chakra (soul star)'
    },
    2: { // Pourpre
      id: 2,
      name: 'Purple',
      mantra: 'I MEDITATE AND TRANSCEND',
      symbolism: 'Of all the colors of the spectrum, purple is undoubtedly the most enigmatic. It is an ultimate gateway opening to the mysteries of the universe. Linked to meditation and transcendence, it symbolizes the world of Spirit, spirituality and religion.',
      temperament: ['Spiritual, religious', 'Secret, enigmatic, mystical', 'Spiritual guide, thought leader', 'Authoritative, protective', 'Meditative'],
      properties: [
        'Spiritual nourishment',
        'Calms deep anxieties',
        'Restructuring',
        'Helps communication with Higher Self',
        'Expands cosmic perception'
      ],
      excess: 'Religious extremism. Mystical. Medium (talking with the dead...)',
      shortage: 'Atheistic person. Loss of spiritual bearings.'
    },
    3: { // Violet
      id: 3,
      name: 'Violet',
      mantra: 'I HAVE FAITH, I EXPERIENCE UNITY, I KNOW',
      symbolism: 'This color is a guide for humans. It shows us the way. It is the color of the Patriarch, the family father who, by his authority, leads the group. Violet accompanies us on the path to spirituality.',
      temperament: ['Masculine', 'Paternal', 'Manager, group leader', 'Organized, structured', 'Patriarch'],
      properties: [
        'Psychic nourishment',
        'Immunostimulant',
        'Restructuring',
        'Rigidifying'
      ],
      excess: 'Authoritarian, judgmental, accusatory, defiant, too rigid, too many rules, too structured, too organized.',
      shortage: 'Someone who dislikes rules and authority. Problems with father, lying, rebellion.',
      bodyParts: 'Memory, gray matter, veins',
      organs: 'Sphenoid skull bones, hyoid and wormian bones. Palate, tongue, language and verbalization.',
      chakra: '7th CHAKRA - Crown chakra - Sahasrara',
      element: 'Ether',
      note: 'B'
    },
    4: { // Bleu Roi
      id: 4,
      name: 'Royal Blue',
      mantra: 'I TRANSFORM MYSELF',
      symbolism: 'Found in the maritime world far offshore, when the ocean plunges into the abyss of an unexplored world. Like a bottomless pit, it captures the spirit and takes it into the abyssal depths. Group, family, society.',
      temperament: ['Deep, coherent', 'Homogeneous, harmonious', 'Metaphysical, immaterial', 'Humanitarian', 'Dark, shadowy', 'Unfathomable, impenetrable'],
      properties: [
        'Psychic calming',
        'Soporific',
        'Hypnotic',
        'Sleep-inducing',
        'Harmonizing'
      ],
      excess: 'Hypersomnia. Hypnosis.',
      shortage: 'Insomnia. Disconnected.',
      bodyParts: 'Top of skull, temporal bones, parietal bones',
      organs: 'Cerebral cortex, pineal gland, venous blood',
      chakra: '6th Chakra - Third eye - Ajna',
      note: 'A'
    },
    5: { // Indigo
      id: 5,
      name: 'Indigo',
      mantra: 'I AM AT PEACE',
      symbolism: 'Found high in the sky, where it appears at dawn and dusk. Ultramarine blue has the art of inspiring a deep feeling of peace, serenity and tranquility. It is the great peacemaker. Extrasensory abilities.',
      temperament: ['Serene, peaceful', 'Calm, quiet', 'Patient, cautious', 'Temperate, moderate', 'Attentive, intuitive'],
      properties: [
        'Anti-stress',
        'Calming',
        'Concentration',
        'Tranquilizing',
        'Relaxing',
        'Sedative'
      ],
      excess: 'Person who is not grounded. Lives in an imaginary world. Mentally and physically slow.',
      shortage: 'Lack of concentration. Lack of intuition. Not connected to the universal library.'
    },
    6: { // Bleu
      id: 6,
      name: 'Blue',
      mantra: 'I AM AT PEACE',
      symbolism: 'A color that opens the horizon. Closely linked to dreams and escapism. Like water that quenches thirst, blue is refreshing and pure. It allows you to find inner calm. Peaceful communication.',
      temperament: ['Celestial', 'Calm', 'Quiet', 'Dreamy', 'In their own world'],
      properties: [
        'Anti-stress',
        'Calming',
        'Tranquilizing',
        'Relaxing',
        'Sedative'
      ],
      excess: 'Too dreamy, disconnected from reality.',
      shortage: 'Difficulty finding inner peace. Mental agitation.',
      bodyParts: 'Respiratory tract, hearing, thyroid',
      organs: 'Upper respiratory tract: nose, pharynx, larynx, vocal cords. Ears. Thermoregulation, thyroid gland.'
    },
    7: { // Cyan
      id: 7,
      name: 'Cyan',
      mantra: 'I COMMUNICATE',
      symbolism: 'Found in the daytime sky when it is clear. Of all the colors of the rainbow, cyan is the coldest shade. It is the first of the 3 primary "matter" colors.',
      temperament: ['Airy, vaporous', 'Ethereal, evanescent', 'Placid', 'Communicative, receptive', 'Fresh, cold'],
      properties: [
        'Anti-inflammatory',
        'Refreshing',
        'Counter-irritant',
        'Antipyretic',
        'Dispersing'
      ],
      excess: 'Logorrhea (talks non-stop), verbal diarrhea.',
      shortage: 'Phlegmatic, lack of frankness.',
      bodyParts: 'ENT, neck, nape, cervical vertebrae C4, C5 and C6',
      chakra: '5th CHAKRA - Throat chakra - Vishuddha',
      element: 'Ether',
      note: 'G'
    },
    8: { // Bleu Turquoise
      id: 8,
      name: 'Turquoise Blue',
      mantra: 'I CREATE AND SHARE',
      symbolism: 'Found in seawater closest to shore, where the transition between the terrestrial and marine world occurs. Transition between subconscious and conscious. Turquoise blue represents creativity expressed for others.',
      temperament: ['Creative for others', 'Inspired', 'Works with others, networked', 'Goes with the flow', 'Up to date, follows evolution'],
      properties: [
        'Anti-inflammatory',
        'Anti-edema',
        'Letting go and going with evolution'
      ],
      excess: 'Altruistic. Can be exploited by others.',
      shortage: 'Doesn\'t like sharing ideas.'
    },
    9: { // Vert Turquoise
      id: 9,
      name: 'Turquoise Green',
      mantra: 'I CREATE SOMETHING ORIGINAL',
      symbolism: 'Found in the waters of tropical lagoons. Created by nature, resulting from a combination of algae color and sky. It represents creativity expressed individually, individuation.',
      temperament: ['Fluid, flowing, floating', 'Clean, pure, immaculate', 'Varying, changing', 'Cyclical, ephemeral, moody'],
      properties: [
        'Cleansing',
        'Purifying',
        'Purifying',
        'Hygienic',
        'Catabolic'
      ],
      excess: 'Gets carried away by trends, by the wave. Yes-person (last speaker is always right).',
      shortage: 'Doesn\'t like change.',
      chakra: 'Turquoise Chakra: Ananda Khanda'
    },
    10: { // Vert
      id: 10,
      name: 'Green',
      mantra: 'I OPEN MY HEART - I FORGIVE - COMPASSION',
      symbolism: 'The color most often found in nature. Color of trees and their foliage. Green is an unexaggerated color that evokes a sensation of neutrality and detachment. The exact point of neutrality on which the chromatic balance axis rests.',
      temperament: ['Natural', 'Balanced, neutral', 'Free, independent', 'Autonomous, detached', 'Distant, solitary'],
      properties: [
        'Balancing',
        'Neutralizing',
        'Homeostatic',
        'Deparasitizing',
        'Antibiotic'
      ],
      excess: 'Too independent person, hermit, marginal.',
      shortage: 'Dependency on a person, object, or situation.',
      chakra: 'Heart Chakra - ANAHATA',
      element: 'Air, Gaseous Matter',
      note: 'F'
    },
    11: { // Citron
      id: 11,
      name: 'Lemon',
      mantra: 'I DISCOVER',
      symbolism: 'A striking color like a lime. Lemon green dares to move forward, with a taste for adventure. Daring to leave home and set out on adventure.',
      temperament: ['Adventurous', 'Freelance', 'Curious', 'Seeker', 'Open to new horizons', 'Surprising'],
      properties: [
        'Refreshing',
        'Emotional stimulant',
        'Anti-inflammatory',
        'Antioxidant',
        'Antiseptic'
      ],
      excess: 'Too adventurous (goes without safety net). Reckless, utopian.',
      shortage: 'Wants to do things but doesn\'t take action.'
    },
    12: { // Pomme
      id: 12,
      name: 'Apple Green',
      mantra: 'I OPEN TO THE OUTSIDE, I ADAPT',
      symbolism: 'Brings the first touch of spring freshness. Acts as a real hinge, transitioning vision from warm and tonic colors to neutral and cold colors. It gives malleability and flexibility.',
      temperament: ['Open, tolerant', 'Accessible, available', 'Flexible, supple', 'Malleable, undisciplined'],
      properties: [
        'Vision stimulant',
        'Anti-allergic, intolerance',
        'Expectorant',
        'Softens joints',
        'Mental flexibility'
      ],
      excess: 'Gets taken advantage of by others. Influenceable. Lax. Messy.',
      shortage: 'Mental rigidity but also joint level. Not very open. Has difficulty questioning themselves.',
      bodyParts: 'Diaphragm, tendons and ligaments, thoracic vertebrae 6, 7 and 8',
      organs: 'Visual system, brain plasticity, gallbladder'
    },
    13: { // Jaune
      id: 13,
      name: 'Yellow',
      mantra: 'I HAVE CONFIDENCE IN MYSELF, I BECOME AWARE THAT I EXIST',
      symbolism: 'The color of the sun that brings light to earth. Yellow brings the greatest clarity to our vision, self-perception and vision of the world. It allows us to position ourselves within our environment.',
      temperament: ['Clear, luminous', 'Lucid, awake', 'Conscious', 'Thoughtful, intelligent', 'Individualist', 'Analytical mind', 'Manager', 'Self-confident'],
      properties: [
        'Intellectual stimulant',
        'Lymphatic stimulant',
        'Digestive stimulant',
        'Stomach stimulant',
        'Antidiabetic'
      ],
      excess: 'Egocentric.',
      shortage: 'I am nothing, I don\'t exist. Academic failure.',
      bodyParts: 'Belly, epigastrium, thoracic vertebrae 9, 10 and 11',
      organs: 'Digestive functions, stomach, pancreas',
      chakra: '3rd chakra - Solar plexus chakra - Manipûra',
      element: 'Fire',
      note: 'E'
    },
    14: { // Or
      id: 14,
      name: 'Gold',
      mantra: 'I LOVE LIFE',
      symbolism: 'The color of the sun and buttercups. Incomparable magnetism emanates from it. Golden yellow illuminates the day and warms hearts. It brings the energy and confidence necessary for awakening consciousness. It illuminates the face shown to the world. Inner wisdom.',
      temperament: ['Radiant, brilliant', 'Confident, assured', 'Rich, wealthy'],
      properties: [
        'Stimulant of being essence',
        'Confidence in life',
        'Diaphragm release',
        'Solar plexus stimulant'
      ],
      excess: 'Bad relationship with money and fortune. Person who plays the star. Arrogant.',
      shortage: 'Too discreet. Introverted. Little confidence in life.'
    },
    15: { // Orange
      id: 15,
      name: 'Orange',
      mantra: 'I FEEL - I SENSE',
      symbolism: 'Located between dynamic red and gold which speaks of self-confidence. Associated with good mood and optimism. Speaks of sexuality and sensuality. Exciting, thrilling and full of movement, it invites celebration, singing, dancing, drinking and eating.',
      temperament: ['Emotional, sensitive', 'Sensual, tactile', 'Optimistic, enthusiastic', 'Joyful, likes to party', 'Epicurean'],
      properties: [
        'Sensory stimulant and exciting',
        'Helps with emotional shock',
        'Antidepressant',
        'Decongestant'
      ],
      excess: 'Stress, agitation, pressure. Emotionally hypersensitive. Tension, nervousness, rushing. Don Juan. Loves life\'s pleasures.',
      shortage: 'General vitality problem. Lack of joy of living and good mood. Depression. No listening to emotions. Paralysis, coldness, immobilization, stagnation.',
      bodyParts: 'Hypogastrium, pubis, 12th thoracic vertebrae, lumbar 1 and 2',
      organs: 'Adrenal glands, sympathetic nervous system, locomotor functions',
      chakra: '2nd chakra - Sacral Chakra - Swadhisthana',
      element: 'Water',
      note: 'D'
    },
    16: { // Rouge
      id: 16,
      name: 'Red',
      mantra: 'I LIVE',
      symbolism: 'The warmest and most physical color of the light spectrum. Represents everything related to fire. It\'s the "coffee of color". Dynamic and lively, red is willful and full of life. This is why red is associated with blood and life energy.',
      temperament: ['Dynamic and hardworking', 'Active, athletic', 'Sanguine, energetic', 'Courageous, willful', 'Hot, burning, living'],
      properties: [
        'Physical stimulant and energizing',
        'Increases energy and strengthens',
        'Increases body temperature',
        'Accelerates healing'
      ],
      excess: 'Physical hyperactivity. Inner and/or outer anger. Aggressive - violent - impetuous. If person is calm: internalized anger. Hypertension.',
      shortage: 'Tired, physically exhausted. Hypoactivity. Passive person. Likes calm. Has hypotension. Lacks courage to start.',
      chakra: '1st Chakra - Root chakra - Mulhadara',
      element: 'Earth',
      note: 'C'
    },
    17: { // Ecarlate
      id: 17,
      name: 'Scarlet',
      mantra: 'I FEEL SAFE',
      symbolism: 'Represents the material and physical world. It is the materialization of our creation. The best example is the uterus that welcomes the child. Scarlet is the mother. A very reassuring color that provides a feeling of cocooning and envelopment.',
      temperament: ['Feminine, maternal', 'Nurturing, fertile', 'Abundant, prosperous', 'Stable, rooted', 'Concrete, tangible', 'Embodied, corporeal'],
      properties: [
        'Skin moisturizing',
        'Physical healing',
        'Strengthens and nourishes tissues and muscles',
        'Irrigates mucous membranes'
      ],
      excess: 'Stingy. Mother hen. Hyperactivity in female genital organs: fibroids, cysts.',
      shortage: 'Relationship with mother (rejection of mother?). Security issues. Carelessness. Unstable. Spendthrift. Deficiencies, deprivation, poverty, infertility, physical injuries.',
      bodyParts: 'Pelvis, buttocks, legs, feet, sacral vertebrae 1 to 5',
      organs: 'Uterus, bladder, arteries'
    },
    18: { // Framboise
      id: 18,
      name: 'Raspberry',
      mantra: 'I WANT TO CREATE',
      symbolism: 'Appears just after magenta. After having the intention to create, it is important to materialize one\'s creation. This color represents the act of creation. It is the will to create and play. It provides a feeling of creative euphoria.',
      temperament: ['Childlike, young', 'Tender, vulnerable', 'Active, Creative', 'Joyful'],
      properties: [
        'Creativity',
        'Joy of creating',
        'Emotional healing',
        'Rejuvenating, anti-aging',
        'Tissue softening',
        'Hydrates skin'
      ],
      excess: 'Acts without thinking.',
      shortage: 'Someone who has ideas but doesn\'t know how to do it. Can\'t find the way to do it, the tools to realize. Wants to take action but can\'t.',
      bodyParts: 'Thorax, sternum, thoracic vertebrae 4, 5 and 6',
      organs: 'Heart, cardiac system, arteries, capillary veins'
    }
  },
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
  },
  de: {
    1: { // Magenta
      id: 1,
      name: 'Magenta',
      mantra: 'ICH BIN EINS, ICH EMPFANGE, ICH LIEBE',
      symbolism: 'Universelle Liebe, perfektes Gleichgewicht zwischen Königsblau und Rot. Universelle Kraft, die uns dazu antreibt, zu lieben, um etwas Einzigartiges zu schaffen. Es ist die Kuscheldecke der Farben.',
      temperament: ['Liebevoll, zuneigungsvoll', 'Verschmelzend, sentimental', 'Träumerisch, romantisch, jugendlich, zärtlich', 'Perfektionistisch'],
      properties: [
        'Heilend und emotionale Nahrung',
        'Emotionale Dringlichkeit',
        'Hilft bei Abhängigkeit',
        'Aphrodisiakum',
        'Arteriell normalisierend'
      ],
      excess: 'Emotionale Abhängigkeit, Gefühle der Verlassenheit. Die Seele verlangt danach, umsorgt zu werden. Abhängigkeit von Nahrung (Schokolade, Zucker...), Substanz (Alkohol, Drogen...), Medikamenten (Antidepressiva)...',
      shortage: 'Emotionale Ablehnung (möglicherweise aufgrund einer romantischen Trennung). Emotionales Trauma.',
      bodyParts: 'Brustkorb, Brustbein, Brustwirbel 4, 5 und 6',
      organs: 'Herz, Herz-Kreislauf-System, Arterien, Kapillarvenen',
      chakra: '8. Chakra (Seelenstern)'
    },
    2: { // Pourpre
      id: 2,
      name: 'Purpur',
      mantra: 'ICH MEDITIERE UND TRANSZENDIERE',
      symbolism: 'Von allen Farben des Spektrums ist Purpur zweifellos die rätselhafteste. Es ist ein ultimates Tor, das sich zu den Geheimnissen des Universums öffnet. Verbunden mit Meditation und Transzendenz symbolisiert es die Welt des Geistes, der Spiritualität und der Religion.',
      temperament: ['Spirituell, religiös', 'Geheimnisvoll, enigmatisch, mystisch', 'Spiritueller Führer, Vordenker', 'Autoritär, beschützend', 'Meditativ'],
      properties: [
        'Spirituelle Nahrung',
        'Beruhigt tiefe Ängste',
        'Restrukturierend',
        'Hilft bei der Kommunikation mit dem Höheren Selbst',
        'Erweitert die kosmische Wahrnehmung'
      ],
      excess: 'Religiöser Extremismus. Mystisch. Medium (Gespräche mit den Toten...)',
      shortage: 'Atheistische Person. Verlust spiritueller Orientierung.'
    },
    3: { // Violet
      id: 3,
      name: 'Violett',
      mantra: 'ICH HABE GLAUBEN, ICH ERFAHRE EINHEIT, ICH WEISS',
      symbolism: 'Diese Farbe ist ein Führer für die Menschen. Sie zeigt uns den Weg. Es ist die Farbe des Patriarchen, des Familienvaters, der durch seine Autorität die Gruppe führt. Violett begleitet uns auf dem Weg zur Spiritualität.',
      temperament: ['Männlich', 'Väterlich', 'Manager, Gruppenleiter', 'Organisiert, strukturiert', 'Patriarch'],
      properties: [
        'Psychische Nahrung',
        'Immunstimulierend',
        'Restrukturierend',
        'Versteifend'
      ],
      excess: 'Autoritär, urteilend, anklagend, herausfordernd, zu starr, zu viele Regeln, zu strukturiert, zu organisiert.',
      shortage: 'Jemand, der Regeln und Autorität nicht mag. Probleme mit dem Vater, Lügen, Rebellion.',
      bodyParts: 'Gedächtnis, graue Substanz, Venen',
      organs: 'Keilbeinknochen, Zungenbein und Schaltknochen. Gaumen, Zunge, Sprache und Verbalisierung.',
      chakra: '7. CHAKRA - Kronenchakra - Sahasrara',
      element: 'Äther',
      note: 'H'
    },
    4: { // Bleu Roi
      id: 4,
      name: 'Königsblau',
      mantra: 'ICH TRANSFORMIERE MICH',
      symbolism: 'Findet sich in der maritimen Welt weit vor der Küste, wenn der Ozean in den Abgrund einer unerforschten Welt stürzt. Wie ein bodenloses Loch erfasst es den Geist und führt ihn in die abgrundtiefen Tiefen. Gruppe, Familie, Gesellschaft.',
      temperament: ['Tief, kohärent', 'Homogen, harmonisch', 'Metaphysisch, immateriell', 'Humanitär', 'Dunkel, schattig', 'Unergründlich, undurchdringlich'],
      properties: [
        'Psychisch beruhigend',
        'Einschläfernd',
        'Hypnotisch',
        'Schlaffördernd',
        'Harmonisierend'
      ],
      excess: 'Hypersomnie. Hypnose.',
      shortage: 'Schlaflosigkeit. Getrennt.',
      bodyParts: 'Schädeloberseite, Schläfenbeine, Scheitelbeine',
      organs: 'Großhirnrinde, Zirbeldrüse, venöses Blut',
      chakra: '6. Chakra - Drittes Auge - Ajna',
      note: 'A'
    },
    5: { // Indigo
      id: 5,
      name: 'Indigo',
      mantra: 'ICH BIN IN FRIEDEN',
      symbolism: 'Hoch am Himmel zu finden, wo es bei Morgendämmerung und Abenddämmerung erscheint. Ultramarinblau hat die Kunst, ein tiefes Gefühl von Frieden, Gelassenheit und Ruhe zu inspirieren. Es ist der große Friedensstifter. Außersinnliche Fähigkeiten.',
      temperament: ['Gelassen, friedlich', 'Ruhig, still', 'Geduldig, vorsichtig', 'Gemäßigt, moderat', 'Aufmerksam, intuitiv'],
      properties: [
        'Anti-Stress',
        'Beruhigend',
        'Konzentration',
        'Beruhigend',
        'Entspannend',
        'Beruhigend'
      ],
      excess: 'Person, die nicht geerdet ist. Lebt in einer imaginären Welt. Geistig und körperlich langsam.',
      shortage: 'Mangel an Konzentration. Mangel an Intuition. Nicht mit der universellen Bibliothek verbunden.'
    },
    6: { // Bleu
      id: 6,
      name: 'Blau',
      mantra: 'ICH BIN IN FRIEDEN',
      symbolism: 'Eine Farbe, die den Horizont öffnet. Eng verbunden mit Träumen und Eskapismus. Wie Wasser, das den Durst stillt, ist Blau erfrischend und rein. Es ermöglicht Ihnen, innere Ruhe zu finden. Friedliche Kommunikation.',
      temperament: ['Himmlisch', 'Ruhig', 'Still', 'Träumerisch', 'In ihrer eigenen Welt'],
      properties: [
        'Anti-Stress',
        'Beruhigend',
        'Beruhigend',
        'Entspannend',
        'Beruhigend'
      ],
      excess: 'Zu träumerisch, von der Realität abgekoppelt.',
      shortage: 'Schwierigkeiten, inneren Frieden zu finden. Geistige Unruhe.',
      bodyParts: 'Atemwege, Gehör, Schilddrüse',
      organs: 'Obere Atemwege: Nase, Rachen, Kehlkopf, Stimmbänder. Ohren. Thermoregulation, Schilddrüse.'
    },
    7: { // Cyan
      id: 7,
      name: 'Cyan',
      mantra: 'ICH KOMMUNIZIERE',
      symbolism: 'Findet sich im Tageshimmel, wenn er klar ist. Von allen Farben des Regenbogens ist Cyan der kälteste Farbton. Es ist die erste der 3 primären "Materie"-Farben.',
      temperament: ['Luftig, dampfförmig', 'Ätherisch, flüchtig', 'Ruhig', 'Kommunikativ, empfänglich', 'Frisch, kalt'],
      properties: [
        'Entzündungshemmend',
        'Erfrischend',
        'Gegenreizend',
        'Fiebersenkend',
        'Zerstreuend'
      ],
      excess: 'Logorrhoe (redet ohne Unterbrechung), verbale Diarrhöe.',
      shortage: 'Phlegmatisch, Mangel an Offenheit.',
      bodyParts: 'HNO, Hals, Nacken, Halswirbel C4, C5 und C6',
      chakra: '5. CHAKRA - Halschakra - Vishuddha',
      element: 'Äther',
      note: 'G'
    },
    8: { // Bleu Turquoise
      id: 8,
      name: 'Türkisblau',
      mantra: 'ICH ERSCHAFFE UND TEILE',
      symbolism: 'Findet sich im Meerwasser in Küstennähe, wo der Übergang zwischen der terrestrischen und der maritimen Welt stattfindet. Übergang zwischen Unterbewusstsein und Bewusstsein. Türkisblau repräsentiert Kreativität, die für andere ausgedrückt wird.',
      temperament: ['Kreativ für andere', 'Inspiriert', 'Arbeitet mit anderen, vernetzt', 'Geht mit dem Strom', 'Aktuell, folgt der Entwicklung'],
      properties: [
        'Entzündungshemmend',
        'Anti-Ödem',
        'Loslassen und mit der Entwicklung gehen'
      ],
      excess: 'Altruistisch. Kann von anderen ausgenutzt werden.',
      shortage: 'Mag es nicht, Ideen zu teilen.'
    },
    9: { // Vert Turquoise
      id: 9,
      name: 'Türkisgrün',
      mantra: 'ICH ERSCHAFFE ETWAS ORIGINELLES',
      symbolism: 'Findet sich in den Gewässern tropischer Lagunen. Von der Natur geschaffen, resultierend aus einer Kombination von Algenfarbe und Himmel. Es repräsentiert individuell ausgedrückte Kreativität, Individuation.',
      temperament: ['Fließend, strömend, schwebend', 'Sauber, rein, makellos', 'Variierend, sich verändernd', 'Zyklisch, flüchtig, launisch'],
      properties: [
        'Reinigend',
        'Säubernd',
        'Reinigend',
        'Hygienisch',
        'Katabolisch'
      ],
      excess: 'Lässt sich von Trends mitreißen, von der Welle. Ja-Sager (letzter Sprecher hat immer recht).',
      shortage: 'Mag keine Veränderung.',
      chakra: 'Türkis-Chakra: Ananda Khanda'
    },
    10: { // Vert
      id: 10,
      name: 'Grün',
      mantra: 'ICH ÖFFNE MEIN HERZ - ICH VERGEBE - MITGEFÜHL',
      symbolism: 'Die Farbe, die am häufigsten in der Natur vorkommt. Farbe der Bäume und ihres Laubes. Grün ist eine unübertriebene Farbe, die ein Gefühl von Neutralität und Distanz hervorruft. Der genaue Punkt der Neutralität, auf dem die chromatische Gleichgewichtsachse ruht.',
      temperament: ['Natürlich', 'Ausgeglichen, neutral', 'Frei, unabhängig', 'Autonom, distanziert', 'Fern, einsam'],
      properties: [
        'Ausgleichend',
        'Neutralisierend',
        'Homöostatisch',
        'Entparasitierend',
        'Antibiotisch'
      ],
      excess: 'Zu unabhängige Person, Einsiedler, marginal.',
      shortage: 'Abhängigkeit von einer Person, einem Objekt oder einer Situation.',
      chakra: 'Herzchakra - ANAHATA',
      element: 'Luft, gasförmige Materie',
      note: 'F'
    },
    11: { // Citron
      id: 11,
      name: 'Zitrone',
      mantra: 'ICH ENTDECKE',
      symbolism: 'Eine auffällige Farbe wie eine Limette. Zitronengrün wagt sich vorwärts, mit einem Geschmack für Abenteuer. Sich trauen, das Zuhause zu verlassen und sich auf ein Abenteuer einzulassen.',
      temperament: ['Abenteuerlustig', 'Freiberuflich', 'Neugierig', 'Suchender', 'Offen für neue Horizonte', 'Überraschend'],
      properties: [
        'Erfrischend',
        'Emotionales Stimulans',
        'Entzündungshemmend',
        'Antioxidativ',
        'Antiseptisch'
      ],
      excess: 'Zu abenteuerlustig (geht ohne Sicherheitsnetz). Leichtsinnig, utopisch.',
      shortage: 'Möchte Dinge tun, aber handelt nicht.'
    },
    12: { // Pomme
      id: 12,
      name: 'Apfelgrün',
      mantra: 'ICH ÖFFNE MICH NACH AUSSEN, ICH PASSE MICH AN',
      symbolism: 'Bringt den ersten Hauch von Frühlingsfrische. Fungiert als echtes Scharnier und lässt die Vision von warmen und tonischen Farben zu neutralen und kalten Farben übergehen. Es verleiht Formbarkeit und Flexibilität.',
      temperament: ['Offen, tolerant', 'Zugänglich, verfügbar', 'Flexibel, geschmeidig', 'Formbar, undiszipliniert'],
      properties: [
        'Sehstimulans',
        'Anti-allergisch, Intoleranz',
        'Schleimlösend',
        'Erweicht Gelenke',
        'Geistige Flexibilität'
      ],
      excess: 'Wird von anderen ausgenutzt. Beeinflussbar. Nachlässig. Unordentlich.',
      shortage: 'Geistige Starrheit, aber auch auf Gelenkebene. Nicht sehr offen. Hat Schwierigkeiten, sich selbst zu hinterfragen.',
      bodyParts: 'Zwerchfell, Sehnen und Bänder, Brustwirbel 6, 7 und 8',
      organs: 'Sehsystem, Gehirnplastizität, Gallenblase'
    },
    13: { // Jaune
      id: 13,
      name: 'Gelb',
      mantra: 'ICH HABE VERTRAUEN IN MICH SELBST, ICH WERDE MIR BEWUSST, DASS ICH EXISTIERE',
      symbolism: 'Die Farbe der Sonne, die Licht auf die Erde bringt. Gelb bringt die größte Klarheit in unsere Vision, Selbstwahrnehmung und Weltsicht. Es ermöglicht uns, uns in unserer Umgebung zu positionieren.',
      temperament: ['Klar, leuchtend', 'Klar, wach', 'Bewusst', 'Nachdenklich, intelligent', 'Individualistisch', 'Analytischer Geist', 'Manager', 'Selbstbewusst'],
      properties: [
        'Intellektuelles Stimulans',
        'Lymphstimulans',
        'Verdauungsstimulans',
        'Magenstimulans',
        'Antidiabetisch'
      ],
      excess: 'Egozentrisch.',
      shortage: 'Ich bin nichts, ich existiere nicht. Schulversagen.',
      bodyParts: 'Bauch, Oberbauch, Brustwirbel 9, 10 und 11',
      organs: 'Verdauungsfunktionen, Magen, Bauchspeicheldrüse',
      chakra: '3. Chakra - Solarplexus-Chakra - Manipûra',
      element: 'Feuer',
      note: 'E'
    },
    14: { // Or
      id: 14,
      name: 'Gold',
      mantra: 'ICH LIEBE DAS LEBEN',
      symbolism: 'Die Farbe der Sonne und der Butterblumen. Unvergleichlicher Magnetismus geht davon aus. Goldgelb erhellt den Tag und wärmt die Herzen. Es bringt die Energie und das Vertrauen, die für das Erwachen des Bewusstseins notwendig sind. Es erhellt das Gesicht, das der Welt gezeigt wird. Innere Weisheit.',
      temperament: ['Strahlend, brilliant', 'Selbstbewusst, sicher', 'Reich, wohlhabend'],
      properties: [
        'Stimulans der Seinsessenz',
        'Vertrauen ins Leben',
        'Zwerchfellfreisetzung',
        'Solarplexus-Stimulans'
      ],
      excess: 'Schlechte Beziehung zu Geld und Vermögen. Person, die den Star spielt. Arrogant.',
      shortage: 'Zu diskret. Introvertiert. Wenig Vertrauen ins Leben.'
    },
    15: { // Orange
      id: 15,
      name: 'Orange',
      mantra: 'ICH FÜHLE - ICH SPÜRE',
      symbolism: 'Liegt zwischen dynamischem Rot und Gold, das von Selbstvertrauen spricht. Verbunden mit guter Laune und Optimismus. Spricht von Sexualität und Sinnlichkeit. Aufregend, spannend und voller Bewegung lädt es zum Feiern, Singen, Tanzen, Trinken und Essen ein.',
      temperament: ['Emotional, sensibel', 'Sinnlich, taktil', 'Optimistisch, enthusiastisch', 'Fröhlich, mag Partys', 'Epikureisch'],
      properties: [
        'Sensorisches Stimulans und aufregend',
        'Hilft bei emotionalem Schock',
        'Antidepressivum',
        'Abschwellend'
      ],
      excess: 'Stress, Unruhe, Druck. Emotional überempfindlich. Spannung, Nervosität, Eile. Don Juan. Liebt die Freuden des Lebens.',
      shortage: 'Allgemeines Vitalitätsproblem. Mangel an Lebensfreude und guter Laune. Depression. Kein Zuhören bei Emotionen. Lähmung, Kälte, Immobilisierung, Stagnation.',
      bodyParts: 'Hypogastrium, Schambein, 12. Brustwirbel, Lendenwirbel 1 und 2',
      organs: 'Nebennieren, sympathisches Nervensystem, Bewegungsfunktionen',
      chakra: '2. Chakra - Sakralchakra - Swadhisthana',
      element: 'Wasser',
      note: 'D'
    },
    16: { // Rouge
      id: 16,
      name: 'Rot',
      mantra: 'ICH LEBE',
      symbolism: 'Die wärmste und physischste Farbe des Lichtspektrums. Repräsentiert alles, was mit Feuer zu tun hat. Es ist der "Kaffee der Farbe". Dynamisch und lebhaft ist Rot willensstark und voller Leben. Deshalb wird Rot mit Blut und Lebensenergie assoziiert.',
      temperament: ['Dynamisch und fleißig', 'Aktiv, sportlich', 'Sanguinisch, energisch', 'Mutig, willensstark', 'Heiß, brennend, lebend'],
      properties: [
        'Physisches Stimulans und energetisierend',
        'Erhöht Energie und stärkt',
        'Erhöht die Körpertemperatur',
        'Beschleunigt die Heilung'
      ],
      excess: 'Körperliche Hyperaktivität. Innere und/oder äußere Wut. Aggressiv - gewalttätig - ungestüm. Wenn Person ruhig ist: internalisierte Wut. Hypertonie.',
      shortage: 'Müde, körperlich erschöpft. Hypoaktivität. Passive Person. Mag Ruhe. Hat Hypotonie. Fehlt Mut zum Anfangen.',
      chakra: '1. Chakra - Wurzelchakra - Mulhadara',
      element: 'Erde',
      note: 'C'
    },
    17: { // Ecarlate
      id: 17,
      name: 'Scharlachrot',
      mantra: 'ICH FÜHLE MICH SICHER',
      symbolism: 'Repräsentiert die materielle und physische Welt. Es ist die Materialisierung unserer Schöpfung. Das beste Beispiel ist die Gebärmutter, die das Kind aufnimmt. Scharlachrot ist die Mutter. Eine sehr beruhigende Farbe, die ein Gefühl von Geborgenheit und Umhüllung vermittelt.',
      temperament: ['Weiblich, mütterlich', 'Nährend, fruchtbar', 'Reichlich, wohlhabend', 'Stabil, verwurzelt', 'Konkret, greifbar', 'Verkörpert, körperlich'],
      properties: [
        'Hautbefeuchtend',
        'Physische Heilung',
        'Stärkt und nährt Gewebe und Muskeln',
        'Bewässert Schleimhäute'
      ],
      excess: 'Geizig. Glucke. Hyperaktivität in weiblichen Geschlechtsorganen: Myome, Zysten.',
      shortage: 'Beziehung zur Mutter (Ablehnung der Mutter?). Sicherheitsprobleme. Sorglosigkeit. Instabil. Verschwenderisch. Mängel, Entbehrung, Armut, Unfruchtbarkeit, körperliche Verletzungen.',
      bodyParts: 'Becken, Gesäß, Beine, Füße, Kreuzbeinwirbel 1 bis 5',
      organs: 'Gebärmutter, Blase, Arterien'
    },
    18: { // Framboise
      id: 18,
      name: 'Himbeere',
      mantra: 'ICH MÖCHTE ERSCHAFFEN',
      symbolism: 'Erscheint direkt nach Magenta. Nachdem man die Absicht hatte zu erschaffen, ist es wichtig, seine Schöpfung zu materialisieren. Diese Farbe repräsentiert den Akt der Schöpfung. Es ist der Wille zu erschaffen und zu spielen. Es vermittelt ein Gefühl kreativer Euphorie.',
      temperament: ['Kindlich, jung', 'Zart, verletzlich', 'Aktiv, Kreativ', 'Fröhlich'],
      properties: [
        'Kreativität',
        'Freude am Erschaffen',
        'Emotionale Heilung',
        'Verjüngend, Anti-Aging',
        'Gewebeweichmachend',
        'Befeuchtet die Haut'
      ],
      excess: 'Handelt ohne nachzudenken.',
      shortage: 'Jemand, der Ideen hat, aber nicht weiß, wie man es macht. Kann nicht den Weg finden, es zu tun, die Werkzeuge zu realisieren. Möchte handeln, kann aber nicht.',
      bodyParts: 'Brustkorb, Brustbein, Brustwirbel 4, 5 und 6',
      organs: 'Herz, Herz-Kreislauf-System, Arterien, Kapillarvenen'
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
