# PROMPT POUR CODE — Test d'Équilibre des 4 Éléments (Franz Bardon)
**Destinataire :** CODE (développeur de www.coeurdelom.fr)
**Inspiration :** Test chromobioénergétique — même logique d'auto-évaluation intuitive
**Référence ésotérique :** Franz Bardon, *Le Chemin de la Véritable Initiation Magique* (1956)

---

## 🎯 Objectif

Créer un test interactif et visuel permettant à l'utilisateur de **découvrir l'équilibre des 4 Éléments dans sa personnalité** (Feu 🔥, Eau 💧, Air 🌬️, Terre 🌿), à travers deux listes — qualités et défauts — tirées de l'enseignement hermétique de Franz Bardon.

Chaque mot coché est associé à un élément. À la fin, un **profil élémentaire** est généré avec le pourcentage de chaque élément dominant ou déficitaire.

---

## 🌊 Concept & Expérience Utilisateur

### Flux général
```
Accueil → Instructions → Étape 1 (Qualités) → Étape 2 (Défauts) → Résultats → Conseils
```

### Étapes détaillées

#### 🖥️ Accueil
- Titre poétique : *"Quel Élément êtes-vous ?"* ou *"Révélez votre nature profonde"*
- Courte introduction (2–3 lignes) sur les 4 éléments selon Bardon
- Bouton `Commencer l'évaluation`

#### ✨ Étape 1 — Miroir Blanc (Qualités)
- Consigne : *"Cochez les qualités qui vous correspondent sincèrement, sans vous juger"*
- Affichage en grille de mots-étiquettes (tags cliquables)
- Chaque tag change de couleur selon l'élément lorsqu'il est sélectionné
- **Aucune limite de sélection** — cochez autant de qualités que vous vous reconnaissez

#### 🌑 Étape 2 — Miroir Noir (Défauts)
- Consigne : *"Cochez les défauts que vous reconnaissez en vous, avec honnêteté et bienveillance"*
- Même interface en tags
- **Aucune limite de sélection** — cochez autant de défauts que vous vous reconnaissez

#### 📊 Résultats — Profil Élémentaire
- Graphique radar ou camembert des 4 éléments (Feu / Eau / Air / Terre)
- **Score de dominance** (qualités) et **Score d'ombre** (défauts) par élément
- Texte d'interprétation personnalisé selon le profil détecté
- Bouton `Télécharger mon profil` (PDF ou image)
- Bouton `Partager`

---

## 🎨 Design & Identité Visuelle

S'inspirer de l'esthétique du site **coeurdelom.fr** — tons naturels, doux, organiques, typographie élégante, animations fluides.

### Code couleur des 4 Éléments
| Élément | Couleur | Symbolique |
|---------|---------|------------|
| 🔥 Feu  | `#C0392B` → orangé/or | Volonté, action, transformation |
| 💧 Eau  | `#2980B9` → bleu-vert  | Émotion, profondeur, réceptivité |
| 🌬️ Air | `#D4AC0D` → jaune/or  | Intellect, communication, légèreté |
| 🌿 Terre| `#27AE60` → vert/brun | Stabilité, ancrage, matière |

---

## 📋 LISTE COMPLÈTE — Qualités & Défauts par Élément

> Source principale : Franz Bardon, *Le Chemin de la Véritable Initiation Magique*
> Sources complémentaires : *Paroles de Maître Arion*, *Le Livre d'Or de la Sagesse*, communauté bardonnienne francophone
>
> **Note de Bardon :** *"Le tempérament colérique (Feu) présente par sa polarité active : activité, enthousiasme, zèle, résolution, audace, courage, force créatrice. Le sanguin (Air) : pénétration, joie, clarté, vivacité, optimisme. Le mélancolique (Eau) : respect, charité, modestie, dévouement, compassion, profondeur. Le flegmatique (Terre) : persévérance, fermeté, concentration, sobriété, responsabilité, prudence."*

---

### 🔥 ÉLÉMENT FEU — Tempérament Colérique
*Principe actif, masculin, électrique — Volonté, élan vital, pouvoir de transformation*

