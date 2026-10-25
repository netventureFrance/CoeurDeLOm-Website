# PROMPT POUR CLAUDE CODE — Intégration du Test des 4 Éléments sur coeurdelom.fr

**Destinataire :** Claude Code / CODE (développeur de www.coeurdelom.fr)
**Type :** Brief d'implémentation technique
**Référence contenu :** `prompt_test_4_elements_bardon.md` — spec UX complète + 447 mots + 35 textes d'interprétation + algorithme JS

---

## 🎯 Mission

Implémenter le **Test d'Équilibre des 4 Éléments** comme nouvelle page sur coeurdelom.fr.

Le test doit :
- Être accessible via **le même système d'accès utilisateur que le test chromobioénergétique** existant
- Reproduire exactement le contenu et la logique décrits dans `prompt_test_4_elements_bardon.md`
- S'intégrer dans l'esthétique et l'architecture existantes du site

---

## 🔐 Accès Utilisateur

**Reproduire exactement le modèle d'accès du test chromobioénergétique.**

> **Action requise :** Inspecter le code existant du test chromobio pour identifier le middleware / guard d'accès et l'appliquer à la nouvelle route.

Points à respecter :
- Si le test chromobio est protégé par login → même système d'authentification
- Si accessible via token ou lien protégé → même logique de validation
- Si en accès libre → même règle
- La page de garde du test éléments doit être cohérente avec celle du test chromobio (ton, présentation, bouton d'entrée)

---

## 🗺️ Routing & Navigation

### Nouvelle route
```
/test-elements               ← page principale du test
/test-elements/resultats     ← optionnel, URL séparée pour les résultats
```

### Intégration dans la navigation du site
- Ajouter dans la même section / menu que le test chromobioénergétique
- Titre : *"Test des 4 Éléments"* ou *"Bilan Élémentaire"*
- Même niveau d'accès hiérarchique que le test chromobio

---

## 📁 Structure de Fichiers

Adapter au framework / CMS de coeurdelom.fr (WordPress, Next.js, custom, etc.).

```
/test-elements/
├── index.html              (ou composant selon stack)
├── data/
│   └── elements.json       ← base de données des 447 mots
├── js/
│   ├── quiz.js             ← navigation étapes + sélection tags
│   ├── score.js            ← calcul des scores + détection profil
│   └── chart.js            ← radar Chart.js / D3
├── css/
│   └── elements.css        ← styles spécifiques + couleurs éléments
└── assets/
    └── icons/              ← SVG 🔥 💧 🌬️ 🌿
```

---

## 🗃️ Base de Données — elements.json

Générer ce fichier JSON à partir des listes dans `prompt_test_4_elements_bardon.md`.

### Format de chaque entrée
```json
{ "id": 1, "label": "Actif", "element": "feu", "type": "qualite" }
{ "id": 61, "label": "Abrupt", "element": "feu", "type": "defaut" }
```

### Répartition (source : `prompt_test_4_elements_bardon.md`)

| Élément | Qualités | Défauts | Total |
|---------|----------|---------|-------|
| feu     | 60       | 55      | 115   |
| eau     | 60       | 50      | 110   |
| air     | 65       | 47      | 112   |
| terre   | 65       | 45      | 110   |
| **Total** | **250** | **197** | **447** |

Ce fichier est la seule source de vérité pour le quiz. Toute modification des listes passe par là.

---

## ⚙️ Logique Technique

### Couleurs des éléments

```javascript
const ELEMENT_COLORS = {
  feu:   '#C0392B',
  eau:   '#2980B9',
  air:   '#D4AC0D',
  terre: '#27AE60'
};
```

---

### Étape 1 — Miroir Blanc (quiz.js)

- Charger `elements.json`, filtrer `type === "qualite"`
- Afficher en grille de tags cliquables (`flex-wrap`)
- Sélection multiple, **aucune limite**
- Tag sélectionné : prend la couleur de son élément (`ELEMENT_COLORS[elem]`)
- Stocker les IDs sélectionnés dans `sessionStorage` sous `"qualites_selectionnees"`

### Étape 2 — Miroir Noir (quiz.js)

- Même logique, filtrer `type === "defaut"`
- Stocker dans `sessionStorage` sous `"defauts_selectionnes"`

### Navigation entre étapes

- Bouton `Suivant` → passe à l'étape suivante (aucun minimum requis)
- Bouton `Retour` → revient à l'étape précédente sans perdre les sélections
- Barre de progression visible (ex. "Étape 1 / 2")

---

### Calcul des scores (score.js)

```javascript
function computeScores(selectedQualIds, selectedDefIds, database) {
  const elements = ['feu', 'eau', 'air', 'terre'];
  const scores = {};
  const totalQual = selectedQualIds.length;
  const totalDef  = selectedDefIds.length;

  elements.forEach(elem => {
    const qualCount = selectedQualIds.filter(id =>
      database.find(e => e.id === id)?.element === elem
    ).length;
    const defCount = selectedDefIds.filter(id =>
      database.find(e => e.id === id)?.element === elem
    ).length;

    scores[elem] = {
      force:   totalQual > 0 ? (qualCount / totalQual) * 100 : 0,
      ombre:   totalDef  > 0 ? (defCount  / totalDef)  * 100 : 0,
      equilibre: 0
    };
    scores[elem].equilibre = scores[elem].force - scores[elem].ombre;
  });

  return scores;
}
```

---

### Algorithme de détection du profil (score.js)

Implémenter les 10 priorités décrites dans `prompt_test_4_elements_bardon.md`, section *"Logique de détection du profil"*.

```javascript
function detectProfile(scores) {
  const s = scores;
  const forces = ['feu','eau','air','terre'].map(e => s[e].force);
  const ombres = ['feu','eau','air','terre'].map(e => s[e].ombre);

  // P1 — Équilibre parfait
  if (Math.max(...forces) - Math.min(...forces) < 10) return 'equilibre-parfait';

  // P2 — Déséquilibre total
  if (ombres.every(o => o > 50)) return 'desequilibre-total';

  // P3 — Élément absent
  for (const elem of ['feu','eau','air','terre']) {
    if (s[elem].force + s[elem].ombre < 5) return `absent-${elem}`;
  }

  // P4 — Opposition Feu / Eau
  if (s.feu.ombre > 40 && s.eau.ombre > 40) return 'opposition-feu-eau';

  // P5 — Opposition Air / Terre
  if (s.air.ombre > 40 && s.terre.ombre > 40) return 'opposition-air-terre';

  // P6 — Tri-élémentaire (un élément manquant)
  const low = ['feu','eau','air','terre'].filter(e => s[e].force + s[e].ombre < 8);
  if (low.length === 1) return `tri-sans-${low[0]}`;

  // P7 — Bi-élémentaire
  const high = ['feu','eau','air','terre'].filter(e => s[e].force > 35);
  if (high.length === 2) return `bi-${high[0]}-${high[1]}`;

  // P8 — Élément simple maîtrisé
  const sorted = ['feu','eau','air','terre'].sort((a,b) => s[b].force - s[a].force);
  if (s[sorted[0]].ombre < 25) return `maitrise-${sorted[0]}`;

  // P9 — Élément simple déséquilibré
  const sortedO = ['feu','eau','air','terre'].sort((a,b) => s[b].ombre - s[a].ombre);
  if (s[sortedO[0]].ombre > s[sortedO[0]].force) return `desequilibre-${sortedO[0]}`;

  // P10 — Initiant sincère (profil par défaut)
  return 'initiant-sincere';
}
```

---

### Table de correspondance profil → texte

Créer un objet `INTERPRETATIONS` (dans `score.js` ou fichier séparé) couvrant les **35 clés de profil**.

Les textes complets se trouvent dans `prompt_test_4_elements_bardon.md`, section *"TEXTES D'INTERPRÉTATION"*.

```javascript
const INTERPRETATIONS = {
  // — Éléments simples maîtrisés (4)
  'maitrise-feu':   { titre: '🔥 Feu maîtrisé',   couleur: '#C0392B', texte: '...' },
  'maitrise-eau':   { titre: '💧 Eau maîtrisée',   couleur: '#2980B9', texte: '...' },
  'maitrise-air':   { titre: '🌬️ Air maîtrisé',   couleur: '#D4AC0D', texte: '...' },
  'maitrise-terre': { titre: '🌿 Terre maîtrisée', couleur: '#27AE60', texte: '...' },

  // — Éléments simples déséquilibrés (4)
  'desequilibre-feu':   { titre: '🔥 Feu déséquilibré',   couleur: '#C0392B', texte: '...' },
  'desequilibre-eau':   { titre: '💧 Eau déséquilibrée',  couleur: '#2980B9', texte: '...' },
  'desequilibre-air':   { titre: '🌬️ Air déséquilibré',  couleur: '#D4AC0D', texte: '...' },
  'desequilibre-terre': { titre: '🌿 Terre déséquilibrée',couleur: '#27AE60', texte: '...' },

  // — Éléments absents (4)
  'absent-feu':   { titre: '🔥 Feu absent',   couleur: '#C0392B', texte: '...' },
  'absent-eau':   { titre: '💧 Eau absente',   couleur: '#2980B9', texte: '...' },
  'absent-air':   { titre: '🌬️ Air absent',   couleur: '#D4AC0D', texte: '...' },
  'absent-terre': { titre: '🌿 Terre absente', couleur: '#27AE60', texte: '...' },

  // — Bi-élémentaires (6)
  'bi-feu-eau':   { titre: '🔥💧 Le Volcan et la Source', couleur: '#8B3A5C', texte: '...' },
  'bi-feu-air':   { titre: '🔥🌬️ La Flamme et le Vent',  couleur: '#B87333', texte: '...' },
  'bi-feu-terre': { titre: '🔥🌿 Le Forgeron',            couleur: '#8B6914', texte: '...' },
  'bi-eau-air':   { titre: '💧🌬️ Le Poète',              couleur: '#3A7BA8', texte: '...' },
  'bi-eau-terre': { titre: '💧🌿 La Source et le Rocher', couleur: '#2E7D5B', texte: '...' },
  'bi-air-terre': { titre: '🌬️🌿 L\'Architecte',         couleur: '#5B7A3A', texte: '...' },

  // — Tri-élémentaires (4)
  'tri-sans-terre': { titre: '🔥💧🌬️ Il manque la Terre', couleur: '#6B5B95', texte: '...' },
  'tri-sans-air':   { titre: '🔥💧🌿 Il manque l\'Air',   couleur: '#7A5C3A', texte: '...' },
  'tri-sans-eau':   { titre: '🔥🌬️🌿 Il manque l\'Eau',  couleur: '#8B7355', texte: '...' },
  'tri-sans-feu':   { titre: '💧🌬️🌿 Il manque le Feu',  couleur: '#3A6B7A', texte: '...' },

  // — Profils spéciaux (6)
  'equilibre-parfait':    { titre: '⚖️ Équilibre parfait',         couleur: '#5D4E8C', texte: '...' },
  'desequilibre-total':   { titre: '🌑 Déséquilibre total',        couleur: '#2C2C2C', texte: '...' },
  'qualites-abondantes':  { titre: '✨ Qualités abondantes',       couleur: '#8C6D1F', texte: '...' },
  'opposition-feu-eau':   { titre: '🔥💧 Opposition Feu / Eau',    couleur: '#6B3A5C', texte: '...' },
  'opposition-air-terre': { titre: '🌬️🌿 Opposition Air / Terre', couleur: '#4A6B3A', texte: '...' },
  'initiant-sincere':     { titre: '🌟 Initiant sincère',          couleur: '#8C6D1F', texte: '...' },
};
```

> Copier les textes complets depuis la section `## 📝 TEXTES D'INTERPRÉTATION` du fichier `prompt_test_4_elements_bardon.md`.

---

## 📊 Page de Résultats

### Composants à afficher (dans l'ordre)

1. **En-tête dynamique** — titre du profil détecté + couleur dominante
2. **Graphique radar** (Chart.js) — voir config ci-dessous
3. **Tableau des scores** — Force % | Ombre % | Équilibre pour chaque élément
4. **Texte d'interprétation** — bloc stylisé avec barre colorée latérale (couleur de l'élément)
5. **Boutons d'action** :
   - `Télécharger mon profil` → export image via `html2canvas` (ou PDF via `jsPDF`)
   - `Recommencer` → vide `sessionStorage` et relance le quiz
   - `Partager` *(optionnel)* → encode les scores en base64 dans l'URL

