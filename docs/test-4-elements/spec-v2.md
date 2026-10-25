# PROMPT POUR CODE — Test d'Équilibre des 4 Éléments (Franz Bardon)
**Destinataire :** CODE (développeur de www.coeurdelom.fr)
**Inspiration :** Test chromobioénergétique — même logique d'auto-évaluation intuitive
**Référence ésotérique :** Franz Bardon, *Le Chemin de la Véritable Initiation Magique* (1956), Degré I — Formation magique de l'âme
**Version :** 2.0 — 25 octobre 2026 (règle d'interprétation vérifiée sur le texte de Bardon, listes réalignées, algorithme corrigé, 32 textes)

---

## 🎯 Objectif

Créer un test interactif et visuel permettant à l'utilisateur de **découvrir l'équilibre des 4 Éléments dans sa personnalité** (Feu 🔥, Eau 💧, Air 🌬️, Terre 🌿), à travers deux listes — qualités et défauts — tirées de l'enseignement hermétique de Franz Bardon.

Chaque mot coché est associé à un élément et à une **intensité** (1 à 3, comme les trois groupes du miroir de Bardon). À la fin, un **profil élémentaire** est généré : élément dominant du Miroir Blanc, élément dominant du Miroir Noir, défauts prioritaires à travailler, et un texte d'interprétation.

---

## 📜 Fondement — la méthode des deux miroirs selon Bardon

Ce que Bardon prescrit au Degré I (citations de l'édition Rüggeberg, trad. anglaise de référence) :

1. **Deux miroirs.** *« a black one with the evil qualities, and a white one with the good and noble character traits »* — l'élève dresse d'abord la liste de ses défauts (miroir noir), puis *« Repeat the whole procedure with your good psychical qualities »* (miroir blanc).

2. **Chaque trait est rattaché à un élément.** Bardon donne lui-même les attributions de référence :

   | Élément | Défauts (miroir noir) | Qualités (miroir blanc) |
   |---------|----------------------|------------------------|
   | 🔥 Feu | jalousie, haine, vengeance, irascibilité, colère | activité, enthousiasme, fermeté, courage, audace |
   | 🌬️ Air | légèreté, suffisance, vantardise, prodigalité, bavardage | diligence, joie, adresse, bonté, légèreté, optimisme |
   | 💧 Eau | indifférence, paresse, froideur, laxisme, négligence, timidité, insolence, instabilité | modestie, abstinence, ferveur, compassion, tranquillité, tendresse, pardon |
   | 🌿 Terre | paresse, manque de conscience, mélancolie, irrégularité, anomalie, lourdeur | respect, endurance, conscience, minutie, sobriété, ponctualité, responsabilité |

   Au chapitre théorique VII, il complète par les tempéraments : colérique = Feu, sanguin = Air, mélancolique = Eau, flegmatique = Terre, chacun avec une polarité active et une polarité négative.

3. **Trois groupes d'intensité.** Pour chaque miroir : *« In the first group you will enter the biggest failures, especially those that influence you strongest »* ; *« The second group will embrace faults occurring less frequently and in slighter degree »* ; *« In the last group you are recording those faults that happen only now and again »*. **C'est la règle que le test v1 ne respectait pas** : un simple cochage binaire perd cette information. La v2 l'intègre par un niveau d'intensité sur chaque mot sélectionné.

4. **Règle d'interprétation.** Bardon n'énonce qu'une seule règle, et elle est courte : les miroirs permettent *« to recognize rather exactly which of the elements is prevailing in his black or white mirror »*, et *« This recognition is absolutely necessary to attain the magic equipoise »*. Autrement dit : **(a)** quel élément prédomine dans le miroir blanc — c'est la base du tempérament, la ressource ; **(b)** quel élément prédomine dans le miroir noir — c'est le déséquilibre principal, le chantier ; **(c)** la finalité est l'**équilibre** des quatre. Le Degré II engage ensuite le travail sur les défauts du premier groupe, par autosuggestion et transmutation en la qualité opposée.

> Tout ce qui, dans ce test, va au-delà de ces trois lectures (profils bi/tri-élémentaires, oppositions, profils globaux) est une **extension interprétative** proposée par coeurdelom.fr. Elle est cohérente avec l'esprit de Bardon mais ne doit pas être présentée comme « selon Bardon ». La page de résultats affiche d'abord la lecture bardonienne, puis l'extension.

---

## 🌊 Concept & Expérience Utilisateur

### Flux général
```
Accueil → Instructions → Étape 1 (Qualités) → Étape 2 (Défauts) → Résultats → Conseils
```

### Étapes détaillées

#### 🖥️ Accueil
- Titre poétique : *« Quel Élément êtes-vous ? »* ou *« Révélez votre nature profonde »*
- Courte introduction (2–3 lignes) sur les 4 éléments selon Bardon
- Quatre cartes de présentation des éléments, **dans le style des cartes de la page d'accueil coeurdelom.fr** (voir Design)
- Bouton `Commencer l'évaluation`

#### ✨ Étape 1 — Miroir Blanc (Qualités)
- Consigne : *« Cochez les qualités qui vous correspondent sincèrement, sans vous juger. Appuyez une, deux ou trois fois selon la force du trait en vous. »*
- Affichage en grille de mots-étiquettes (tags cliquables)
- **Intensité par tap** : 1er tap = *parfois* (contour coloré), 2e tap = *souvent* (fond clair), 3e tap = *très fort — à la moindre occasion* (fond plein), 4e tap = désélection
- Légende visible en haut de la grille : ○ parfois · ◐ souvent · ● très fort
- **Aucune limite de sélection** — cochez autant de qualités que vous vous reconnaissez

#### 🌑 Étape 2 — Miroir Noir (Défauts)
- Consigne : *« Cochez les défauts que vous reconnaissez en vous, avec honnêteté et bienveillance. Même échelle : parfois / souvent / très fort. »*
- Même interface en tags, même mécanique d'intensité
- **Aucune limite de sélection**

#### 📊 Résultats — Profil Élémentaire
1. **Lecture selon Bardon** (bloc principal, en tête) :
   - *Votre Miroir Blanc est dominé par* : **[Élément]** — votre ressource, la base de votre tempérament
   - *Votre Miroir Noir est dominé par* : **[Élément]** — votre chantier prioritaire
   - *Défauts de premier groupe à travailler en priorité* : liste des défauts cochés à l'intensité 3 dans l'élément dominant du Miroir Noir (et, s'il n'y en a pas, ceux à l'intensité 2)
   - *Qualité opposée à cultiver* : pour chaque défaut prioritaire, proposer une qualité du même élément (transmutation bardonienne)
2. **Graphique radar** des 4 éléments — deux séries : Force (qualités) et Ombre (défauts)
3. **Tableau des scores** : Force % · Ombre % · Équilibre par élément
4. **Profil et texte d'interprétation** (extension coeurdelom.fr — 32 textes)
5. Boutons `Télécharger mon profil` (PDF ou image) · `Recommencer` · `Partager`

---

## 🎨 Design & Identité Visuelle

### Composant de référence : les cartes de la page d'accueil coeurdelom.fr

Les quatre éléments sont présentés avec **le même composant carte** que les quatre cartes « Expertise holistique / Techniques ancestrales / Accompagnement personnalisé / Cadre propice à la guérison » de la page d'accueil (capture de référence : `assets/reference_style_cards_coeurdelom.png`).

Caractéristiques à reproduire :
- Carte blanche, coins arrondis (~20 px), ombre portée douce et diffuse, fond de page gris très clair
- Illustration **aquarelle** centrée en haut (~80 px), sans cadre
- Titre en gras, **indigo profond**, centré
- Texte descriptif en gris moyen, centré, interligne généreux
- Quatre cartes alignées sur desktop, empilées sur mobile

**Réutiliser les quatre illustrations déjà présentes sur le site** — elles correspondent exactement aux quatre éléments :

| Élément | Illustration du site | Carte d'origine |
|---------|---------------------|-----------------|
| 💧 Eau | Spirale d'eau bleue | « Expertise holistique » |
| 🌿 Terre | Feuille verte | « Techniques ancestrales » |
| 🔥 Feu | Flamme orangée-or | « Accompagnement personnalisé » |
| 🌬️ Air | Plumes violettes | « Cadre propice à la guérison » |

### Palette des éléments — alignée sur l'iconographie du site

| Élément | Couleur principale | Teinte claire (fond tag niveau 2) | Symbolique |
|---------|-------------------|-----------------------------------|------------|
| 🔥 Feu  | `#E67E22` orangé-or | `#FDEBD0` | Volonté, action, transformation |
| 💧 Eau  | `#2E86C1` bleu | `#D6EAF8` | Émotion, profondeur, réceptivité |
| 🌬️ Air | `#8E44AD` violet | `#E8DAEF` | Intellect, communication, légèreté |
| 🌿 Terre| `#58A845` vert | `#E1F0D9` | Stabilité, ancrage, matière |

Titres : indigo profond `#2C1B5E`. Texte courant : gris `#555555`. Fond de page : `#F5F5F7`.

> La v1 proposait Feu rouge et Air jaune. La v2 reprend les couleurs réellement utilisées par les illustrations du site pour que le test soit visuellement indissociable du reste de coeurdelom.fr.

### Rendu des tags selon l'intensité
- Niveau 0 (non coché) : fond blanc, bordure grise fine, texte gris
- Niveau 1 *parfois* : bordure couleur élément 2 px, texte couleur élément
- Niveau 2 *souvent* : fond teinte claire, bordure couleur élément, texte couleur élément
- Niveau 3 *très fort* : fond couleur élément, texte blanc, légère élévation

---

## 📋 LISTE COMPLÈTE — Qualités & Défauts par Élément

> Source principale : Franz Bardon, *Le Chemin de la Véritable Initiation Magique*, Degré I et chapitre VII
> Sources complémentaires : *Paroles de Maître Arion*, *Le Livre d'Or de la Sagesse*, communauté bardonnienne francophone
> Les attributions données explicitement par Bardon (tableau ci-dessus) sont respectées en priorité ; le reste des listes est une extension lexicale cohérente avec ses polarités de tempérament.
>
> **Note de Bardon :** *« Le tempérament colérique (Feu) présente par sa polarité active : activité, enthousiasme, zèle, résolution, audace, courage, force créatrice. Le sanguin (Air) : pénétration, joie, clarté, vivacité, optimisme. Le mélancolique (Eau) : respect, charité, modestie, dévouement, compassion, profondeur. Le flegmatique (Terre) : persévérance, fermeté, concentration, sobriété, responsabilité, prudence. »*

> La source unique de ces listes est le script `build_elements.py`, qui génère `elements.json` et les tables ci-dessous. Toute modification passe par ce script.

---

### 🔥 ÉLÉMENT FEU — Tempérament Colérique
*Principe actif, masculin, électrique — Volonté, élan vital, pouvoir de transformation*

#### ✅ Qualités — Feu (60)
| # | Qualité | # | Qualité | # | Qualité |
|---|---|---|---|---|---|
| 1 | Actif | 21 | Décidé | 41 | Noble |
| 2 | Admirable | 22 | Dynamique | 42 | Passionnant |
| 3 | Affirmatif | 23 | Éblouissant | 43 | Passionné |
| 4 | Ambitieux | 24 | Éclatant | 44 | Persuasif |
| 5 | Animé | 25 | Encourageant | 45 | Protecteur |
| 6 | Ardent | 26 | Énergique | 46 | Pugnace |
| 7 | Assertif | 27 | Engagé | 47 | Résolu |
| 8 | Attractif | 28 | Enthousiaste | 48 | Séduisant |
| 9 | Audacieux | 29 | Entreprenant | 49 | Sportif |
| 10 | Autonome | 30 | Force créatrice | 50 | Stimulant |
| 11 | Autoritaire (juste) | 31 | Impliqué | 51 | Stratège |
| 12 | Aventureux | 32 | Infatigable | 52 | Sûr de soi |
| 13 | Beau | 33 | Influent | 53 | Talentueux |
| 14 | Brave | 34 | Inoubliable | 54 | Unique |
| 15 | Captivant | 35 | Inspiré | 55 | Vaillant |
| 16 | Chaleureux | 36 | Intrépide | 56 | Valeureux |
| 17 | Charismatique | 37 | Leader | 57 | Vigoureux |
| 18 | Combatif | 38 | Libéré | 58 | Vivace |
| 19 | Compétitif | 39 | Magistral | 59 | Volontaire |
| 20 | Courageux | 40 | Maître de soi | 60 | Zèle |

#### ❌ Défauts — Feu (55)
| # | Défaut | # | Défaut | # | Défaut |
|---|---|---|---|---|---|
| 1 | Abrupt | 20 | Colérique | 39 | Intolérant |
| 2 | Accusateur | 21 | Cruel | 40 | Intransigeant |
| 3 | Acerbe | 22 | Démesure | 41 | Irritable |
| 4 | Agressif | 23 | Despotique | 42 | Jaloux |
| 5 | Aigri | 24 | Dominateur | 43 | Méprisant |
| 6 | Arriviste | 25 | Égocentrique | 44 | Narcissique |
| 7 | Arrogant | 26 | Égoïste | 45 | Orgueilleux |
| 8 | Autoritaire (abusif) | 27 | Envahissant | 46 | Prétentieux |
| 9 | Bagarreur | 28 | Envieux | 47 | Provocateur |
| 10 | Blessant | 29 | Excessif | 48 | Raciste |
| 11 | Brute | 30 | Fanatique | 49 | Râleur |
| 12 | Bruyant | 31 | Grossier | 50 | Revanchard |
| 13 | Capricieux | 32 | Haineux | 51 | Révolté |
| 14 | Caractériel | 33 | Hautain | 52 | Stressé |
| 15 | Carriériste | 34 | Humiliant | 53 | Tempétueux |
| 16 | Cassant | 35 | Impatient | 54 | Vaniteux |
| 17 | Casse-cou | 36 | Imprudent | 55 | Vulgaire |
| 18 | Colère | 37 | Impulsif |  |  |
| 19 | Coléreux | 38 | Intempérant |  |  |

---

### 💧 ÉLÉMENT EAU — Tempérament Mélancolique
*Principe réceptif, féminin, magnétique — Émotion, profondeur, amour, intuition*

#### ✅ Qualités — Eau (61)
| # | Qualité | # | Qualité | # | Qualité |
|---|---|---|---|---|---|
| 1 | À l'écoute | 22 | Conciliant | 43 | Pacifique |
| 2 | Accueillant | 23 | Cordial | 44 | Paisible |
| 3 | Adorable | 24 | Délicat | 45 | Patient |
| 4 | Affectueux | 25 | Délicatesse | 46 | Prévenant |
| 5 | Aidant | 26 | Détendu | 47 | Propension à pardonner |
| 6 | Aimable | 27 | Dévoué | 48 | Pur |
| 7 | Aimant | 28 | Douceur | 49 | Rassurant |
| 8 | Apaisant | 29 | Émouvant | 50 | Réceptif |
| 9 | Ardeur affective | 30 | Empathique | 51 | Réconfortant |
| 10 | Attachant | 31 | Galant | 52 | Reconnaissant |
| 11 | Attentionné | 32 | Humble | 53 | Romantique |
| 12 | Bienfaisant | 33 | Indulgent | 54 | Sage |
| 13 | Bienveillant | 34 | Intuitif | 55 | Sensible |
| 14 | Bon | 35 | Loyal (affectif) | 56 | Serein |
| 15 | Câlin | 36 | Méditatif | 57 | Serviable |
| 16 | Charitable | 37 | Mignon | 58 | Tempérant |
| 17 | Clément | 38 | Modeste | 59 | Tendre |
| 18 | Compatissant | 39 | Obligeant | 60 | Tranquille (intérieure) |
| 19 | Complaisant | 40 | Ouvert (cœur) | 61 | Zen |
| 20 | Compréhensif | 41 | Ouverture à autrui |  |  |
| 21 | Concerné | 42 | Pacificateur |  |  |

#### ❌ Défauts — Eau (50)
| # | Défaut | # | Défaut | # | Défaut |
|---|---|---|---|---|---|
| 1 | Angoissé | 18 | Hypersensible | 35 | Passif |
| 2 | Anxieux | 19 | Hypocrisie affective | 36 | Peureux |
| 3 | Apathie | 20 | Indécis | 37 | Plaintif |
| 4 | Apitoiement sur soi | 21 | Indifférence froide | 38 | Pleurnicheur |
| 5 | Boudeur | 22 | Indolent | 39 | Possessif |
| 6 | Catastrophiste | 23 | Influençable | 40 | Rancunier |
| 7 | Complexé | 24 | Insolent | 41 | Renfermé (émotionnel) |
| 8 | Crédule | 25 | Instabilité émotionnelle | 42 | Résigné |
| 9 | Défaitiste | 26 | Irrespect | 43 | Rêveur excessif |
| 10 | Dépendance affective | 27 | Laxiste | 44 | Sensiblerie |
| 11 | Dépression | 28 | Lunatique | 45 | Solitaire (repli) |
| 12 | Distrait (rêverie) | 29 | Mal à l'aise | 46 | Sombre |
| 13 | Docile (soumission) | 30 | Naïf | 47 | Susceptible |
| 14 | Émotif excessif | 31 | Négligent | 48 | Timide (excessif) |
| 15 | Fainéant (torpeur) | 32 | Nostalgique paralysant | 49 | Torpeur |
| 16 | Froid (émotionnel) | 33 | Paresse spirituelle | 50 | Triste |
| 17 | Hésitant | 34 | Paresseux (inertie) |  |  |

---

### 🌬️ ÉLÉMENT AIR — Tempérament Sanguin
*Principe mental, électrique-magnétique — Intelligence, communication, adaptabilité, joie*

#### ✅ Qualités — Air (66)
| # | Qualité | # | Qualité | # | Qualité |
|---|---|---|---|---|---|
| 1 | Abordable | 23 | Diplomate | 45 | Original |
| 2 | Accessible | 24 | Drôle | 46 | Ouvert d'esprit |
| 3 | Adroit | 25 | Éloquent | 47 | Pénétration d'esprit |
| 4 | Affable | 26 | Enjoué | 48 | Pétillant |
| 5 | Agréable | 27 | Épanoui | 49 | Philosophe |
| 6 | Amical | 28 | Habileté | 50 | Plaisant |
| 7 | Amusant | 29 | Humoristique | 51 | Polyvalent |
| 8 | Artistique | 30 | Imaginatif | 52 | Positif |
| 9 | Astucieux | 31 | Indépendant | 53 | Raffiné |
| 10 | Avenant | 32 | Ingénieux | 54 | Rationnel |
| 11 | Brillant | 33 | Inventif | 55 | Réfléchi |
| 12 | Chanceux | 34 | Jovial | 56 | Rusé (positif) |
| 13 | Charmant | 35 | Joyeux | 57 | Savant |
| 14 | Charmeur | 36 | Judicieux | 58 | Sociable |
| 15 | Chouette | 37 | Libre d'esprit | 59 | Social |
| 16 | Clarté | 38 | Logique | 60 | Souriant |
| 17 | Collaborateur | 39 | Lucide | 61 | Studieux |
| 18 | Comique | 40 | Malin (positif) | 62 | Sympathique |
| 19 | Communicatif | 41 | Naturel | 63 | Tolérant |
| 20 | Confiance (air) | 42 | Nuancé | 64 | Vif |
| 21 | Curieux | 43 | Objectif (mental) | 65 | Vigilant |
| 22 | Diligent | 44 | Optimiste | 66 | Vivacité |

#### ❌ Défauts — Air (50)
| # | Défaut | # | Défaut | # | Défaut |
|---|---|---|---|---|---|
| 1 | Agitation mentale | 18 | Désordonné | 35 | Mythomane |
| 2 | Arrogance intellectuelle | 19 | Dispersion | 36 | Nerveux |
| 3 | Baratineur | 20 | Étourdi | 37 | Pédant |
| 4 | Bavard (excessif) | 21 | Excentrique | 38 | Perfidie |
| 5 | Brouillon | 22 | Indiscret | 39 | Présomptueux |
| 6 | Cachottier | 23 | Instable (mental) | 40 | Prodigue (dépensier) |
| 7 | Calculateur | 24 | Irréaliste | 41 | Puéril |
| 8 | Caquetage | 25 | Irresponsable | 42 | Rumination |
| 9 | Caricatural | 26 | Irrévérence | 43 | Ruse malveillante |
| 10 | Caustique | 27 | Légèreté irresponsable | 44 | Sans gêne |
| 11 | Censeur | 28 | Malhonnête | 45 | Sarcastique |
| 12 | Compliqué | 29 | Maniéré | 46 | Scepticisme paralysant |
| 13 | Confus | 30 | Manipulateur | 47 | Suffisant |
| 14 | Cynique | 31 | Mauvaise foi | 48 | Superficiel |
| 15 | Débordé | 32 | Médisant | 49 | Vantard |
| 16 | Dédain | 33 | Menteur | 50 | Versatile |
| 17 | Désinvolte | 34 | Moqueur |  |  |

---

### 🌿 ÉLÉMENT TERRE — Tempérament Flegmatique
*Principe stable, consolidant — Persévérance, ancrage, sens du devoir, matière*

#### ✅ Qualités — Terre (65)
| # | Qualité | # | Qualité | # | Qualité |
|---|---|---|---|---|---|
| 1 | Accompli | 23 | Économe | 45 | Précis |
| 2 | Appliqué | 24 | Efficace | 46 | Présent |
| 3 | Assidu | 25 | Endurant | 47 | Prévoyant |
| 4 | Attentif | 26 | Ferme | 48 | Productif |
| 5 | Authentique | 27 | Fiable | 49 | Propre |
| 6 | Bienséant | 28 | Gravité (sérieux) | 50 | Prudent |
| 7 | Bûcheur | 29 | Intègre | 51 | Raisonnable |
| 8 | Calme (ancré) | 30 | Juste | 52 | Réaliste |
| 9 | Capable | 31 | Loyal (constant) | 53 | Résistant |
| 10 | Civil | 32 | Mature | 54 | Respectueux |
| 11 | Cohérent | 33 | Méritant | 55 | Responsable |
| 12 | Concentré | 34 | Méthodique | 56 | Rigoureux |
| 13 | Consciencieux | 35 | Méticuleux | 57 | Scrupuleux |
| 14 | Conséquent | 36 | Minutieux | 58 | Sérieux |
| 15 | Constant | 37 | Moral | 59 | Sincère |
| 16 | Convenable | 38 | Objectif (stable) | 60 | Sobre |
| 17 | Courtois | 39 | Opiniâtre (juste) | 61 | Soigneux |
| 18 | Déterminé | 40 | Organisé | 62 | Solide |
| 19 | Digne | 41 | Persévérant | 63 | Stable |
| 20 | Digne de confiance | 42 | Ponctuel | 64 | Structuré |
| 21 | Discipliné | 43 | Pondéré | 65 | Tenace |
| 22 | Droit | 44 | Pratique |  |  |

#### ❌ Défauts — Terre (47)
| # | Défaut | # | Défaut | # | Défaut |
|---|---|---|---|---|---|
| 1 | Amateur (négligent) | 17 | Incompétent | 33 | Obtus |
| 2 | Amorphe | 18 | Insatisfait (matériel) | 34 | Peu fiable |
| 3 | Assisté | 19 | Irrégulier | 35 | Peur du changement |
| 4 | Avare | 20 | Lent (refus d'avancer) | 36 | Procrastinateur |
| 5 | Blasé | 21 | Mal élevé | 37 | Radin |
| 6 | Borné | 22 | Maniaque | 38 | Rétrograde |
| 7 | Conformiste | 23 | Matérialisme excessif | 39 | Revêche |
| 8 | Cupide | 24 | Médiocre | 40 | Rigide |
| 9 | Défiance | 25 | Méfiant | 41 | Ringard |
| 10 | Déloyauté | 26 | Mélancolie pesante | 42 | Routinier |
| 11 | Égoïsme pratique | 27 | Mesquin | 43 | Sans scrupules |
| 12 | Entêté | 28 | Misanthrope | 44 | Soupçonneux |
| 13 | Étroitesse d'esprit | 29 | Mou | 45 | Strict (abusif) |
| 14 | Fataliste | 30 | Muet (taciturnité) | 46 | Tatillon |
| 15 | Fermeture | 31 | Nonchalant | 47 | Têtu |
| 16 | Inaccessible | 32 | Obstiné |  |  |

---

## 📊 Récapitulatif des Listes

| Élément | Qualités | Défauts | Total |
|---------|----------|---------|-------|
| 🔥 Feu | 60 | 55 | 115 |
| 💧 Eau | 61 | 50 | 111 |
| 🌬️ Air | 66 | 50 | 116 |
| 🌿 Terre | 65 | 47 | 112 |
| **TOTAL** | **252** | **202** | **454 entrées** |

---

## 🧮 Logique de Calcul des Résultats

### Pondération par intensité (les trois groupes de Bardon)

| Niveau | Libellé | Poids |
|--------|---------|-------|
| 1 | Parfois — *« happen only now and again »* | 1 |
| 2 | Souvent — *« less frequently and in slighter degree »* | 2 |
| 3 | Très fort — *« influence you strongest »* | 3 |

### Formules

```
Pour chaque élément E ∈ {Feu, Eau, Air, Terre} :

  poids_qualités(E) = Σ poids des qualités cochées appartenant à E
  poids_défauts(E)  = Σ poids des défauts cochés appartenant à E

  force(E)     = poids_qualités(E) / Σ poids_qualités(tous) × 100   → les forces somment à 100
  ombre(E)     = poids_défauts(E)  / Σ poids_défauts(tous)  × 100   → les ombres somment à 100
  équilibre(E) = force(E) − ombre(E)

Global :
  ratio_ombre = Σ poids_défauts / (Σ poids_qualités + Σ poids_défauts)
               → 0,5 = autant de qualités que de défauts ; > 0,5 = miroir noir plus chargé
```

> **Pourquoi `ratio_ombre` est indispensable :** force et ombre sont des *parts* (elles somment chacune à 100). Elles disent quel élément prédomine, pas si la personne a coché beaucoup ou peu de défauts globalement. Les profils « Déséquilibre total » et « Qualités abondantes » ne peuvent se détecter qu'avec ce ratio — c'est l'erreur de la v1, où ces deux profils étaient mathématiquement inatteignables.

### Table d'interprétation par élément (quadrants)

| Résultat | Signification | Famille de texte |
|----------|---------------|------------------|
| force élevée + ombre faible | Élément **maîtrisé** — ressource consciente | `maitrise-*` |
| force élevée + ombre élevée | Élément **puissant mais non maîtrisé** — énergie brute | `puissant-*` *(nouveau en v2)* |
| force faible + ombre élevée | Élément **déséquilibré** — zone de travail prioritaire | `desequilibre-*` |
| force faible + ombre faible | Élément **manquant** — à développer et éveiller | `absent-*` |

---

## 🧭 Règle d'interprétation — lecture bardonienne (affichée en premier)

```
dominant_blanc  = élément avec la force la plus élevée
dominant_noir   = élément avec l'ombre la plus élevée

défauts_prioritaires = défauts cochés à l'intensité 3 dans dominant_noir
                       (si vide : intensité 2 ; si vide : tous ceux de dominant_noir)

pour chaque défaut prioritaire → proposer 1 à 2 qualités de la liste du même élément
                                 (transmutation : le défaut est l'élément en polarité négative,
                                  la qualité du même élément est sa polarité positive)

si dominant_blanc == dominant_noir
   → « Votre tempérament de base est [E], dans ses forces comme dans ses excès »
sinon
   → « Votre ressource est [E1], votre chantier est [E2] »
```

---

## 🔎 Détection du profil — extension coeurdelom.fr (32 textes)

Garde : si aucune qualité **ou** aucun défaut n'a été coché, le test est incomplet — afficher un message et renvoyer à l'étape vide. (Ce n'est pas une limite de sélection : c'est une nécessité de calcul. Un seul mot par étape suffit.)

```
P1 — Profils globaux (ratio_ombre)
  desequilibre-total   : ratio_ombre ≥ 0,75  ET écart max–min des ombres < 25  ET max(force) < 50
  qualites-abondantes  : ratio_ombre ≤ 0,25  ET écart max–min des forces < 25  ET max(ombre) < 50
  equilibre-parfait    : toutes les forces entre 15 et 35  ET toutes les ombres entre 15 et 35

P2 — Structure : éléments absents  (poids(E) = force(E) + ombre(E), somme = 200)
  absents = éléments avec poids < 6
  3 absents → l'élément restant seul : maitrise-E si ombre ≤ force, sinon desequilibre-E
  2 absents → bi-E1-E2 des deux éléments présents
  1 absent  → tri-sans-E si les trois autres ont chacun force ≥ 18, sinon absent-E

P3 — Oppositions (les deux éléments forts ET sombres)
  opposition-feu-eau   : Feu et Eau ont chacun force ≥ 28 ET ombre ≥ 28
  opposition-air-terre : Air et Terre ont chacun force ≥ 28 ET ombre ≥ 28

P4 — Bi-élémentaire
  exactement deux éléments avec force ≥ 30, et les deux autres < 22 → bi-E1-E2
  (ordre canonique des clés : feu, eau, air, terre)

P5 — Élément simple dominant
  top_force = élément de force max ; top_ombre = élément d'ombre max
  si force(top_force) ≥ 35 :
      ombre(top_force) ≤ 22 → maitrise-top_force
      ombre(top_force) ≥ 35 → puissant-top_force
  si ombre(top_ombre) ≥ 35 ET force(top_ombre) < 28 → desequilibre-top_ombre

P6 — Défaut
  initiant-sincere : 0,38 ≤ ratio_ombre ≤ 0,62 ET chaque élément a force ≥ 8 ET ombre ≥ 8
  sinon : maitrise-top_force si force(top_force) ≥ ombre(top_ombre), sinon desequilibre-top_ombre
```

### Distribution attendue (simulation 200 000 profils aléatoires)

| Famille | Part | | Famille | Part |
|---------|------|-|---------|------|
| bi-élémentaire | ~25 % | | tri-élémentaire | ~4 % |
| puissant | ~19 % | | initiant sincère | ~2 % |
| maîtrisé | ~18 % | | oppositions | ~1 % chacune |
| absent | ~16 % | | qualités abondantes | ~1 % |
| déséquilibré | ~11 % | | équilibre parfait / déséquilibre total | < 1 % |

Tous les 32 textes sont atteignables. Les profils rares le sont par construction (l'équilibre parfait est, chez Bardon, le but du travail, pas un point de départ fréquent).

---

## 📝 TEXTES D'INTERPRÉTATION (32 textes)

---

### 1. ÉLÉMENTS SIMPLES — Dominance maîtrisée (4 textes)

#### 🔥 Feu maîtrisé | Force élevée · Ombre faible — `maitrise-feu`
> *« Le Feu anime votre être. Vous êtes un moteur pour ceux qui vous entourent, porté par une volonté ardente et un enthousiasme contagieux. Votre courage et votre créativité font de vous un initiateur naturel. Veillez simplement à ne pas consumer ce que vous souhaitez éclairer — la maîtrise du Feu, c'est savoir réchauffer sans brûler. »*

#### 💧 Eau maîtrisée | Force élevée · Ombre faible — `maitrise-eau`
> *« L'Eau coule en vous avec une sagesse profonde. Votre cœur perçoit ce que les autres ne voient pas encore. Empathie, douceur et intuition sont vos dons naturels. Vous savez aimer, pardonner, et tenir compagnie dans la nuit. Continuez à laisser couler sans vous noyer — votre profondeur est une lumière. »*

#### 🌬️ Air maîtrisé | Force élevée · Ombre faible — `maitrise-air`
> *« L'Air habite votre esprit avec clarté. Intelligence, humour et sens de la communication font de vous un pont entre les êtres. Vous savez nommer les choses juste, éclairer une situation d'un seul mot. Ancrez vos idées dans la réalité pour qu'elles portent leurs fruits bien au-delà de vous. »*

#### 🌿 Terre maîtrisée | Force élevée · Ombre faible — `maitrise-terre`
> *« La Terre vous soutient et vous ancre. Vous êtes le pilier silencieux sur lequel les autres s'appuient sans toujours le savoir. Votre persévérance, votre intégrité et votre sens du devoir sont des ressources rares. Permettez-vous parfois la légèreté de l'Air et l'ardeur du Feu — l'ancrage ne doit pas devenir immobilité. »*

---

### 2. ÉLÉMENTS SIMPLES — Puissants mais non maîtrisés (4 textes — nouveaux en v2)

#### 🔥 Feu puissant | Force élevée · Ombre élevée — `puissant-feu`
> *« Le Feu est votre élément dominant — dans ses dons comme dans ses excès. Courage, élan et passion cohabitent avec la colère, l'impatience ou l'orgueil. Vous n'êtes ni en manque ni en déséquilibre : vous êtes en surchauffe. Tout est là, mais rien n'est encore canalisé. Le travail n'est pas d'éteindre — c'est de forger. Donnez à cette force une forme, un rythme, une direction, et elle deviendra votre plus grand allié. »*

#### 💧 Eau puissante | Force élevée · Ombre élevée — `puissant-eau`
> *« L'Eau vous habite tout entier — la profondeur comme les marées. Empathie, douceur et intuition vont de pair avec la susceptibilité, la mélancolie ou la dépendance affective. Vous ressentez beaucoup, parfois trop, et le courant vous emporte autant qu'il vous porte. Votre apprentissage est celui des berges : donner un lit à ce fleuve, pour qu'il nourrisse sans inonder. »*

#### 🌬️ Air puissant | Force élevée · Ombre élevée — `puissant-air`
> *« L'Air souffle fort en vous — vif, brillant, mais aussi dispersé. Intelligence, humour et aisance verbale s'accompagnent de bavardage, de nervosité ou d'inconstance. Vous pensez vite, parlez vite, changez vite. La leçon de l'Air puissant n'est pas de ralentir l'esprit, mais de lui donner un point fixe : une intention, un silence, un ancrage d'où le vent peut souffler sans tout emporter. »*

#### 🌿 Terre puissante | Force élevée · Ombre élevée — `puissant-terre`
> *« La Terre vous donne votre poids et votre force — mais aussi votre lourdeur. Persévérance, fiabilité et sens du concret cohabitent avec la rigidité, l'entêtement ou la méfiance. Vous tenez bon, parfois jusqu'à ne plus bouger. Ce qui vous est demandé n'est pas de lâcher la structure, mais de l'aérer : laisser le Feu la réchauffer, l'Eau la traverser, l'Air la faire respirer. »*

---

### 3. ÉLÉMENTS SIMPLES — Déséquilibre dominant (4 textes)

#### 🔥 Feu déséquilibré | Ombre élevée · Force faible — `desequilibre-feu`
> *« Votre Feu brûle sans direction ni maîtrise. Colère, orgueil et impulsivité signalent une énergie considérable qui n'a pas encore trouvé son axe. Ce n'est pas l'énergie qui manque — c'est le canal. La première étape est de reconnaître ces flammes sans les fuir ni les laisser tout consumer. »*

#### 💧 Eau déséquilibrée | Ombre élevée · Force faible — `desequilibre-eau`
> *« Les profondeurs de l'Eau peuvent devenir des abîmes. Mélancolie, dépendance affective et passivité signalent un monde intérieur riche mais sans mouvement. L'Eau stagnante se corrompt — il vous faut retrouver le courant, accepter le changement, et laisser entrer la lumière dans les zones d'ombre. »*

#### 🌬️ Air déséquilibré | Ombre élevée · Force faible — `desequilibre-air`
> *« Un Air non maîtrisé disperse et égare. Bavardage, manipulation et instabilité mentale révèlent un intellect brillant qui tourne à vide. La parole sans substance s'évapore. Votre premier exercice est le silence — non pas pour vous taire, mais pour écouter ce que vous dites vraiment. »*

#### 🌿 Terre déséquilibrée | Ombre élevée · Force faible — `desequilibre-terre`
> *« Une Terre trop lourde devient pierre. Rigidité, avarice, entêtement et routine signalent un ancrage devenu prison. Ce qui devait vous soutenir vous paralyse. L'initiation commence précisément là : accepter que le mouvement ne détruit pas — il transforme. »*

---

### 4. ÉLÉMENTS MANQUANTS — À éveiller (4 textes)

#### 🔥 Feu absent | Ni force ni ombre — `absent-feu`
> *« Le Feu est presque inexistant dans votre nature actuelle. Manque de volonté, d'initiative et de confiance en soi peuvent en être les signes. Ce n'est pas une condamnation — c'est une invitation. Le Feu s'allume, il s'apprend. Commencez par un acte courageux, même petit. La flamme naît du frottement. »*

#### 💧 Eau absente | Ni force ni ombre — `absent-eau`
> *« L'Eau est quasi absente de votre paysage intérieur. Une certaine sécheresse émotionnelle, une difficulté à ressentir ou à vous laisser toucher peut en témoigner. Votre chemin passe par l'ouverture du cœur — la méditation, l'art, la nature et la relation authentique sont vos portes d'entrée. »*

#### 🌬️ Air absent | Ni force ni ombre — `absent-air`
> *« L'Air brille par son absence. Rigidité mentale, difficulté à communiquer ou à voir les choses sous plusieurs angles peuvent en être les symptômes. Cultiver la curiosité, lire, dialoguer, voyager intérieurement — voilà comment raviver ce souffle qui manque encore. »*

#### 🌿 Terre absente | Ni force ni ombre — `absent-terre`
> *« La Terre vous fait défaut. Instabilité, manque de constance, projets inachevés et difficulté à tenir dans la durée en sont souvent les signes. Apprendre à finir ce que l'on commence, à honorer ses engagements, à accepter la lenteur — telle est votre école du moment. »*

---

### 5. PROFILS BI-ÉLÉMENTAIRES — Deux éléments dominants (6 textes)

#### 🔥💧 Feu + Eau | Le Volcan et la Source — `bi-feu-eau`
> *« Vous portez en vous deux forces opposées et complémentaires : la passion du Feu et la profondeur de l'Eau. Vous êtes capable d'une intensité émotionnelle rare, d'un amour ardent et d'une créativité puissante. Mais ces deux éléments se combattent aussi : l'impulsivité contre la sensibilité, la volonté contre l'abandon. Votre chemin est l'alchimie intérieure — transformer la tension en vapeur créatrice. »*

#### 🔥🌬️ Feu + Air | La Flamme et le Vent — `bi-feu-air`
> *« Feu et Air se nourrissent mutuellement en vous : le Vent attise la Flamme, la Flamme réchauffe l'Air. Enthousiasme, intelligence, éloquence et charisme sont vos armes naturelles. Vous pouvez inspirer, convaincre, transformer les idées en actes. Le risque : s'embraser trop vite, brûler les étapes. L'ancrage dans la Terre vous manque peut-être. »*

#### 🔥🌿 Feu + Terre | Le Forgeron — `bi-feu-terre`
> *« La combinaison Feu et Terre produit l'artisan, le bâtisseur, le guerrier patient. Vous avez à la fois l'élan et la persistance, le courage et la méthode. Vous menez vos projets du début à la fin avec une puissance rare. Veillez à ne pas devenir inflexible — ni la chaleur humaine (Eau) ni la légèreté (Air) ne doivent disparaître de votre vie. »*

#### 💧🌬️ Eau + Air | Le Poète — `bi-eau-air`
> *« L'union de l'Eau et de l'Air produit une sensibilité fine et une intelligence du cœur. Vous ressentez profondément et vous savez mettre des mots justes sur ce que les autres n'arrivent pas à exprimer. Empathie, créativité et subtilité vous définissent. Attention à la dispersion et au manque d'ancrage : sans Terre ni Feu, les plus belles idées restent dans les nuages. »*

#### 💧🌿 Eau + Terre | La Source et le Rocher — `bi-eau-terre`
> *« Eau et Terre forment en vous une nature profonde, stable et nourricière. Vous êtes un roc pour ceux qui vous entourent : fiable, loyal, attentionné. Votre patience est légendaire, votre dévouement sans faille. Le danger est l'immobilisme et la résignation — sans Feu pour vous propulser ni Air pour vous libérer, vous risquez de vous ensabler dans la routine ou la mélancolie. »*

#### 🌬️🌿 Air + Terre | L'Architecte — `bi-air-terre`
> *« Air et Terre ensemble font le penseur pragmatique, l'architecte de la réalité. Vous avez à la fois la clarté mentale et le sens concret, la stratégie et l'exécution. Vous construisez des choses solides et cohérentes. Ce qui peut vous manquer : la chaleur du Feu pour vous engager pleinement et la douceur de l'Eau pour toucher les cœurs au-delà des idées. »*

---

### 6. PROFILS TRI-ÉLÉMENTAIRES — Un élément fait défaut (4 textes)

#### 🔥💧🌬️ Feu + Eau + Air | Il manque la Terre — `tri-sans-terre`
> *« Vous êtes riche en intensité, en émotion et en intelligence — mais vous manquez d'ancrage. Vos projets commencent avec passion, vos idées fusent, vos émotions débordent... mais les résultats concrets tardent. La Terre est votre grande leçon : finir, concrétiser, s'engager dans la durée. Sans elle, vous brûlez sans laisser de trace durable. »*

#### 🔥💧🌿 Feu + Eau + Terre | Il manque l'Air — `tri-sans-air`
> *« Vous avez la passion, la profondeur et la constance — mais la communication et la légèreté vous font défaut. Vous ressentez énormément mais peinez à exprimer, à partager, à vous connecter avec légèreté aux autres. L'Air est votre porte d'ouverture : apprendre à parler de soi, à rire, à laisser entrer de la clarté dans votre monde dense. »*

#### 🔥🌬️🌿 Feu + Air + Terre | Il manque l'Eau — `tri-sans-eau`
> *« Vous avez l'élan, l'intelligence et la solidité — mais votre monde émotionnel est peu habité. Vous agissez, vous pensez, vous construisez, mais vous touchez rarement les cœurs, ni le vôtre ni celui des autres. L'Eau est votre invitation : ralentir, ressentir, s'autoriser la vulnérabilité. C'est là que l'humain en vous attend. »*

#### 💧🌬️🌿 Eau + Air + Terre | Il manque le Feu — `tri-sans-feu`
> *« Vous êtes sensible, intelligent et fiable — mais il vous manque l'étincelle. La volonté, l'audace et l'initiative sont vos zones d'ombre. Vous attendez souvent que les choses viennent à vous plutôt que de les provoquer. Le Feu est votre défi : oser, prendre votre place, agir même sans garantie. La vie récompense ceux qui s'avancent. »*

---

### 7. PROFILS SPÉCIAUX (6 textes)

#### ⚖️ Équilibre parfait | Les 4 éléments quasi égaux — `equilibre-parfait`
> *« Vos quatre éléments sont en harmonie remarquable. Vous portez en vous la chaleur du Feu, la profondeur de l'Eau, la clarté de l'Air et la solidité de la Terre — sans qu'aucun n'écrase les autres. Cette rare équanimité est le but même du travail initiatique selon Bardon. Elle n'est pas figée : continuez à l'observer, à l'entretenir. L'équilibre se maintient par la vigilance, pas par l'inaction. »*

#### 🌑 Déséquilibre total | Les ombres dominent partout — `desequilibre-total`
> *« Vos quatre miroirs noirs sont chargés. Cela signifie une grande honnêteté de votre part — ou une période de vie particulièrement éprouvante. Ne vous découragez pas : voir clairement ses ombres est déjà un acte courageux. Pour Bardon, c'est précisément le point de départ. Commencez par un seul défaut, un seul élément, et travaillez-le patiemment. La transformation commence par un pas. »*

#### ✨ Qualités abondantes | Les forces dominent partout — `qualites-abondantes`
> *« Vous avez reconnu en vous une grande richesse de qualités dans les quatre éléments. Que ce soit une réalité ou une aspiration profonde, c'est une boussole précieuse. Bardon rappelle cependant que les miroirs doivent être sincères — non pas ce que nous voudrions être, mais ce que nous sommes aujourd'hui. Revenez régulièrement à cette évaluation avec une honnêteté renouvelée. »*

#### 🔥💧 Feu et Eau en opposition | Tension intérieure — `opposition-feu-eau`
> *« Feu et Eau s'affrontent en vous avec une intensité particulière — vous êtes tiraillé entre l'action et le repli, la passion et la mélancolie, la domination et la douceur. Ces contradictions peuvent être épuisantes, mais elles sont aussi la marque des natures les plus profondes. La clé : ne pas choisir entre les deux, mais apprendre à les laisser coexister. La vapeur naît de leur rencontre. »*

#### 🌬️🌿 Air et Terre en opposition | Tête contre corps — `opposition-air-terre`
> *« Votre esprit court plus vite que votre corps ne suit, ou l'inverse : vos habitudes pèsent trop pour que vos idées puissent s'envoler. Air veut liberté, Terre veut structure. Vous naviguez entre l'idéal et le possible, entre l'inspiration et l'application. Votre travail : faire dialoguer le rêveur et l'artisan qui vivent en vous. »*

#### 🌟 Initiant sincère | Toutes les ombres reconnues, toutes les forces cultivées — `initiant-sincere`
> *« Vous avez coché des qualités ET des défauts dans chaque élément, avec équanimité. C'est le profil de celui qui s'observe vraiment — ni complaisant ni trop sévère. Bardon appelle cela l'introspection juste. Vous êtes sur la voie. Le miroir blanc et le miroir noir sont les deux yeux de la conscience. Vous apprenez à voir avec les deux. »*

---

## ⚙️ Spécifications Techniques

- **Framework :** adapter au stack existant de coeurdelom.fr
- **Données :** `elements.json` généré par `build_elements.py` — structure : `{ "id": 1, "label": "Actif", "element": "feu", "type": "qualite" }`
- **Sélection :** chaque mot coché porte une intensité 1–3 ; stockage `[{ id, intensite }]`
- **Stockage :** aucune donnée personnelle sauvegardée (RGPD) — session locale uniquement
- **Export :** génération image/PDF du profil (html2canvas ou équivalent)
- **Responsive :** mobile-first obligatoire
- **Graphique :** Chart.js ou D3.js — radar chart préféré
- **Animations :** douces et fluides — CSS transitions ou GSAP léger
- **Partage :** bouton copier le lien avec résumé encodé en URL (optionnel)
- **Implémentation détaillée :** voir `claude_code_integration_prompt.md`

---

## 🗂️ Structure de Fichiers Suggérée

```
/test-elements/
  ├── index.html
  ├── data/
  │   └── elements.json       ← généré par build_elements.py (454 entrées)
  ├── js/
  │   ├── quiz.js             ← sélection + intensité + navigation
  │   ├── score.js            ← calcul pondéré, lecture bardonienne, détection profil
  │   ├── interpretations.js  ← les 32 textes
  │   └── chart.js            ← rendu radar
  ├── css/
  │   └── elements.css
  └── assets/
      └── icons/              ← les 4 illustrations aquarelle du site
```

---

## 📒 Journal des modifications v2 (25/10/2026)

**Règle d'interprétation**
- Ajout de la lecture bardonienne en tête des résultats (dominant blanc / dominant noir / défauts prioritaires / qualité opposée)
- Ajout des trois niveaux d'intensité (groupes de Bardon) et de la pondération 1/2/3
- Ajout du `ratio_ombre` global — sans lui, « Déséquilibre total » et « Qualités abondantes » étaient inatteignables (les parts somment à 100)
- « Équilibre parfait » vérifie désormais forces ET ombres (v1 : forces seules — une ombre concentrée à 80 % sur un élément passait pour un équilibre)
- Deux éléments vides donnent un profil bi-élémentaire, pas « absent » (v1 renvoyait `absent-air` pour un profil Feu+Eau pur)
- Oppositions redéfinies : les deux éléments forts ET sombres (v1 : ombres seules > 40, quasi inatteignable)
- Ajout du quadrant « puissant mais non maîtrisé » (4 textes) — il était dans la table d'interprétation sans texte ni règle
- Garde sur sélection vide (v1 : zéro qualité cochée → « équilibre parfait »)
- Total : 32 textes, tous atteignables (vérifié par simulation) — la v1 annonçait 35 textes mais n'en contenait que 28

**Listes (d'après les attributions explicites de Bardon, Degré I)**
- Feu : + Haineux, Intempérant ; − Suffisant, Présomptueux (→ Air)
- Air : + Suffisant, Présomptueux, Vantard, Prodigue (dépensier), Diligent (qualité) ; − Insolent (→ Eau)
- Eau : + Insolent, Négligent, Froid (émotionnel), Tempérant (qualité) ; − Jalousie (rancœur) (doublon, jalousie = Feu), Nostalgie paralysante (doublon), Mélancolique chronique (→ Terre)
- Terre : + Mélancolie pesante, Sans scrupules, Irrégulier, Misanthrope, Peu fiable, Scrupuleux (qualité) ; − Froid (émotionnel), Négligeant, Négligence (→ Eau), Diligent (→ Air)
- Total : 252 qualités + 202 défauts = 454 entrées (v1 : 447)

**Design**
- Palette alignée sur les illustrations du site (Feu orangé-or, Eau bleu, Air violet, Terre vert) — v1 : Feu rouge, Air jaune
- Composant carte de la page d'accueil repris pour la présentation des éléments ; réutilisation des quatre illustrations existantes

---

## 🔗 Références

- Franz Bardon, *Le Chemin de la Véritable Initiation Magique* (1956, éd. Moryason) — Degré I, « Formation magique de l'âme » ; chapitre VII, « L'âme ou corps astral »
- Franz Bardon, *Initiation into Hermetics* (trad. D. Rüggeberg, 1987) — édition utilisée pour les citations
- Franz Bardon, *Paroles de Maître Arion* + *Le Livre d'Or de la Sagesse* (1997, éd. Moryason)
- Inspiration UX : test chromobioénergétique de coeurdelom.fr

---

*Ce test est un outil de connaissance de soi à des fins spirituelles et personnelles.
Il ne constitue pas un diagnostic psychologique ou médical.*
