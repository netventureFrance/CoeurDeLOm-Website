// Types for score.js (delivered as-is with the 4 Elements test brief — do not modify score.js)

export type Element = 'feu' | 'eau' | 'air' | 'terre';
export type Intensite = 1 | 2 | 3;

export interface Selection {
  id: number;
  intensite: Intensite;
}

export interface ElementEntry {
  id: number;
  label: string;
  element: Element;
  type: 'qualite' | 'defaut';
}

export interface ElementScore {
  force: number;
  ombre: number;
  equilibre: number;
  nbQual: number;
  nbDef: number;
}

export type Scores = Record<Element, ElementScore>;

export interface LectureBardon {
  dominantBlanc: Element | null;
  dominantNoir: Element | null;
  memeElement: boolean;
  defautsPrioritaires: string[];
  qualitesACultiver: string[];
}

export const ELEMENTS: Element[];
export const POIDS: Record<Intensite, number>;

export function computeScores(
  selQual: Selection[],
  selDef: Selection[],
  db: ElementEntry[]
): { scores: Scores; totQ: number; totD: number; ratioOmbre: number };

export function lectureBardon(scores: Scores, selDef: Selection[], db: ElementEntry[]): LectureBardon;

export function detectProfile(scores: Scores, ratioOmbre: number, totQ: number, totD: number): string;

export function evaluate(
  selQual: Selection[],
  selDef: Selection[],
  db: ElementEntry[]
): { scores: Scores; ratioOmbre: number; profil: string; bardon: LectureBardon | null };
