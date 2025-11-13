import { CHROMOBIO_INTERPRETATIONS } from './chromobio-interpretations';

interface ColorResult {
  id: number;
  name: string;
  count: number;
  status: 'excess' | 'balanced' | 'shortage';
}

/**
 * Generate short interpretation sentences for email/initial display
 */
export function generateShortInterpretation(
  colors: ColorResult[],
  lang: string = 'fr'
): {
  excess: string;
  balanced: string;
  shortage: string;
} {
  const excessColors = colors.filter(c => c.status === 'excess');
  const balancedColors = colors.filter(c => c.status === 'balanced');
  const shortageColors = colors.filter(c => c.status === 'shortage');

  const interpretations = CHROMOBIO_INTERPRETATIONS[lang] || CHROMOBIO_INTERPRETATIONS['fr'];

  // Generate excess sentence
  let excessSentence = '';
  if (excessColors.length > 0) {
    const colorNames = excessColors.map(c => c.name).join(', ');
    const themes: string[] = [];

    excessColors.forEach(color => {
      const interp = interpretations[color.id];
      if (interp) {
        // Extract key theme from excess interpretation
        const firstSentence = interp.excess.split('.')[0];
        if (firstSentence) themes.push(firstSentence.toLowerCase());
      }
    });

    if (lang === 'fr') {
      excessSentence = `Vos couleurs en excès (${colorNames}) révèlent une énergie abondante dans les domaines suivants : ${themes.slice(0, 3).join('; ')}. Cette profusion d'énergie peut être canalisée de manière constructive.`;
    } else if (lang === 'en') {
      excessSentence = `Your excess colors (${colorNames}) reveal abundant energy in the following areas: ${themes.slice(0, 3).join('; ')}. This profusion of energy can be channeled constructively.`;
    } else {
      excessSentence = `Ihre überschüssigen Farben (${colorNames}) zeigen eine reichliche Energie in den folgenden Bereichen: ${themes.slice(0, 3).join('; ')}. Diese Energiefülle kann konstruktiv genutzt werden.`;
    }
  } else {
    if (lang === 'fr') {
      excessSentence = 'Aucune couleur en excès détectée. Votre profil montre une belle modération énergétique.';
    } else if (lang === 'en') {
      excessSentence = 'No excess colors detected. Your profile shows beautiful energetic moderation.';
    } else {
      excessSentence = 'Keine überschüssigen Farben erkannt. Ihr Profil zeigt eine schöne energetische Mäßigung.';
    }
  }

  // Generate balanced sentence
  let balancedSentence = '';
  if (balancedColors.length > 0) {
    const colorNames = balancedColors.map(c => c.name).join(', ');
    if (lang === 'fr') {
      balancedSentence = `Les couleurs ${colorNames} sont en équilibre harmonieux, reflétant une stabilité naturelle dans ces aspects de votre vie.`;
    } else if (lang === 'en') {
      balancedSentence = `The colors ${colorNames} are in harmonious balance, reflecting natural stability in these aspects of your life.`;
    } else {
      balancedSentence = `Die Farben ${colorNames} sind in harmonischem Gleichgewicht und spiegeln natürliche Stabilität in diesen Aspekten Ihres Lebens wider.`;
    }
  } else {
    if (lang === 'fr') {
      balancedSentence = 'Votre profil présente des contrastes marqués, invitant à une exploration approfondie.';
    } else if (lang === 'en') {
      balancedSentence = 'Your profile shows marked contrasts, inviting deeper exploration.';
    } else {
      balancedSentence = 'Ihr Profil zeigt deutliche Kontraste, die zu einer tieferen Erkundung einladen.';
    }
  }

  // Generate shortage sentence
  let shortageSentence = '';
  if (shortageColors.length > 0) {
    const colorNames = shortageColors.map(c => c.name).join(', ');
    const needs: string[] = [];

    shortageColors.forEach(color => {
      const interp = interpretations[color.id];
      if (interp) {
        const firstSentence = interp.shortage.split('.')[0];
        if (firstSentence) needs.push(firstSentence.toLowerCase());
      }
    });

    if (lang === 'fr') {
      shortageSentence = `Les couleurs en déficience (${colorNames}) suggèrent des besoins d'harmonisation : ${needs.slice(0, 3).join('; ')}. Ces espaces offrent des opportunités de croissance personnelle.`;
    } else if (lang === 'en') {
      shortageSentence = `The deficient colors (${colorNames}) suggest harmonization needs: ${needs.slice(0, 3).join('; ')}. These spaces offer opportunities for personal growth.`;
    } else {
      shortageSentence = `Die mangelhaften Farben (${colorNames}) deuten auf Harmonisierungsbedarf hin: ${needs.slice(0, 3).join('; ')}. Diese Bereiche bieten Möglichkeiten für persönliches Wachstum.`;
    }
  } else {
    if (lang === 'fr') {
      shortageSentence = 'Aucune carence significative détectée. Votre énergie circule de manière fluide.';
    } else if (lang === 'en') {
      shortageSentence = 'No significant deficiencies detected. Your energy flows fluidly.';
    } else {
      shortageSentence = 'Keine signifikanten Mängel erkannt. Ihre Energie fließt fließend.';
    }
  }

  return {
    excess: excessSentence,
    balanced: balancedSentence,
    shortage: shortageSentence,
  };
}

