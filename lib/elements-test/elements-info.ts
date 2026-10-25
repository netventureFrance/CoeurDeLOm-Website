import type { Element } from './score';

// Display info per element. Colours from the brief; illustrations are the /why page cards;
// temperaments and taglines from spec-v2.md (« LISTE COMPLÈTE »).
export const ELEMENT_INFO: Record<Element, {
  nom: string;
  article: string;      // « le Feu », « l'Eau »…
  emoji: string;
  couleur: string;
  clair: string;
  image: string;
  temperament: string;
  principe: string;
}> = {
  feu: {
    nom: 'Feu', article: 'le Feu', emoji: '🔥', couleur: '#E67E22', clair: '#FDEBD0',
    image: '/PourquoiAccompagnement.png', temperament: 'Tempérament colérique',
    principe: 'Principe actif, masculin, électrique — Volonté, élan vital, pouvoir de transformation',
  },
  eau: {
    nom: 'Eau', article: "l'Eau", emoji: '💧', couleur: '#2E86C1', clair: '#D6EAF8',
    image: '/PourquoiExpertiseHolistique.png', temperament: 'Tempérament mélancolique',
    principe: 'Principe réceptif, féminin, magnétique — Émotion, profondeur, amour, intuition',
  },
  air: {
    nom: 'Air', article: "l'Air", emoji: '🌬️', couleur: '#8E44AD', clair: '#E8DAEF',
    image: '/PourquoiCadre%20Guerison.png', temperament: 'Tempérament sanguin',
    principe: 'Principe mental, électrique-magnétique — Intelligence, communication, adaptabilité, joie',
  },
  terre: {
    nom: 'Terre', article: 'la Terre', emoji: '🌿', couleur: '#58A845', clair: '#E1F0D9',
    image: '/PourquoiTechniquesAncestrales.png', temperament: 'Tempérament flegmatique',
    principe: 'Principe stable, consolidant — Persévérance, ancrage, sens du devoir, matière',
  },
};
