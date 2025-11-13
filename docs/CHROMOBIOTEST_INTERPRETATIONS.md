# ChromobioTest - Color Interpretations Guide

## Overview

The ChromobioTest uses chromobiology color theory to provide insights into a person's energetic and emotional state. After completing the test, the remaining colors (those not eliminated) reveal areas where the person may have excess or shortage of certain energies.

## Interpretation Logic

The interpretation is based on the number of remaining colors for each of the 18 chromobiology colors:

- **EXCESS (En excès)**: More than 5 remaining colors → Indicates an overabundance of that color's energy
- **BALANCED (Équilibré)**: 4 to 5 remaining colors → Healthy balance
- **SHORTAGE (En déficience)**: Less than 4 remaining colors → Indicates a deficiency or need for that color's energy

## The 18 Chromobiology Colors

### 1. Magenta (8ème chakra - étoile de l'âme)
**Mantra**: "JE SUIS UN, JE CONÇOIS, J'AIME"
**Theme**: Universal love, affection, emotional bonding
- **Excess**: Emotional dependency, abandonment feelings, addiction (food, substances, medications)
- **Shortage**: Emotional rejection, affective trauma (possibly from relationship breakup)

### 2. Pourpre
**Mantra**: "JE MÉDITE ET JE TRANSCENDE"
**Theme**: Spirituality, mystery, transcendence
- **Excess**: Religious extremism, excessive mysticism, medium abilities
- **Shortage**: Atheism, loss of spiritual bearings

### 3. Violet (7ème CHAKRA)
**Mantra**: "J'AI LA FOI, J'EXPÉRIMENTE L'UNITÉ, JE SAIS"
**Theme**: Leadership, structure, spiritual guidance
- **Excess**: Authoritarian, judgmental, too rigid, over-structured
- **Shortage**: Dislikes rules/authority, issues with father figure, rebellion

### 4. Bleu Roi (6ème Chakra - 3ème œil)
**Mantra**: "JE ME TRANSFORME"
**Theme**: Transformation, community, depth, integration
- **Excess**: Hypersomnia, hypnotic state
- **Shortage**: Insomnia, disconnection

### 5. Indigo
**Mantra**: "JE SUIS EN PAIX"
**Theme**: Peace, serenity, intuition, extrasensory abilities
- **Excess**: Not grounded, lives in imaginary world, mentally/physically slow
- **Shortage**: Lack of concentration, lack of intuition, disconnected from universal library

### 6. Bleu
**Mantra**: "JE SUIS EN PAIX"
**Theme**: Inner peace, calm communication, dreams
- **Excess**: Too dreamy, disconnected from reality
- **Shortage**: Difficulty finding inner peace, mental agitation

### 7. Cyan (5ème CHAKRA - Chakra de la gorge)
**Mantra**: "JE COMMUNIQUE"
**Theme**: Communication, expression, freshness
- **Excess**: Logorrhea (talks non-stop), verbal diarrhea
- **Shortage**: Phlegmatic, lacks frankness

### 8. Bleu Turquoise
**Mantra**: "JE CRÉE ET JE PARTAGE"
**Theme**: Creativity for others, sharing, networking
- **Excess**: Too altruistic, can be exploited by others
- **Shortage**: Doesn't like sharing ideas

### 9. Vert Turquoise (Chakra Turquoise: Ananda Khanda)
**Mantra**: "JE CRÉE QUELQUE CHOSE D'ORIGINAL"
**Theme**: Individual creativity, originality, purification
- **Excess**: Gets carried away by trends, yes-person (last speaker is always right)
- **Shortage**: Doesn't like change

### 10. Vert (Chakra du Cœur)
**Mantra**: "J'OUVRE MON CŒUR - JE PARDONNE - COMPASSION"
**Theme**: Balance, independence, nature, neutrality
- **Excess**: Too independent, hermit, marginal
- **Shortage**: Dependency on a person, object, or situation

### 11. Citron (Vert Citron)
**Mantra**: "JE DÉCOUVRE"
**Theme**: Adventure, discovery, curiosity, exploration
- **Excess**: Too adventurous (takes risks without safety net), reckless, utopian
- **Shortage**: Wants to do things but doesn't take action

### 12. Pomme (Vert Pomme)
**Mantra**: "JE M'OUVRE À L'EXTÉRIEUR, JE M'ADAPTE"
**Theme**: Openness, flexibility, tolerance, adaptation
- **Excess**: Gets taken advantage of, influenceable, lax, messy
- **Shortage**: Mental rigidity, joint stiffness, not open, difficulty questioning oneself

### 13. Jaune (3ème chakra - plexus solaire)
**Mantra**: "J'AI CONFIANCE EN MOI, JE PRENDS CONSCIENCE QUE J'EXISTE"
**Theme**: Self-confidence, consciousness, clarity, intelligence
- **Excess**: Egocentric
- **Shortage**: "I am nothing, I don't exist", academic failure