#### ✅ Qualités — Feu (60)
| # | Qualité | # | Qualité | # | Qualité |
|---|---------|---|---------|---|---------|
| 1 | Actif | 21 | Dynamique | 41 | Passionné |
| 2 | Admirable | 22 | Éblouissant | 42 | Persuasif |
| 3 | Affirmatif | 23 | Éclatant | 43 | Protecteur |
| 4 | Ambitieux | 24 | Encourageant | 44 | Pugnace |
| 5 | Animé | 25 | Énergique | 45 | Résolu |
| 6 | Ardent | 26 | Engagé | 46 | Séduisant |
| 7 | Assertif | 27 | Enthousiaste | 47 | Sportif |
| 8 | Attractif | 28 | Entreprenant | 48 | Stimulant |
| 9 | Audacieux | 29 | Force créatrice | 49 | Stratège |
| 10 | Autoritaire (juste) | 30 | Impliqué | 50 | Sûr de soi |
| 11 | Autonome | 31 | Infatigable | 51 | Talentueux |
| 12 | Aventureux | 32 | Influent | 52 | Unique |
| 13 | Beau | 33 | Inoubliable | 53 | Vaillant |
| 14 | Brave | 34 | Inspiré | 54 | Valeureux |
| 15 | Captivant | 35 | Intrépide | 55 | Vigoureux |
| 16 | Chaleureux | 36 | Leader | 56 | Vivace |
| 17 | Charismatique | 37 | Libéré | 57 | Volontaire |
| 18 | Combatif | 38 | Magistral | 58 | Zèle |
| 19 | Compétitif | 39 | Maître de soi | 59 | Décidé |
| 20 | Courageux | 40 | Passionnant | 60 | Noble |

#### ❌ Défauts — Feu (55)
| # | Défaut | # | Défaut | # | Défaut |
|---|--------|---|--------|---|--------|
| 1 | Abrupt | 20 | Cruel | 39 | Orgueilleux |
| 2 | Accusateur | 21 | Despotique | 40 | Prétentieux |
| 3 | Acerbe | 22 | Dominateur | 41 | Présomptueux |
| 4 | Agressif | 23 | Égocentrique | 42 | Provocateur |
| 5 | Aigri | 24 | Égoïste | 43 | Raciste |
| 6 | Arriviste | 25 | Envahissant | 44 | Râleur |
| 7 | Arrogant | 26 | Envieux | 45 | Revanchard |
| 8 | Autoritaire (abusif) | 27 | Excessif | 46 | Révolté |
| 9 | Bagarreur | 28 | Fanatique | 47 | Stressé |
| 10 | Blessant | 29 | Grossier | 48 | Suffisant |
| 11 | Brute | 30 | Hautain | 49 | Tempétueux |
| 12 | Bruyant | 31 | Humiliant | 50 | Vaniteux |
| 13 | Capricieux | 32 | Impatient | 51 | Vulgaire |
| 14 | Caractériel | 33 | Imprudent | 52 | Coléreux |
| 15 | Carriériste | 34 | Impulsif | 53 | Démesure |
| 16 | Cassant | 35 | Intolérant | 54 | Jaloux |
| 17 | Casse-cou | 36 | Intransigeant | 55 | Irritable |
| 18 | Colère | 37 | Méprisant | | |
| 19 | Colérique | 38 | Narcissique | | |

---

### 💧 ÉLÉMENT EAU — Tempérament Mélancolique
*Principe réceptif, féminin, magnétique — Émotion, profondeur, amour, intuition*

#### ✅ Qualités — Eau (60)
| # | Qualité | # | Qualité | # | Qualité |
|---|---------|---|---------|---|---------|
| 1 | À l'écoute | 21 | Compréhensif | 41 | Ouverture à autrui |
| 2 | Accueillant | 22 | Conciliant | 42 | Pacificateur |
| 3 | Adorable | 23 | Cordial | 43 | Pacifique |
| 4 | Affectueux | 24 | Délicat | 44 | Paisible |
| 5 | Aidant | 25 | Délicatesse | 45 | Patient |
| 6 | Aimable | 26 | Détendu | 46 | Prévenant |
| 7 | Aimant | 27 | Dévoué | 47 | Propension à pardonner |
| 8 | Apaisant | 28 | Douceur | 48 | Pur |
| 9 | Ardeur affective | 29 | Émouvant | 49 | Rassurant |
| 10 | Attachant | 30 | Empathique | 50 | Réceptif |
| 11 | Attentionné | 31 | Galant | 51 | Réconfortant |
| 12 | Bienfaisant | 32 | Humble | 52 | Reconnaissant |
| 13 | Bienveillant | 33 | Indulgent | 53 | Romantique |
| 14 | Bon | 34 | Intuitif | 54 | Sage |
| 15 | Câlin | 35 | Loyal (affectif) | 55 | Sensible |
| 16 | Charitable | 36 | Méditatif | 56 | Serein |
| 17 | Clément | 37 | Mignon | 57 | Serviable |
| 18 | Compatissant | 38 | Modeste | 58 | Tendre |
| 19 | Concerné | 39 | Obligeant | 59 | Tranquille (intérieure) |
| 20 | Complaisant | 40 | Ouvert (cœur) | 60 | Zen |