/**
 * Generate detailed interpretation for paid sessions
 */
export function generateDetailedInterpretation(
  colors: ColorResult[],
  lang: string = 'fr'
): string {
  const interpretations = CHROMOBIO_INTERPRETATIONS[lang] || CHROMOBIO_INTERPRETATIONS['fr'];
  const excessColors = colors.filter(c => c.status === 'excess');
  const shortageColors = colors.filter(c => c.status === 'shortage');

  let detailed = '';

  if (lang === 'fr') {
    detailed = `## Analyse Approfondie de Votre Profil Chromatique\n\n`;

    // Introduction
    detailed += `Votre test révèle un profil énergétique unique qui reflète votre état émotionnel, physique et spirituel actuel. Chaque couleur porte une vibration spécifique et son intensité dans votre résultat indique des zones d'attention particulières.\n\n`;

    // Excess section
    if (excessColors.length > 0) {
      detailed += `### Énergies en Excès\n\n`;
      excessColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} couleurs) - *${interp.mantra}*\n`;
          detailed += `${interp.excess}\n\n`;
          detailed += `Cette couleur est liée à : ${interp.symbolism.substring(0, 200)}...\n\n`;
        }
      });
    }

    // Shortage section
    if (shortageColors.length > 0) {
      detailed += `### Énergies en Déficience\n\n`;
      shortageColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} couleurs) - *${interp.mantra}*\n`;
          detailed += `${interp.shortage}\n\n`;
          if (interp.properties && interp.properties.length > 0) {
            detailed += `Propriétés thérapeutiques : ${interp.properties.slice(0, 3).join(', ')}.\n\n`;
          }
        }
      });
    }

    // Recommendations
    detailed += `### Recommandations Personnalisées\n\n`;
    detailed += `Pour harmoniser votre profil énergétique, une séance individuelle permettra de :\n`;
    detailed += `- Comprendre les causes profondes de ces déséquilibres\n`;
    detailed += `- Établir un protocole de rééquilibrage personnalisé\n`;
    detailed += `- Découvrir les pratiques et outils adaptés à votre profil\n`;
    detailed += `- Intégrer ces connaissances dans votre quotidien\n\n`;

  } else if (lang === 'en') {
    detailed = `## In-Depth Analysis of Your Chromatic Profile\n\n`;
    detailed += `Your test reveals a unique energetic profile that reflects your current emotional, physical and spiritual state. Each color carries a specific vibration and its intensity in your result indicates areas of particular attention.\n\n`;

    if (excessColors.length > 0) {
      detailed += `### Excess Energies\n\n`;
      excessColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} colors) - *${interp.mantra}*\n`;
          detailed += `${interp.excess}\n\n`;
        }
      });
    }

    if (shortageColors.length > 0) {
      detailed += `### Deficient Energies\n\n`;
      shortageColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} colors) - *${interp.mantra}*\n`;
          detailed += `${interp.shortage}\n\n`;
        }
      });
    }

    detailed += `### Personalized Recommendations\n\n`;
    detailed += `To harmonize your energetic profile, an individual session will allow you to:\n`;
    detailed += `- Understand the deep causes of these imbalances\n`;
    detailed += `- Establish a personalized rebalancing protocol\n`;
    detailed += `- Discover practices and tools adapted to your profile\n`;
    detailed += `- Integrate this knowledge into your daily life\n\n`;

  } else {
    detailed = `## Tiefgehende Analyse Ihres Chromatischen Profils\n\n`;
    detailed += `Ihr Test zeigt ein einzigartiges energetisches Profil, das Ihren aktuellen emotionalen, physischen und spirituellen Zustand widerspiegelt.\n\n`;

    if (excessColors.length > 0) {
      detailed += `### Überschüssige Energien\n\n`;
      excessColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} Farben) - *${interp.mantra}*\n`;
          detailed += `${interp.excess}\n\n`;
        }
      });
    }

    if (shortageColors.length > 0) {
      detailed += `### Mangelhafte Energien\n\n`;
      shortageColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          detailed += `**${color.name}** (${color.count} Farben) - *${interp.mantra}*\n`;
          detailed += `${interp.shortage}\n\n`;
        }
      });
    }

    detailed += `### Personalisierte Empfehlungen\n\n`;
    detailed += `Um Ihr energetisches Profil zu harmonisieren, ermöglicht Ihnen eine Einzelsitzung:\n`;
    detailed += `- Die tiefen Ursachen dieser Ungleichgewichte zu verstehen\n`;
    detailed += `- Ein personalisiertes Ausgleichsprotokoll zu erstellen\n`;
    detailed += `- Praktiken und Werkzeuge zu entdecken, die auf Ihr Profil zugeschnitten sind\n`;
    detailed += `- Dieses Wissen in Ihren Alltag zu integrieren\n\n`;
  }

  return detailed;
}
