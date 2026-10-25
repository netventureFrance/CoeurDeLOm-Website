# Test des 4 Éléments (Bardon) — Plan d'intégration dans l'admin

**Date :** 25/10/2026
**Décision :** le test vit dans **l'espace admin** (`/admin`), comme nouvel onglet à côté de *Rêves* et *Astrologie*, et **pas** comme page publique.
Cela remplace les sections *Accès utilisateur* et *Routing* du brief v2 (`/test-elements`, même accès que le chromobiotest).

## Fichiers

| Fichier | Rôle | Statut |
|---|---|---|
| `spec-v2.md` | Spec de contenu v2 : fondement Bardon, 454 mots, règles P1→P6, 32 textes | **Référence** |
| `brief-integration-v2.md` | Brief technique v2 (design, logique, page de résultats) | Référence, sauf accès et routing (voir ci-dessus) |
| `archive/spec-v1.md`, `archive/brief-integration-v1.md` | v1 : 447 mots, 35 textes, cochage binaire | Remplacés, gardés pour l'historique |
| `../../lib/elements-test/elements.json` | Base des 454 mots, telle que livrée | **Ne pas éditer à la main** |
| `../../lib/elements-test/score.js` | Calcul, lecture Bardon, détection du profil | Livré, **intégré sans modification** |

Vérification faite le 25/10 : 200 000 sélections aléatoires passées dans `score.js` atteignent les 32 profils, plus `incomplet`.

**Manquent dans la livraison :**
- `build_elements.py` : le script qui génère `elements.json`. Sans lui, aucune modification des listes n'est possible.
- `assets/reference_style_cards_coeurdelom.png` : non bloquant, puisque les quatre cartes de référence sont en ligne sur la page `/why`, pas sur la page d'accueil comme l'indique le brief.

## Architecture cible

```
components/admin/AdminDashboard.tsx        ← + onglet « 4 Éléments » (TabType 'elements')
components/admin/elements/
├── ElementsTest.tsx                       ← conteneur : accueil → miroir blanc → miroir noir → résultats
├── ElementCards.tsx                       ← les 4 cartes (composant carte de /why)
├── TagGrid.tsx                            ← grille de tags, tap cyclique 0→1→2→3→0
├── BardonReading.tsx                      ← bloc « Lecture selon Bardon » (en tête des résultats)
├── ElementsRadar.tsx                      ← radar Force / Ombre
├── ScoresTable.tsx                        ← Force % · Ombre % · Équilibre
└── elements.css                           ← palette et états des tags du brief
lib/elements-test/
├── elements.json                          ← fourni
├── score.js                               ← fourni
├── score.d.ts                             ← types TypeScript pour score.js (le fichier lui-même reste intact)
├── interpretations.ts                     ← les 32 textes recopiés de spec-v2.md
└── interpretations.test.ts                ← 32 clés et cohérence avec detectProfile()
```

Le test est protégé par la même authentification que le reste de l'admin (cookie signé de `/api/admin/auth`), donc rien à ajouter côté accès.

**Illustrations**, celles des cartes de `/why`, déjà dans `public/` :

| Élément | Fichier | Carte d'origine |
|---|---|---|
| 💧 Eau | `PourquoiExpertiseHolistique.png` | Expertise holistique |
| 🌿 Terre | `PourquoiTechniquesAncestrales.png` | Techniques ancestrales |
| 🔥 Feu | `PourquoiAccompagnement.png` | Accompagnement personnalisé |
| 🌬️ Air | `PourquoiCadre Guerison.png` | Cadre propice à la guérison |

## Étapes

1. **Socle de données** : `score.d.ts`, puis `interpretations.ts` avec les 32 textes (titre, couleur, texte) recopiés mot pour mot de `spec-v2.md`, puis le test de cohérence (32 clés, chaque profil renvoyé par `detectProfile()` existe).
2. **Onglet admin** : ajouter `'elements'` à `TabType` et le bouton « 4 Éléments » dans `AdminDashboard.tsx`.
3. **Accueil du test** : les 4 cartes éléments (grille 4 → 2 → 1 colonnes), une courte introduction et le bouton « Commencer ».
4. **Miroir Blanc puis Miroir Noir** : `TagGrid` sur les 252 qualités puis les 202 défauts. Légende ○ parfois · ◐ souvent · ● très fort, sélection illimitée, barre « Étape 1 / 2 », Retour sans perte. Garde avant calcul : au moins un mot dans chaque miroir.
5. **Résultats**, dans l'ordre du brief :
   1. Lecture selon Bardon, avec le cas `null` (« Aucun élément ne prédomine dans ce miroir ») ;
   2. le radar ;
   3. le tableau des scores ;
   4. le texte de profil, présenté comme une **extension coeurdelom.fr** et non « selon Bardon » (spec, section *Fondement*) ;
   5. les actions : export PDF, Recommencer.
6. **Export PDF** : avec `jspdf` et `html2canvas`, déjà dans les dépendances, sur le modèle des exports existants. Voir la question 3.
7. **Vérification** : build de production, parcours complet au navigateur, affichage tablette, car Valérie l'utilisera probablement en séance.

## Écarts proposés par rapport au brief

- **Radar en SVG, pas Chart.js** : Chart.js n'est pas installé. Un radar à 4 axes fait environ 60 lignes de SVG, sans nouvelle dépendance, et se rend aussi bien dans le PDF. Mêmes couleurs que la config du brief.
- **Partage par URL (`?r=`) abandonné** : sans objet dans l'admin, puisque le client n'a pas accès à `/admin`.
- **Qualités à cultiver** : `score.js` renvoie les 6 *premières* qualités de l'élément (ordre de la liste), sans lien avec les défauts cochés, alors que la spec dit « 1 à 2 qualités par défaut prioritaire ». Je garde `score.js` tel quel, comme le demande le brief. Si on veut des correspondances défaut → qualité choisies, il faut les ajouter dans `build_elements.py`.

## Décisions (25/10/2026)

1. **Valérie fait passer le test en séance**, sur son appareil.
2. **Résultats enregistrés dans Airtable**, table `Elements_Tests` : client, date, profil, dominants, défauts prioritaires, scores et mots cochés (pour rouvrir un test), notes de séance. La table est créée au premier enregistrement si le jeton Airtable a les droits de schéma ; sinon, la créer à la main avec ces champs (voir `lib/airtable.ts`).
3. **Export PDF** à remettre au client (sans les notes de séance).
4. **Français seulement** pour le moment.

## Implémenté

- Onglet « 4 Éléments » dans `/admin` : accueil avec les 4 cartes, Miroir Blanc, Miroir Noir (tap cyclique, recherche, compteur), garde avant calcul, résultats, notes, enregistrement et mise à jour Airtable, liste des tests enregistrés (ouvrir, supprimer), export PDF.
- Le test en cours survit à un rechargement de page (`sessionStorage`), vidé par « Nouveau test ».
- Les mots sont présentés **par ordre alphabétique**, pas groupés par élément, pour ne pas souffler l'élément au client.
- Vérification : `node scripts/test-elements-test.mjs`. Textes régénérés depuis la spec avec `python3 scripts/build-elements-interpretations.py`.