#### ❌ Défauts — Eau (50)
| # | Défaut | # | Défaut | # | Défaut |
|---|--------|---|--------|---|--------|
| 1 | Angoissé | 18 | Instabilité émotionnelle | 35 | Possessif |
| 2 | Anxieux | 19 | Jalousie (rancœur) | 36 | Rancunier |
| 3 | Apathie | 20 | Laxiste | 37 | Résigné |
| 4 | Boudeur | 21 | Lunatique | 38 | Rêveur excessif |
| 5 | Catastrophiste | 22 | Mal à l'aise | 39 | Sensiblerie |
| 6 | Complexé | 23 | Mélancolique chronique | 40 | Solitaire (repli) |
| 7 | Crédule | 24 | Naïf | 41 | Sombre |
| 8 | Défaitiste | 25 | Nostalgique paralysant | 42 | Susceptible |
| 9 | Dépendance affective | 26 | Paresseux (inertie) | 43 | Timide (excessif) |
| 10 | Dépression | 27 | Passif | 44 | Triste |
| 11 | Distrait (rêverie) | 28 | Peureux | 45 | Hypersensible |
| 12 | Docile (soumission) | 29 | Plaintif | 46 | Indécis |
| 13 | Émotif excessif | 30 | Apitoiement sur soi | 47 | Influençable |
| 14 | Fainéant (torpeur) | 31 | Paresse spirituelle | 48 | Irrespect (eau négatif) |
| 15 | Hésitant | 32 | Renfermé (émotionnel) | 49 | Indolent |
| 16 | Indifférence froide | 33 | Torpeur | 50 | Nostalgie paralysante |
| 17 | Hypocrisie affective | 34 | Pleurnicheur | | |

---

### 🌬️ ÉLÉMENT AIR — Tempérament Sanguin
*Principe mental, électrique-magnétique — Intelligence, communication, adaptabilité, joie*

#### ✅ Qualités — Air (65)
| # | Qualité | # | Qualité | # | Qualité |
|---|---------|---|---------|---|---------|
| 1 | Abordable | 23 | Éloquent | 45 | Philosophe |
| 2 | Accessible | 24 | Enjoué | 46 | Plaisant |
| 3 | Adroit | 25 | Épanoui | 47 | Polyvalent |
| 4 | Affable | 26 | Habileté | 48 | Positif |
| 5 | Agréable | 27 | Humoristique | 49 | Pétillant |
| 6 | Amical | 28 | Imaginatif | 50 | Raffiné |
| 7 | Amusant | 29 | Indépendant | 51 | Rationnel |
| 8 | Artistique | 30 | Ingénieux | 52 | Réfléchi |
| 9 | Astucieux | 31 | Inventif | 53 | Rusé (positif) |
| 10 | Avenant | 32 | Jovial | 54 | Savant |
| 11 | Brillant | 33 | Joyeux | 55 | Sociable |
| 12 | Chanceux | 34 | Judicieux | 56 | Social |
| 13 | Charmant | 35 | Libre d'esprit | 57 | Souriant |
| 14 | Charmeur | 36 | Logique | 58 | Studieux |
| 15 | Chouette | 37 | Lucide | 59 | Sympathique |
| 16 | Clarté | 38 | Malin (positif) | 60 | Tolérant |
| 17 | Collaborateur | 39 | Naturel | 61 | Vif |
| 18 | Comique | 40 | Nuancé | 62 | Vigilant |
| 19 | Communicatif | 41 | Objectif (mental) | 63 | Vivacité |
| 20 | Curieux | 42 | Original | 64 | Confiance (air) |
| 21 | Diplomate | 43 | Ouvert d'esprit | 65 | Pénétration d'esprit |
| 22 | Drôle | 44 | Optimiste | | |