### 14. Or
**Mantra**: "J'AIME LA VIE"
**Theme**: Radiance, confidence in life, inner wisdom
- **Excess**: Bad relationship with money/fortune, show-off, arrogant
- **Shortage**: Too discreet, introverted, little confidence in life

### 15. Orange (2ème chakra - Chakra Sacré)
**Mantra**: "JE SENS - JE RESSENS"
**Theme**: Emotions, sensuality, joy, celebration, optimism
- **Excess**: Stress, agitation, hypersensitive emotionally, Don Juan, loves pleasures
- **Shortage**: Lack of vitality, lack of joy, depression, emotional numbness, paralysis, coldness

### 16. Rouge (1er Chakra - racine)
**Mantra**: "JE VIS"
**Theme**: Life force, energy, action, survival, courage
- **Excess**: Physical hyperactivity, anger (internal/external), aggressive, violent, hypertension
- **Shortage**: Tired, physically exhausted, passive, hypotension, lacks courage to start

### 17. Écarlate
**Mantra**: "JE ME SENS EN SÉCURITÉ"
**Theme**: Security, motherhood, materialization, nourishment
- **Excess**: Stingy, overprotective mother, gynecological issues (fibroids, cysts)
- **Shortage**: Mother issues (rejection?), insecurity, carelessness, unstable, spendthrift, infertility

### 18. Framboise
**Mantra**: "J'AI ENVIE DE CRÉER"
**Theme**: Creative act, joy of creating, playfulness
- **Excess**: Acts without thinking
- **Shortage**: Has ideas but doesn't know how to execute, can't find the tools, wants to act but can't

---

## Data Structure

All interpretation data is stored in `/lib/chromobio-interpretations.ts`

### Structure per Color:
```typescript
{
  id: number;           // Color ID (1-18)
  name: string;         // Color name
  mantra: string;       // Affirmation/mantra
  symbolism: string;    // Symbolic meaning
  temperament: string[]; // Personality traits
  properties: string[];  // Therapeutic properties
  excess: string;       // Interpretation for >5 remaining
  shortage: string;     // Interpretation for <4 remaining
  bodyParts?: string;   // Associated body parts
  organs?: string;      // Associated organs
  chakra?: string;      // Associated chakra
  element?: string;     // Element (Earth, Water, Fire, Air, Ether)
  note?: string;        // Musical note
}
```

### Helper Function:
```typescript
getInterpretation(colorId: number, count: number, lang: string): {
  status: 'excess' | 'balanced' | 'shortage';
  message: string;
}
```

---

## Dictionary Keys

Translation keys are available in `lib/dictionaries/{fr,en,de}.json` under `chromobiotest.interpretation`:

- `excess`: Label for excess state
- `shortage`: Label for shortage state
- `balanced`: Label for balanced state
- `excessNote`: Explanation of excess (>5 colors)
- `shortageNote`: Explanation of shortage (<4 colors)
- `balancedNote`: Explanation of balanced (4-5 colors)
- `colorMeaning`: Label for "Meaning" section
- `yourProfile`: Label for "Your chromatic profile"

---

## Future Implementation

To add interpretations to the ChromobioTest results page:

1. Import the interpretation data:
```typescript
import { CHROMOBIO_INTERPRETATIONS, getInterpretation } from '@/lib/chromobio-interpretations';
```

2. Use the helper function in the results display:
```typescript
const interpretation = getInterpretation(color.id, count, lang);
```

3. Display based on status:
```typescript
{interpretation.status !== 'balanced' && (
  <div className={interpretation.status === 'excess' ? 'text-orange-400' : 'text-blue-400'}>
    {interpretation.message}
  </div>
)}
```

4. Optional: Add detailed color information cards showing:
   - Color mantra
   - Symbolism
   - Temperament traits
   - Properties
   - Associated chakra/elements

---

## Additional Colors (Not Currently in Test)

The following lighter colors are documented but not yet implemented in the test:
- Rose (Pink)
- Bleu Clair (Light Blue)
- Jaune Clair (Light Yellow)
- Corail Clair (Light Coral)
- Turquoise Clair (Light Turquoise)
- Vert Clair (Light Green)
- Violet Clair (Light Violet)

These could be added in future expansions of the test (expanding to 27 colors total).

---

## Source Documents

The interpretations are based on:
- **Evaluation_Chromobio_Test_1.pdf**: Colors Bleu Turquoise through Violet Clair
- **Evaluation_Chromobio_Test_2.pdf**: Colors Magenta through Vert Turquoise

All interpretations follow the chromobiology teachings of the International School of Chromobio-Energy.
