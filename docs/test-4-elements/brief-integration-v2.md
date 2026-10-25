# PROMPT POUR CLAUDE CODE — Intégration du Test des 4 Éléments sur coeurdelom.fr

**Destinataire :** Claude Code / CODE (développeur de www.coeurdelom.fr)
**Type :** Brief d'implémentation technique — **v2 (25/10/2026)**
**Référence contenu :** `prompt_test_4_elements_bardon.md` v2 — spec UX, fondement Bardon, 454 mots, 32 textes, règles de détection
**Fichiers livrés avec ce brief :**
- `elements.json` — base de données prête (454 entrées), générée par `build_elements.py`
- `score.js` — module ES de calcul, lecture bardonienne et détection de profil, **testé** (32 clés atteignables, cas limites validés)
- `assets/reference_style_cards_coeurdelom.png` — capture du composant carte de la page d'accueil à reprendre

---

## 🎯 Mission

Implémenter le **Test d'Équilibre des 4 Éléments** comme nouvelle page sur coeurdelom.fr.

Le test doit :
- Être accessible via **le même système d'accès utilisateur que le test chromobioénergétique** existant
- Reproduire le contenu et la logique de `prompt_test_4_elements_bardon.md` v2 — en particulier la **lecture bardonienne** (miroir blanc / miroir noir / défauts prioritaires) et les **trois niveaux d'intensité**
- Reprendre **le composant carte de la page d'accueil** pour présenter les quatre éléments, avec les illustrations aquarelle déjà en ligne

---

## 🔐 Accès Utilisateur

**Reproduire exactement le modèle d'accès du test chromobioénergétique.**

> **Action requise :** inspecter le code existant du test chromobio pour identifier le middleware / guard d'accès et l'appliquer à la nouvelle route.