#### ❌ Défauts — Air (47)
| # | Défaut | # | Défaut | # | Défaut |
|---|--------|---|--------|---|--------|
| 1 | Baratineur | 17 | Indiscret | 33 | Sans gêne |
| 2 | Bavard (excessif) | 18 | Instable (mental) | 34 | Sarcastique |
| 3 | Brouillon | 19 | Irréaliste | 35 | Superficiel |
| 4 | Cachottier | 20 | Irresponsable | 36 | Versatile |
| 5 | Calculateur | 21 | Légèreté irresponsable | 37 | Insolent |
| 6 | Caricatural | 22 | Malhonnête | 38 | Dédain |
| 7 | Caustique | 23 | Maniéré | 39 | Irrévérence |
| 8 | Censeur | 24 | Manipulateur | 40 | Caquetage |
| 9 | Compliqué | 25 | Médisant | 41 | Perfidie |
| 10 | Confus | 26 | Menteur | 42 | Dispersion |
| 11 | Cynique | 27 | Moqueur | 43 | Agitation mentale |
| 12 | Débordé | 28 | Mythomane | 44 | Scepticisme paralysant |
| 13 | Désinvolte | 29 | Nerveux | 45 | Arrogance intellectuelle |
| 14 | Désordonné | 30 | Pédant | 46 | Ruse malveillante |
| 15 | Étourdi | 31 | Puéril | 47 | Rumination |
| 16 | Excentrique | 32 | Mauvaise foi | | |

---

### 🌿 ÉLÉMENT TERRE — Tempérament Flegmatique
*Principe stable, consolidant — Persévérance, ancrage, sens du devoir, matière*

#### ✅ Qualités — Terre (65)
| # | Qualité | # | Qualité | # | Qualité |
|---|---------|---|---------|---|---------|
| 1 | Accompli | 23 | Droit | 45 | Pratique |
| 2 | Appliqué | 24 | Économe | 46 | Précis |
| 3 | Assidu | 25 | Efficace | 47 | Présent |
| 4 | Attentif | 26 | Endurant | 48 | Prévoyant |
| 5 | Authentique | 27 | Ferme | 49 | Productif |
| 6 | Bienséant | 28 | Fiable | 50 | Propre |
| 7 | Bûcheur | 29 | Gravité (sérieux) | 51 | Prudent |
| 8 | Calme (ancré) | 30 | Intègre | 52 | Raisonnable |
| 9 | Capable | 31 | Juste | 53 | Réaliste |
| 10 | Civil | 32 | Loyal (constant) | 54 | Résistant |
| 11 | Cohérent | 33 | Mature | 55 | Respectueux |
| 12 | Concentré | 34 | Méritant | 56 | Responsable |
| 13 | Consciencieux | 35 | Méthodique | 57 | Rigoureux |
| 14 | Conséquent | 36 | Méticuleux | 58 | Sérieux |
| 15 | Constant | 37 | Minutieux | 59 | Sincère |
| 16 | Convenable | 38 | Moral | 60 | Sobre |
| 17 | Courtois | 39 | Objectif (stable) | 61 | Soigneux |
| 18 | Déterminé | 40 | Opiniâtre (juste) | 62 | Solide |
| 19 | Digne | 41 | Organisé | 63 | Stable |
| 20 | Digne de confiance | 42 | Persévérant | 64 | Structuré |
| 21 | Diligent | 43 | Ponctuel | 65 | Tenace |
| 22 | Discipliné | 44 | Pondéré | | |