### Configuration du radar Chart.js

```javascript
const radarConfig = {
  type: 'radar',
  data: {
    labels: ['🔥 Feu', '💧 Eau', '🌬️ Air', '🌿 Terre'],
    datasets: [
      {
        label: 'Force (Qualités)',
        data: [scores.feu.force, scores.eau.force, scores.air.force, scores.terre.force],
        backgroundColor: 'rgba(212, 172, 13, 0.15)',
        borderColor: '#D4AC0D',
        borderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Ombre (Défauts)',
        data: [scores.feu.ombre, scores.eau.ombre, scores.air.ombre, scores.terre.ombre],
        backgroundColor: 'rgba(100, 100, 100, 0.08)',
        borderColor: '#888',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, display: false },
        grid: { color: 'rgba(0,0,0,0.08)' }
      }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  }
};
```

---

## 💾 Stockage & RGPD

- **Aucune donnée personnelle stockée côté serveur**
- Résultats en `sessionStorage` uniquement (effacés à la fermeture de l'onglet)
- Partage de résultats *(optionnel)* : encoder les scores en base64 dans le paramètre URL `?r=...`
- Aucun cookie de tracking ajouté par ce test

```javascript
// Encodage des scores pour partage URL (optionnel)
const encoded = btoa(JSON.stringify(scores));
const shareUrl = `${window.location.origin}/test-elements/resultats?r=${encoded}`;

// Décodage en réception
const params = new URLSearchParams(window.location.search);
if (params.get('r')) {
  const scores = JSON.parse(atob(params.get('r')));
  renderResults(scores);
}
```

---

## 📱 Design & Responsive

- **Mobile-first obligatoire** — valider sur iOS et Android avant livraison
- Grille de tags : `display: flex; flex-wrap: wrap; gap: 8px;`
- Tags sur mobile : `padding: 12px 16px` minimum pour surface de toucher suffisante
- Canvas radar : `responsive: true, maintainAspectRatio: false` dans un conteneur `height: 300px`
- Reprendre les tokens de design existants du site (couleurs, typographie, `border-radius`, ombres)
- Animations sur les tags : `transform: scale(1.04)` + `transition: 150ms ease` au clic

---

## ✅ Checklist de Livraison

- [ ] Route `/test-elements` créée et protégée (même accès que le chromobiotest)
- [ ] Entrée dans la navigation du site, cohérente avec le test chromobio
- [ ] `elements.json` généré — 447 entrées (250 qualités + 197 défauts, 4 éléments)
- [ ] Étape 1 (Qualités) : grille fonctionnelle, sélection illimitée, couleurs par élément
- [ ] Étape 2 (Défauts) : même comportement
- [ ] Navigation Retour/Suivant sans perte de sélection
- [ ] `computeScores()` : calcul correct de force / ombre / équilibre par élément
- [ ] `detectProfile()` : 10 priorités implémentées, renvoie la bonne clé
- [ ] Objet `INTERPRETATIONS` : 35 textes mappés depuis `prompt_test_4_elements_bardon.md`
- [ ] Radar Chart.js : deux séries (Force + Ombre), responsive, lisible sur mobile
- [ ] Tableau des scores par élément affiché
- [ ] Texte d'interprétation affiché avec styling coloré
- [ ] Export image ou PDF du profil (`html2canvas` ou équivalent)
- [ ] Bouton `Recommencer` réinitialise complètement
- [ ] RGPD : aucune donnée côté serveur, `sessionStorage` uniquement
- [ ] Validation mobile iOS + Android

---

## 🔗 Références

| Ressource | Emplacement |
|-----------|-------------|
| Spec UX + listes + textes + algorithme | `prompt_test_4_elements_bardon.md` (projet Claude coeurdelom.fr) |
| Modèle UX / accès utilisateur | Test chromobioénergétique existant sur coeurdelom.fr |
| Source ésotérique | Franz Bardon, *Le Chemin de la Véritable Initiation Magique* (1956) |
| Graphique | Chart.js CDN ou D3.js selon stack |
| Export | html2canvas + jsPDF, ou Puppeteer côté serveur |

---

*Brief d'implémentation — Yan Heydlauf / coeurdelom.fr — v1.0*