- Si le test chromobio est protégé par login → même système d'authentification
- Si accessible via token ou lien protégé → même logique de validation
- Si en accès libre → même règle
- La page de garde du test éléments doit être cohérente avec celle du test chromobio (ton, présentation, bouton d'entrée)

---

## 🗺️ Routing & Navigation

```
/test-elements               ← page principale du test
/test-elements/resultats     ← optionnel, URL séparée pour les résultats (permet le partage par lien)
```

- Ajouter dans la même section / menu que le test chromobioénergétique
- Titre : *« Test des 4 Éléments »* ou *« Bilan Élémentaire »*
- Même niveau d'accès hiérarchique que le test chromobio

---

## 📁 Structure de Fichiers

Adapter au framework / CMS de coeurdelom.fr.

```
/test-elements/
├── index.html                (ou composant selon stack)
├── data/
│   └── elements.json         ← FOURNI — ne pas éditer à la main (source : build_elements.py)
├── js/
│   ├── quiz.js               ← grille de tags, intensité par tap, navigation, sessionStorage
│   ├── score.js              ← FOURNI — calcul pondéré, lecture Bardon, détection profil
│   ├── interpretations.js    ← les 32 textes (à copier depuis la spec)
│   └── chart.js              ← radar Chart.js
├── css/
│   └── elements.css
└── assets/
    └── icons/                ← les 4 illustrations aquarelle déjà sur le site (voir Design)
```

---

## 🗃️ Base de Données — elements.json (fourni)

```json
{ "id": 1,   "label": "Actif",  "element": "feu", "type": "qualite" }
{ "id": 253, "label": "Abrupt", "element": "feu", "type": "defaut"  }
```

| Élément | Qualités | Défauts | Total |
|---------|----------|---------|-------|
| feu     | 60 | 55 | 115 |
| eau     | 61 | 50 | 111 |
| air     | 66 | 50 | 116 |
| terre   | 65 | 47 | 112 |
| **Total** | **252** | **202** | **454** |

Les ids 1–252 sont les qualités, 253–454 les défauts. Toute modification des listes passe par `build_elements.py` (régénère le JSON et les tables de la spec, vérifie l'absence de doublons).

---

## 🎨 Design — reprendre le composant carte de la page d'accueil

Référence : `assets/reference_style_cards_coeurdelom.png` (les quatre cartes « Expertise holistique / Techniques ancestrales / Accompagnement personnalisé / Cadre propice à la guérison »).

### Composant carte (à réutiliser tel quel pour les 4 éléments)
- Fond blanc, `border-radius` ~20 px, ombre diffuse `0 8px 30px rgba(0,0,0,0.06)`, fond de page `#F5F5F7`
- Illustration aquarelle centrée en haut, ~80 px, sans cadre ni fond
- Titre en gras, indigo profond `#2C1B5E`, centré
- Texte gris `#555555`, centré, interligne ~1.6
- Grille 4 colonnes desktop → 2 colonnes tablette → 1 colonne mobile, `gap` 24 px

### Illustrations — réutiliser celles déjà en ligne

| Élément | Illustration | Carte d'origine sur la page d'accueil |
|---------|-------------|----------------------------------------|
| 💧 Eau | Spirale d'eau bleue | « Expertise holistique » |
| 🌿 Terre | Feuille verte | « Techniques ancestrales » |
| 🔥 Feu | Flamme orangée-or | « Accompagnement personnalisé » |
| 🌬️ Air | Plumes violettes | « Cadre propice à la guérison » |

> Récupérer les quatre fichiers image depuis le thème actuel et les copier dans `assets/icons/` sous `eau.png`, `terre.png`, `feu.png`, `air.png` (ou SVG si disponibles).

### Palette — alignée sur ces illustrations

```css
:root {
  --feu:        #E67E22;  --feu-light:   #FDEBD0;
  --eau:        #2E86C1;  --eau-light:   #D6EAF8;
  --air:        #8E44AD;  --air-light:   #E8DAEF;
  --terre:      #58A845;  --terre-light: #E1F0D9;
  --titre:      #2C1B5E;
  --texte:      #555555;
  --fond:       #F5F5F7;
  --carte:      #FFFFFF;
}
```

### Tags de sélection — 4 états (intensité 0 → 3)

```css
.tag            { border: 1.5px solid #D5D5DA; color: #666; background: #fff;
                  border-radius: 999px; padding: 10px 16px; transition: all 150ms ease; }
.tag[data-i="1"]{ border-color: var(--c); color: var(--c); }                       /* parfois   */
.tag[data-i="2"]{ border-color: var(--c); color: var(--c); background: var(--c-light); } /* souvent */
.tag[data-i="3"]{ border-color: var(--c); color: #fff; background: var(--c);
                  box-shadow: 0 4px 12px color-mix(in srgb, var(--c) 35%, transparent); } /* très fort */
```

Chaque tag reçoit `style="--c: var(--feu); --c-light: var(--feu-light)"` selon son élément. Sur mobile : `padding: 12px 18px` minimum.

Légende affichée au-dessus de chaque grille : **○ parfois · ◐ souvent · ● très fort** — un tap de plus désélectionne.

---

## ⚙️ Logique Technique

### Étape 1 — Miroir Blanc (quiz.js)

- Charger `elements.json`, filtrer `type === "qualite"`
- Grille de tags `flex-wrap`
- **Tap cyclique** sur chaque tag : 0 → 1 → 2 → 3 → 0 (`data-i`)
- **Aucune limite** de sélection
- Stocker dans `sessionStorage["qualites"]` : `[{ "id": 12, "intensite": 2 }, …]`

### Étape 2 — Miroir Noir (quiz.js)

- Même mécanique, filtrer `type === "defaut"`
- Stocker dans `sessionStorage["defauts"]`

### Navigation

- `Suivant` → étape suivante ; `Retour` → étape précédente sans perte
- Garde avant résultats : si `qualites` **ou** `defauts` est vide → message *« Cochez au moins un mot dans chaque miroir pour que le calcul soit possible »* et retour à l'étape vide. (Nécessité de calcul, pas une limite : un seul mot suffit.)
- Barre de progression (*Étape 1 / 2*)

### Calcul, lecture Bardon et profil — `score.js` (fourni)

```javascript
import { evaluate } from './score.js';

const db   = await fetch('data/elements.json').then(r => r.json());
const qual = JSON.parse(sessionStorage.getItem('qualites') || '[]');
const def  = JSON.parse(sessionStorage.getItem('defauts')  || '[]');

const { scores, ratioOmbre, profil, bardon } = evaluate(qual, def, db);
```

Ce que renvoie `evaluate()` :

```javascript
scores = {
  feu:   { force: 42.1, ombre: 18.0, equilibre: 24.1, nbQual: 9, nbDef: 3 },
  eau:   { … }, air: { … }, terre: { … }
}                       // force et ombre somment chacune à 100 sur les 4 éléments
ratioOmbre = 0.31       // part des défauts dans le total pondéré (0,5 = équilibre)
profil = 'maitrise-feu' // une des 32 clés, ou 'incomplet'
bardon = {
  dominantBlanc: 'feu',          // null si aucun élément ne prédomine
  dominantNoir:  'eau',          // null si aucun élément ne prédomine
  memeElement:   false,
  defautsPrioritaires: ['Angoissé', 'Dépendance affective'],   // intensité 3 dans dominantNoir
  qualitesACultiver:   ['À l\'écoute', 'Accueillant', …]       // qualités du même élément
}
```

Pondération : intensité 1 → poids 1, 2 → 2, 3 → 3 (les trois groupes du miroir de Bardon).

Les règles de détection (P1 → P6) sont documentées dans la spec, section *« Détection du profil »*. Le module est testé : les 32 clés sont atteignables, et les cas limites (sélection vide, deux éléments vides, ombre concentrée, égalités) sont validés.

### Textes d'interprétation — `interpretations.js`

Objet indexé par les **32 clés** exactement comme `detectProfile()` les renvoie. Textes à copier depuis la spec v2, section *« TEXTES D'INTERPRÉTATION »* (chaque titre y porte sa clé).

```javascript
export const INTERPRETATIONS = {
  // Simples maîtrisés (4)
  'maitrise-feu':   { titre: '🔥 Feu maîtrisé',    couleur: 'var(--feu)',   texte: '…' },
  'maitrise-eau':   { titre: '💧 Eau maîtrisée',   couleur: 'var(--eau)',   texte: '…' },
  'maitrise-air':   { titre: '🌬️ Air maîtrisé',   couleur: 'var(--air)',   texte: '…' },
  'maitrise-terre': { titre: '🌿 Terre maîtrisée', couleur: 'var(--terre)', texte: '…' },
  // Simples puissants non maîtrisés (4) — nouveaux en v2
  'puissant-feu': …, 'puissant-eau': …, 'puissant-air': …, 'puissant-terre': …,
  // Simples déséquilibrés (4)
  'desequilibre-feu': …, 'desequilibre-eau': …, 'desequilibre-air': …, 'desequilibre-terre': …,
  // Absents (4)
  'absent-feu': …, 'absent-eau': …, 'absent-air': …, 'absent-terre': …,
  // Bi-élémentaires (6) — ordre canonique feu, eau, air, terre
  'bi-feu-eau': { titre: '🔥💧 Le Volcan et la Source', couleur: '#8B3A5C', texte: '…' },
  'bi-feu-air': { titre: '🔥🌬️ La Flamme et le Vent',  couleur: '#B86B3A', texte: '…' },
  'bi-feu-terre': { titre: '🔥🌿 Le Forgeron',          couleur: '#9A7A2E', texte: '…' },
  'bi-eau-air': { titre: '💧🌬️ Le Poète',              couleur: '#5E63B6', texte: '…' },
  'bi-eau-terre': { titre: '💧🌿 La Source et le Rocher', couleur: '#3A8A7A', texte: '…' },
  'bi-air-terre': { titre: '🌬️🌿 L\'Architecte',       couleur: '#6E7A4A', texte: '…' },
  // Tri-élémentaires (4)
  'tri-sans-terre': …, 'tri-sans-air': …, 'tri-sans-eau': …, 'tri-sans-feu': …,
  // Spéciaux (6)
  'equilibre-parfait':    { titre: '⚖️ Équilibre parfait',    couleur: '#5D4E8C', texte: '…' },
  'desequilibre-total':   { titre: '🌑 Déséquilibre total',   couleur: '#2C2C2C', texte: '…' },
  'qualites-abondantes':  { titre: '✨ Qualités abondantes',  couleur: '#8C6D1F', texte: '…' },
  'opposition-feu-eau':   { titre: '🔥💧 Opposition Feu / Eau',    couleur: '#6B3A5C', texte: '…' },
  'opposition-air-terre': { titre: '🌬️🌿 Opposition Air / Terre', couleur: '#4A6B3A', texte: '…' },
  'initiant-sincere':     { titre: '🌟 Initiant sincère',      couleur: '#8C6D1F', texte: '…' },
};
```

> Test de cohérence à ajouter : `Object.keys(INTERPRETATIONS).length === 32` et chaque clé renvoyée par `detectProfile()` existe dans l'objet.

---

## 📊 Page de Résultats — ordre d'affichage

1. **Lecture selon Bardon** (bloc principal, carte blanche, en tête)
   - *Votre Miroir Blanc est dominé par* **[Élément]** — votre ressource, la base de votre tempérament
   - *Votre Miroir Noir est dominé par* **[Élément]** — votre chantier prioritaire
   - Si `memeElement` : *« Votre tempérament de base est [E], dans ses forces comme dans ses excès »*
   - Si `dominantBlanc` ou `dominantNoir` est `null` : *« Aucun élément ne prédomine dans ce miroir »*
   - *Défauts à travailler en premier* : `bardon.defautsPrioritaires` (tags en couleur de l'élément, intensité 3)
   - *Qualités à cultiver en regard* : `bardon.qualitesACultiver` (3 à 6 tags, même élément — transmutation)
2. **Radar** (Chart.js) — Force et Ombre
3. **Tableau des scores** — Force % · Ombre % · Équilibre, une ligne par élément, pastille couleur
4. **Profil** — titre + texte de `INTERPRETATIONS[profil]`, barre latérale couleur
5. **Actions** — `Télécharger mon profil` (html2canvas → PNG, ou jsPDF) · `Recommencer` (vide `sessionStorage`) · `Partager` (optionnel, scores encodés en URL)

### Radar Chart.js

```javascript
const radarConfig = {
  type: 'radar',
  data: {
    labels: ['🔥 Feu', '💧 Eau', '🌬️ Air', '🌿 Terre'],
    datasets: [
      { label: 'Force (qualités)',
        data: ['feu','eau','air','terre'].map(e => scores[e].force),
        backgroundColor: 'rgba(44, 27, 94, 0.12)', borderColor: '#2C1B5E', borderWidth: 2, pointRadius: 4 },
      { label: 'Ombre (défauts)',
        data: ['feu','eau','air','terre'].map(e => scores[e].ombre),
        backgroundColor: 'rgba(120, 120, 120, 0.08)', borderColor: '#888', borderWidth: 1.5,
        borderDash: [5, 5], pointRadius: 3 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { min: 0, max: 100, ticks: { stepSize: 25, display: false },
                   grid: { color: 'rgba(0,0,0,0.08)' },
                   pointLabels: { font: { size: 14 }, color: '#2C1B5E' } } },
    plugins: { legend: { position: 'bottom' } }
  }
};
```

Conteneur : `height: 320px` ; `maintainAspectRatio: false`.

---

## 💾 Stockage & RGPD

- Aucune donnée côté serveur ; `sessionStorage` uniquement (vidé à la fermeture de l'onglet)
- Partage optionnel : scores + profil encodés en base64 dans `?r=` — jamais les mots cochés
- Aucun cookie de tracking ajouté par ce test

```javascript
const payload = btoa(JSON.stringify({ s: scores, p: profil, b: bardon }));
const shareUrl = `${location.origin}/test-elements/resultats?r=${payload}`;
```

---

## 📱 Responsive

- Mobile-first ; valider iOS + Android
- Cartes éléments : 4 → 2 → 1 colonnes
- Grille de tags : `display: flex; flex-wrap: wrap; gap: 8px;`
- Radar : conteneur `height: 320px`, canvas `responsive: true`
- Animations : `transform: scale(1.04)` + `transition: 150ms ease` sur changement d'intensité

---

## ✅ Checklist de Livraison

- [ ] Route `/test-elements` créée et protégée (même accès que le chromobiotest)
- [ ] Entrée dans la navigation, cohérente avec le test chromobio
- [ ] `elements.json` fourni copié tel quel (454 entrées)
- [ ] Quatre cartes éléments reprenant le composant carte de la page d'accueil, avec les illustrations existantes
- [ ] Palette CSS alignée (Feu orangé-or, Eau bleu, Air violet, Terre vert, titres indigo)
- [ ] Étape 1 (Qualités) : tap cyclique 0→1→2→3→0, 4 états visuels, légende, sélection illimitée
- [ ] Étape 2 (Défauts) : même comportement
- [ ] Garde : au moins un mot par miroir avant calcul
- [ ] `score.js` fourni intégré sans modification ; `evaluate()` appelé avec `[{id, intensite}]`
- [ ] `interpretations.js` : 32 clés, test de cohérence avec `detectProfile()`
- [ ] Résultats : bloc « Lecture selon Bardon » en tête (dominant blanc / noir / défauts prioritaires / qualités à cultiver, cas `null` géré)
- [ ] Radar + tableau des scores + texte de profil
- [ ] Export PNG/PDF, `Recommencer`, partage URL optionnel
- [ ] RGPD : `sessionStorage` uniquement
- [ ] Validation mobile iOS + Android

---

## 🔗 Références

| Ressource | Emplacement |
|-----------|-------------|
| Spec UX, fondement Bardon, listes, règles, 32 textes | `prompt_test_4_elements_bardon.md` v2 |
| Base de données prête | `elements.json` (+ `build_elements.py`) |
| Module de calcul testé | `score.js` |
| Composant carte de référence | `assets/reference_style_cards_coeurdelom.png` (page d'accueil coeurdelom.fr) |
| Modèle d'accès utilisateur | Test chromobioénergétique existant |
| Source ésotérique | Franz Bardon, *Le Chemin de la Véritable Initiation Magique*, Degré I |

---

*Brief d'implémentation — Yan Heydlauf / coeurdelom.fr — v2.0*