#### ❌ Défauts — Terre (45)
| # | Défaut | # | Défaut | # | Défaut |
|---|--------|---|--------|---|--------|
| 1 | Amorphe | 16 | Froid (émotionnel) | 31 | Nonchalant |
| 2 | Amateur (négligent) | 17 | Inaccessible | 32 | Obstiné |
| 3 | Assisté | 18 | Incompétent | 33 | Obtus |
| 4 | Avare | 19 | Mal élevé | 34 | Procrastinateur |
| 5 | Blasé | 20 | Maniaque | 35 | Radin |
| 6 | Borné | 21 | Méfiant | 36 | Rétrograde |
| 7 | Conformiste | 22 | Médiocre | 37 | Revêche |
| 8 | Déloyauté | 23 | Mesquin | 38 | Rigide |
| 9 | Entêté | 24 | Mou | 39 | Ringard |
| 10 | Fataliste | 25 | Muet (taciturnité) | 40 | Routinier |
| 11 | Fermeture | 26 | Négligeant | 41 | Soupçonneux |
| 12 | Cupide | 27 | Insatisfait (matériel) | 42 | Strict (abusif) |
| 13 | Peur du changement | 28 | Étroitesse d'esprit | 43 | Tatillon |
| 14 | Défiance | 29 | Matérialisme excessif | 44 | Têtu |
| 15 | Lent (refus d'avancer) | 30 | Négligence | 45 | Égoïsme pratique |

---

## 📊 Récapitulatif des Listes

| Élément | Qualités | Défauts | Total |
|---------|----------|---------|-------|
| 🔥 Feu  | 60 | 55 | 115 |
| 💧 Eau  | 60 | 50 | 110 |
| 🌬️ Air | 65 | 47 | 112 |
| 🌿 Terre| 65 | 45 | 110 |
| **TOTAL** | **250** | **197** | **447 entrées** |

---

## 🧮 Logique de Calcul des Résultats

```
Pour chaque élément E ∈ {Feu, Eau, Air, Terre} :

  score_qualités(E)  = nb de qualités cochées appartenant à E
  score_défauts(E)   = nb de défauts cochés appartenant à E

  force(E)     = score_qualités(E) / total_qualités_cochées × 100
  ombre(E)     = score_défauts(E)  / total_défauts_cochés   × 100
  équilibre(E) = force(E) - ombre(E)
```

### Table d'interprétation
| Résultat | Signification |
|----------|---------------|
| force élevée + ombre faible | Élément **maîtrisé** — ressource consciente |
| force élevée + ombre élevée | Élément **puissant mais non maîtrisé** — énergie brute |
| force faible + ombre élevée | Élément **déséquilibré** — zone de travail prioritaire |
| force faible + ombre faible | Élément **manquant** — à développer et éveiller |

---

## 📝 TEXTES D'INTERPRÉTATION (35 textes)

---

### 1. ÉLÉMENTS SIMPLES — Dominance maîtrisée (4 textes)

#### 🔥 Feu maîtrisé | Force élevée · Ombre faible
> *"Le Feu anime votre être. Vous êtes un moteur pour ceux qui vous entourent, porté par une volonté ardente et un enthousiasme contagieux. Votre courage et votre créativité font de vous un initiateur naturel. Veillez simplement à ne pas consumer ce que vous souhaitez éclairer — la maîtrise du Feu, c'est savoir réchauffer sans brûler."*

#### 💧 Eau maîtrisée | Force élevée · Ombre faible
> *"L'Eau coule en vous avec une sagesse profonde. Votre cœur perçoit ce que les autres ne voient pas encore. Empathie, douceur et intuition sont vos dons naturels. Vous savez aimer, pardonner, et tenir compagnie dans la nuit. Continuez à laisser couler sans vous noyer — votre profondeur est une lumière."*

#### 🌬️ Air maîtrisé | Force élevée · Ombre faible
> *"L'Air habite votre esprit avec clarté. Intelligence, humour et sens de la communication font de vous un pont entre les êtres. Vous savez nommer les choses juste, éclairer une situation d'un seul mot. Ancrez vos idées dans la réalité pour qu'elles portent leurs fruits bien au-delà de vous."*

#### 🌿 Terre maîtrisée | Force élevée · Ombre faible
> *"La Terre vous soutient et vous ancre. Vous êtes le pilier silencieux sur lequel les autres s'appuient sans toujours le savoir. Votre persévérance, votre intégrité et votre sens du devoir sont des ressources rares. Permettez-vous parfois la légèreté de l'Air et l'ardeur du Feu — l'ancrage ne doit pas devenir immobilité."*

---

### 2. ÉLÉMENTS SIMPLES — Déséquilibre dominant (4 textes)

#### 🔥 Feu déséquilibré | Ombre élevée · Force faible
> *"Votre Feu brûle sans direction ni maîtrise. Colère, orgueil et impulsivité signalent une énergie considérable qui n'a pas encore trouvé son axe. Ce n'est pas l'énergie qui manque — c'est le canal. La première étape est de reconnaître ces flammes sans les fuir ni les laisser tout consumer."*

#### 💧 Eau déséquilibrée | Ombre élevée · Force faible
> *"Les profondeurs de l'Eau peuvent devenir des abîmes. Mélancolie, dépendance affective et passivité signalent un monde intérieur riche mais sans mouvement. L'Eau stagnante se corrompt — il vous faut retrouver le courant, accepter le changement, et laisser entrer la lumière dans les zones d'ombre."*

#### 🌬️ Air déséquilibré | Ombre élevée · Force faible
> *"Un Air non maîtrisé disperse et égare. Bavardage, manipulation et instabilité mentale révèlent un intellect brillant qui tourne à vide. La parole sans substance s'évapore. Votre premier exercice est le silence — non pas pour vous taire, mais pour écouter ce que vous dites vraiment."*

#### 🌿 Terre déséquilibrée | Ombre élevée · Force faible
> *"Une Terre trop lourde devient pierre. Rigidité, avarice, entêtement et routine signalent un ancrage devenu prison. Ce qui devait vous soutenir vous paralyse. L'initiation commence précisément là : accepter que le mouvement ne détruit pas — il transforme."*

---

### 3. ÉLÉMENTS MANQUANTS — À éveiller (4 textes)

#### 🔥 Feu absent | Ni force ni ombre
> *"Le Feu est presque inexistant dans votre nature actuelle. Manque de volonté, d'initiative et de confiance en soi peuvent en être les signes. Ce n'est pas une condamnation — c'est une invitation. Le Feu s'allume, il s'apprend. Commencez par un acte courageux, même petit. La flamme naît du frottement."*

#### 💧 Eau absente | Ni force ni ombre
> *"L'Eau est quasi absente de votre paysage intérieur. Une certaine sécheresse émotionnelle, une difficulté à ressentir ou à vous laisser toucher peut en témoigner. Votre chemin passe par l'ouverture du cœur — la méditation, l'art, la nature et la relation authentique sont vos portes d'entrée."*

#### 🌬️ Air absent | Ni force ni ombre
> *"L'Air brille par son absence. Rigidité mentale, difficulté à communiquer ou à voir les choses sous plusieurs angles peuvent en être les symptômes. Cultiver la curiosité, lire, dialoguer, voyager intérieurement — voilà comment raviver ce souffle qui manque encore."*

#### 🌿 Terre absente | Ni force ni ombre
> *"La Terre vous fait défaut. Instabilité, manque de constance, projets inachevés et difficulté à tenir dans la durée en sont souvent les signes. Apprendre à finir ce que l'on commence, à honorer ses engagements, à accepter la lenteur — telle est votre école du moment."*

---

### 4. PROFILS BI-ÉLÉMENTAIRES — Deux éléments dominants (6 textes)

#### 🔥💧 Feu + Eau | Le Volcan et la Source
> *"Vous portez en vous deux forces opposées et complémentaires : la passion du Feu et la profondeur de l'Eau. Vous êtes capable d'une intensité émotionnelle rare, d'un amour ardent et d'une créativité puissante. Mais ces deux éléments se combattent aussi : l'impulsivité contre la sensibilité, la volonté contre l'abandon. Votre chemin est l'alchimie intérieure — transformer la tension en vapeur créatrice."*

#### 🔥🌬️ Feu + Air | La Flamme et le Vent
> *"Feu et Air se nourrissent mutuellement en vous : le Vent attise la Flamme, la Flamme réchauffe l'Air. Enthousiasme, intelligence, éloquence et charisme sont vos armes naturelles. Vous pouvez inspirer, convaincre, transformer les idées en actes. Le risque : s'embraser trop vite, brûler les étapes. L'ancrage dans la Terre vous manque peut-être."*

#### 🔥🌿 Feu + Terre | Le Forgeron
> *"La combinaison Feu et Terre produit l'artisan, le bâtisseur, le guerrier patient. Vous avez à la fois l'élan et la persistance, le courage et la méthode. Vous menez vos projets du début à la fin avec une puissance rare. Veillez à ne pas devenir inflexible — ni la chaleur humaine (Eau) ni la légèreté (Air) ne doivent disparaître de votre vie."*

#### 💧🌬️ Eau + Air | Le Poète
> *"L'union de l'Eau et de l'Air produit une sensibilité fine et une intelligence du cœur. Vous ressentez profondément et vous savez mettre des mots justes sur ce que les autres n'arrivent pas à exprimer. Empathie, créativité et subtilité vous définissent. Attention à la dispersion et au manque d'ancrage : sans Terre ni Feu, les plus belles idées restent dans les nuages."*

#### 💧🌿 Eau + Terre | La Source et le Rocher
> *"Eau et Terre forment en vous une nature profonde, stable et nourricière. Vous êtes un roc pour ceux qui vous entourent : fiable, loyal, attentionné. Votre patience est légendaire, votre dévouement sans faille. Le danger est l'immobilisme et la résignation — sans Feu pour vous propulser ni Air pour vous libérer, vous risquez de vous ensabler dans la routine ou la mélancolie."*

#### 🌬️🌿 Air + Terre | L'Architecte
> *"Air et Terre ensemble font le penseur pragmatique, l'architecte de la réalité. Vous avez à la fois la clarté mentale et le sens concret, la stratégie et l'exécution. Vous construisez des choses solides et cohérentes. Ce qui peut vous manquer : la chaleur du Feu pour vous engager pleinement et la douceur de l'Eau pour toucher les cœurs au-delà des idées."*

---

### 5. PROFILS TRI-ÉLÉMENTAIRES — Un élément fait défaut (4 textes)

#### 🔥💧🌬️ Feu + Eau + Air | Il manque la Terre
> *"Vous êtes riche en intensité, en émotion et en intelligence — mais vous manquez d'ancrage. Vos projets commencent avec passion, vos idées fusent, vos émotions débordent... mais les résultats concrets tardent. La Terre est votre grande leçon : finir, concrétiser, s'engager dans la durée. Sans elle, vous brûlez sans laisser de trace durable."*

#### 🔥💧🌿 Feu + Eau + Terre | Il manque l'Air
> *"Vous avez la passion, la profondeur et la constance — mais la communication et la légèreté vous font défaut. Vous ressentez énormément mais peinez à exprimer, à partager, à vous connecter avec légèreté aux autres. L'Air est votre porte d'ouverture : apprendre à parler de soi, à rire, à laisser entrer de la clarté dans votre monde dense."*

#### 🔥🌬️🌿 Feu + Air + Terre | Il manque l'Eau
> *"Vous avez l'élan, l'intelligence et la solidité — mais votre monde émotionnel est peu habité. Vous agissez, vous pensez, vous construisez, mais vous touchez rarement les cœurs, ni le vôtre ni celui des autres. L'Eau est votre invitation : ralentir, ressentir, s'autoriser la vulnérabilité. C'est là que l'humain en vous attend."*

#### 💧🌬️🌿 Eau + Air + Terre | Il manque le Feu
> *"Vous êtes sensible, intelligent et fiable — mais il vous manque l'étincelle. La volonté, l'audace et l'initiative sont vos zones d'ombre. Vous attendez souvent que les choses viennent à vous plutôt que de les provoquer. Le Feu est votre défi : oser, prendre votre place, agir même sans garantie. La vie récompense ceux qui s'avancent."*

---

### 6. PROFILS SPÉCIAUX (6 textes)

#### ⚖️ Équilibre parfait | Les 4 éléments quasi égaux
> *"Vos quatre éléments sont en harmonie remarquable. Vous portez en vous la chaleur du Feu, la profondeur de l'Eau, la clarté de l'Air et la solidité de la Terre — sans qu'aucun n'écrase les autres. Cette rare équanimité est le but même du travail initiatique selon Bardon. Elle n'est pas figée : continuez à l'observer, à l'entretenir. L'équilibre se maintient par la vigilance, pas par l'inaction."*

#### 🌑 Déséquilibre total | Les ombres dominent partout
> *"Vos quatre miroirs noirs sont chargés. Cela signifie une grande honnêteté de votre part — ou une période de vie particulièrement éprouvante. Ne vous découragez pas : voir clairement ses ombres est déjà un acte courageux. Pour Bardon, c'est précisément le point de départ. Commencez par un seul défaut, un seul élément, et travaillez-le patiemment. La transformation commence par un pas."*

#### ✨ Qualités abondantes | Les forces dominent partout
> *"Vous avez reconnu en vous une grande richesse de qualités dans les quatre éléments. Que ce soit une réalité ou une aspiration profonde, c'est une boussole précieuse. Bardon rappelle cependant que les miroirs doivent être sincères — non pas ce que nous voudrions être, mais ce que nous sommes aujourd'hui. Revenez régulièrement à cette évaluation avec une honnêteté renouvelée."*

#### 🔥💧 Feu et Eau en opposition | Tension intérieure
> *"Feu et Eau s'affrontent en vous avec une intensité particulière — vous êtes tiraillé entre l'action et le repli, la passion et la mélancolie, la domination et la douceur. Ces contradictions peuvent être épuisantes, mais elles sont aussi la marque des natures les plus profondes. La clé : ne pas choisir entre les deux, mais apprendre à les laisser coexister. La vapeur naît de leur rencontre."*

#### 🌬️🌿 Air et Terre en opposition | Tête contre corps
> *"Votre esprit court plus vite que votre corps ne suit, ou l'inverse : vos habitudes pèsent trop pour que vos idées puissent s'envoler. Air veut liberté, Terre veut structure. Vous naviguez entre l'idéal et le possible, entre l'inspiration et l'application. Votre travail : faire dialoguer le rêveur et l'artisan qui vivent en vous."*

#### 🌟 Initiant sincère | Toutes les ombres reconnues, toutes les forces cultivées
> *"Vous avez coché des qualités ET des défauts dans chaque élément, avec équanimité. C'est le profil de celui qui s'observe vraiment — ni complaisant ni trop sévère. Bardon appelle cela l'introspection juste. Vous êtes sur la voie. Le miroir blanc et le miroir noir sont les deux yeux de la conscience. Vous apprenez à voir avec les deux."*

---

## ⚙️ Spécifications Techniques

- **Framework :** adapter au stack existant de coeurdelom.fr
- **Données :** fichier `elements.json` — structure : `{ "id": 1, "label": "Actif", "element": "feu", "type": "qualite" }`
- **Stockage :** aucune donnée personnelle sauvegardée (RGPD) — session locale uniquement
- **Export :** génération image/PDF du profil (html2canvas ou équivalent)
- **Responsive :** mobile-first obligatoire
- **Graphique :** Chart.js ou D3.js — radar chart préféré
- **Animations :** douces et fluides — CSS transitions ou GSAP léger
- **Partage :** bouton copier le lien avec résumé encodé en URL (optionnel)

---

## 🗂️ Structure de Fichiers Suggérée

```
/test-elements/
  ├── index.html
  ├── data/
  │   └── elements.json
  ├── js/
  │   ├── quiz.js           ← logique de sélection + navigation
  │   ├── score.js          ← calcul force / ombre / équilibre + détection profil
  │   └── chart.js          ← rendu radar
  ├── css/
  │   └── elements.css
  └── assets/
      └── icons/            ← SVG des 4 éléments
```

### Logique de détection du profil (score.js)
```javascript
// Priorités de détection (dans l'ordre)
1. Équilibre parfait         → si max(force) - min(force) < 10%
2. Déséquilibre total        → si toutes les ombres > 50%
3. Élément absent            → si force + ombre < 5% pour un élément
4. Opposition Feu/Eau        → si les deux > 40% en ombre
5. Opposition Air/Terre      → si les deux > 40% en ombre
6. Profil tri-élémentaire    → si un élément < 8% en force ET ombre
7. Profil bi-élémentaire     → si deux éléments > 35% en force
8. Élément simple maîtrisé   → si un élément domine en force et faible ombre
9. Élément simple déséquilib.→ si un élément domine en ombre
10. Initiant sincère         → défaut par défaut si équilibre modéré partout
```

---

## 🔗 Références

- Franz Bardon, *Le Chemin de la Véritable Initiation Magique* (1956, éd. Moryason)
- Franz Bardon, *Paroles de Maître Arion* + *Le Livre d'Or de la Sagesse* (1997, éd. Moryason)
- Blog de référence : franzbardonfrabato.blogspot.com
- Inspiration UX : test chromobioénergétique de coeurdelom.fr

---

*Ce test est un outil de connaissance de soi à des fins spirituelles et personnelles.
Il ne constitue pas un diagnostic psychologique ou médical.*
