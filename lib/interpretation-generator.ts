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

  // Identify extreme cases
  const extremeExcess = colors.filter(c => c.count === 8);
  const extremeShortage = colors.filter(c => c.count === 0);

  const interpretations = CHROMOBIO_INTERPRETATIONS[lang] || CHROMOBIO_INTERPRETATIONS['fr'];

  // Generate excess sentence
  let excessSentence = '';
  if (excessColors.length > 0) {
    const colorDescriptions: string[] = [];

    excessColors.forEach(color => {
      const interp = interpretations[color.id];
      if (interp) {
        if (color.count === 8) {
          // Extreme excess - all 8 colors remaining
          if (lang === 'fr') {
            colorDescriptions.push(`${color.name} (intensité maximale - ${interp.mantra})`);
          } else if (lang === 'en') {
            colorDescriptions.push(`${color.name} (maximum intensity - ${interp.mantra})`);
          } else {
            colorDescriptions.push(`${color.name} (maximale Intensität - ${interp.mantra})`);
          }
        } else {
          colorDescriptions.push(`${color.name} (${color.count})`);
        }
      }
    });

    if (lang === 'fr') {
      const intro = extremeExcess.length > 0
        ? `Votre profil révèle une attraction très forte pour`
        : `Vous manifestez un attrait marqué pour`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeExcess.length > 0
        ? `indiquant une énergie particulièrement intense dans ${extremeExcess.length > 1 ? 'ces domaines' : 'ce domaine'}. Cette concentration énergétique mérite une attention particulière et peut révéler des enjeux importants de votre parcours actuel.`
        : `suggérant une abondance d'énergie qui pourrait bénéficier d'un rééquilibrage harmonieux.`;
      excessSentence = `${intro} ${colors}, ${meaning}`;
    } else if (lang === 'en') {
      const intro = extremeExcess.length > 0
        ? `Your profile reveals a very strong attraction to`
        : `You show a marked affinity for`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeExcess.length > 0
        ? `indicating particularly intense energy in ${extremeExcess.length > 1 ? 'these areas' : 'this area'}. This energetic concentration deserves special attention and may reveal important aspects of your current journey.`
        : `suggesting an abundance of energy that could benefit from harmonious rebalancing.`;
      excessSentence = `${intro} ${colors}, ${meaning}`;
    } else {
      const intro = extremeExcess.length > 0
        ? `Ihr Profil zeigt eine sehr starke Anziehung zu`
        : `Sie zeigen eine ausgeprägte Affinität für`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeExcess.length > 0
        ? `was auf besonders intensive Energie in ${extremeExcess.length > 1 ? 'diesen Bereichen' : 'diesem Bereich'} hinweist. Diese Energiekonzentration verdient besondere Aufmerksamkeit.`
        : `was auf eine Energiefülle hindeutet, die von harmonischem Ausgleich profitieren könnte.`;
      excessSentence = `${intro} ${colors}, ${meaning}`;
    }
  } else {
    if (lang === 'fr') {
      excessSentence = 'Aucune couleur en excès. Votre profil montre une belle modération dans la distribution énergétique.';
    } else if (lang === 'en') {
      excessSentence = 'No excess colors. Your profile shows beautiful moderation in energy distribution.';
    } else {
      excessSentence = 'Keine überschüssigen Farben. Ihr Profil zeigt eine schöne Mäßigung in der Energieverteilung.';
    }
  }

  // Generate balanced sentence
  let balancedSentence = '';
  if (balancedColors.length > 0) {
    const colorList = balancedColors.map(c => `${c.name} (${c.count})`).join(', ');
    if (lang === 'fr') {
      balancedSentence = `Les couleurs ${colorList} sont en équilibre harmonieux (4-5 occurrences), reflétant une stabilité naturelle et une circulation fluide de l'énergie dans ces aspects de votre être.`;
    } else if (lang === 'en') {
      balancedSentence = `The colors ${colorList} are in harmonious balance (4-5 occurrences), reflecting natural stability and fluid energy flow in these aspects of your being.`;
    } else {
      balancedSentence = `Die Farben ${colorList} befinden sich in harmonischem Gleichgewicht (4-5 Vorkommen) und spiegeln natürliche Stabilität und fließenden Energiefluss in diesen Aspekten Ihres Seins wider.`;
    }
  } else {
    if (lang === 'fr') {
      balancedSentence = 'Aucune couleur parfaitement équilibrée. Votre profil présente des contrastes marqués, invitant à une exploration et un rééquilibrage en profondeur.';
    } else if (lang === 'en') {
      balancedSentence = 'No perfectly balanced colors. Your profile shows marked contrasts, inviting deeper exploration and rebalancing.';
    } else {
      balancedSentence = 'Keine perfekt ausgewogenen Farben. Ihr Profil zeigt deutliche Kontraste, die zu tieferer Erkundung und Ausgleich einladen.';
    }
  }

  // Generate shortage sentence
  let shortageSentence = '';
  if (shortageColors.length > 0) {
    const colorDescriptions: string[] = [];

    shortageColors.forEach(color => {
      const interp = interpretations[color.id];
      if (interp) {
        if (color.count === 0) {
          // Extreme shortage - completely eliminated
          if (lang === 'fr') {
            colorDescriptions.push(`${color.name} (totalement éliminé - ${interp.mantra})`);
          } else if (lang === 'en') {
            colorDescriptions.push(`${color.name} (completely eliminated - ${interp.mantra})`);
          } else {
            colorDescriptions.push(`${color.name} (vollständig eliminiert - ${interp.mantra})`);
          }
        } else {
          colorDescriptions.push(`${color.name} (${color.count})`);
        }
      }
    });

    if (lang === 'fr') {
      const intro = extremeShortage.length > 0
        ? `Vous avez rejeté de manière significative`
        : `Vous manifestez un besoin d'harmonisation avec`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeShortage.length > 0
        ? `Ce rejet total révèle des zones importantes de résistance ou de blocage énergétique. ${extremeShortage.length > 1 ? 'Ces couleurs représentent des aspects' : 'Cette couleur représente un aspect'} de votre être qui ${extremeShortage.length > 1 ? 'demandent' : 'demande'} une attention thérapeutique particulière pour comprendre et transformer ${extremeShortage.length > 1 ? 'ces résistances' : 'cette résistance'}.`
        : `Ces couleurs en déficience indiquent des espaces de croissance potentielle où votre énergie pourrait bénéficier d'un renforcement et d'une harmonisation.`;
      shortageSentence = `${intro} ${colors}. ${meaning}`;
    } else if (lang === 'en') {
      const intro = extremeShortage.length > 0
        ? `You have significantly rejected`
        : `You show a need for harmonization with`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeShortage.length > 0
        ? `This total rejection reveals important areas of resistance or energetic blockage. ${extremeShortage.length > 1 ? 'These colors represent aspects' : 'This color represents an aspect'} of your being that ${extremeShortage.length > 1 ? 'require' : 'requires'} special therapeutic attention to understand and transform ${extremeShortage.length > 1 ? 'these resistances' : 'this resistance'}.`
        : `These deficient colors indicate spaces of potential growth where your energy could benefit from strengthening and harmonization.`;
      shortageSentence = `${intro} ${colors}. ${meaning}`;
    } else {
      const intro = extremeShortage.length > 0
        ? `Sie haben bedeutend abgelehnt`
        : `Sie zeigen einen Harmonisierungsbedarf mit`;
      const colors = colorDescriptions.join(', ');
      const meaning = extremeShortage.length > 0
        ? `Diese vollständige Ablehnung offenbart wichtige Bereiche des Widerstands oder der energetischen Blockade. ${extremeShortage.length > 1 ? 'Diese Farben repräsentieren Aspekte' : 'Diese Farbe repräsentiert einen Aspekt'} Ihres Seins, ${extremeShortage.length > 1 ? 'die' : 'der'} besondere therapeutische Aufmerksamkeit erfordert.`
        : `Diese mangelhaften Farben zeigen Räume potenziellen Wachstums, in denen Ihre Energie von Stärkung und Harmonisierung profitieren könnte.`;
      shortageSentence = `${intro} ${colors}. ${meaning}`;
    }
  } else {
    if (lang === 'fr') {
      shortageSentence = 'Aucune déficience significative détectée. Votre énergie circule de manière fluide et équilibrée dans tous les domaines.';
    } else if (lang === 'en') {
      shortageSentence = 'No significant deficiencies detected. Your energy flows fluidly and balanced in all areas.';
    } else {
      shortageSentence = 'Keine signifikanten Mängel erkannt. Ihre Energie fließt fließend und ausgewogen in allen Bereichen.';
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
  const extremeExcess = colors.filter(c => c.count === 8);
  const extremeShortage = colors.filter(c => c.count === 0);

  let detailed = '';

  if (lang === 'fr') {
    detailed = `## Analyse Approfondie de Votre Profil Chromatique\n\n`;

    // Introduction
    detailed += `Votre test révèle un profil énergétique unique qui reflète votre état émotionnel, physique et spirituel actuel. Chaque couleur porte une vibration spécifique et son intensité dans votre résultat indique des zones d'attention particulières.\n\n`;

    // Extreme cases warning if any
    if (extremeExcess.length > 0 || extremeShortage.length > 0) {
      detailed += `⚠️ **Points d'Attention Majeurs** : Votre profil présente des polarités extrêmes qui méritent une attention thérapeutique approfondie.\n\n`;
    }

    // Excess section
    if (excessColors.length > 0) {
      detailed += `### Énergies en Excès\n\n`;
      excessColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          const isExtreme = color.count === 8;
          detailed += `**${color.name}** (${color.count}/8 couleurs${isExtreme ? ' - INTENSITÉ MAXIMALE' : ''}) - *${interp.mantra}*\n\n`;
          if (isExtreme) {
            detailed += `🔴 **Attention particulière requise** : Vous n'avez éliminé aucune occurrence de cette couleur, révélant une attraction extrême.\n\n`;
          }
          detailed += `${interp.excess}\n\n`;
          detailed += `**Symbolique** : ${interp.symbolism.substring(0, 250)}...\n\n`;
          if (interp.temperament && interp.temperament.length > 0) {
            detailed += `**Tempérament associé** : ${interp.temperament.slice(0, 3).join(', ')}\n\n`;
          }
        }
      });
    }

    // Shortage section
    if (shortageColors.length > 0) {
      detailed += `### Énergies en Déficience\n\n`;
      shortageColors.forEach(color => {
        const interp = interpretations[color.id];
        if (interp) {
          const isExtreme = color.count === 0;
          detailed += `**${color.name}** (${color.count}/8 couleurs${isExtreme ? ' - REJET TOTAL' : ''}) - *${interp.mantra}*\n\n`;
          if (isExtreme) {
            detailed += `🔵 **Zone de blocage important** : Vous avez éliminé toutes les occurrences de cette couleur, indiquant un rejet profond ou une résistance inconsciente.\n\n`;
          }
          detailed += `${interp.shortage}\n\n`;
          if (interp.properties && interp.properties.length > 0) {
            detailed += `**Propriétés thérapeutiques** : ${interp.properties.slice(0, 3).join(', ')}\n\n`;
          }
          if (interp.chakra) {
            detailed += `**Chakra associé** : ${interp.chakra}\n\n`;
          }
        }
      });
    }

    // Recommendations
    detailed += `### Recommandations Personnalisées\n\n`;
    detailed += `Pour harmoniser votre profil énergétique, une séance individuelle permettra de :\n\n`;
    detailed += `- Comprendre les causes profondes de ces déséquilibres${extremeExcess.length > 0 || extremeShortage.length > 0 ? ' et des polarités extrêmes' : ''}\n`;
    detailed += `- Établir un protocole de rééquilibrage personnalisé adapté à votre profil unique\n`;
    detailed += `- Découvrir les pratiques ChromoBio-Énergie spécifiques à vos besoins\n`;
    detailed += `- Explorer ${extremeShortage.length > 0 ? 'les résistances profondes et ' : ''}les outils de transformation\n`;
    detailed += `- Intégrer ces connaissances dans votre quotidien pour un bien-être durable\n\n`;

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
