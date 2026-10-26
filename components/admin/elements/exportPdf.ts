import type { Element, LectureBardon, Scores } from '@/lib/elements-test/score';
import { ELEMENTS } from '@/lib/elements-test/score';
import { ELEMENT_INFO } from '@/lib/elements-test/elements-info';
import { INTERPRETATIONS } from '@/lib/elements-test/interpretations';
import { bardonSentences } from './ElementsResults';

interface PdfInput {
  client: string;
  testDate: Date;
  scores: Scores;
  profil: string;
  bardon: LectureBardon;
  radarSvg: SVGSVGElement | null;
  lectureEl: HTMLElement | null;   // rendered in-depth reading (h3 / p / strong)
}

// jsPDF's built-in Helvetica only has WinAnsi (cp1252) glyphs: map arrows to a
// readable equivalent and drop anything else it can't draw (emoji, symbols)
const pdfSafe = (t: string) => t
  .replace(/[→⇒➔⟶]/g, '»')
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
  .replace(/[^\x20-\x7E\xA0-\xFF\n“”‘’–—…•€œŒšŠžŽŸƒˆ˜‰‹›™]/g, '')
  .trim();
// Same, without trimming: text runs sit next to each other inside a paragraph
const pdfSafeRun = (t: string) => {
  const [, lead, core, trail] = t.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return lead + pdfSafe(core) + trail;
};

const rgb = (hex: string): [number, number, number] =>
  [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

async function svgToPng(svg: SVGSVGElement, targetW: number): Promise<string> {
  const vb = svg.viewBox.baseVal;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(vb.width));
  clone.setAttribute('height', String(vb.height));
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = src; });
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = Math.round((vb.height / vb.width) * targetW);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

async function loadImageDataUrl(url: string): Promise<string | null> {
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

export async function exportElementsPdf({ client, testDate, scores, profil, bardon, radarSvg, lectureEl }: PdfInput) {
  const jsPdfMod = await import('jspdf');
  const JsPDF: any = (jsPdfMod as any).default || (jsPdfMod as any).jsPDF;
  const pdf = new JsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
  const W = 210, H = 297, M = 16, CW = W - 2 * M, bottomY = H - 18;
  const TITRE = rgb('#2C1B5E'), TEXTE: [number, number, number] = [60, 60, 60];
  let y = M;

  const ensure = (h: number) => { if (y + h > bottomY) { pdf.addPage(); y = M; } };
  const heading = (t: string) => {
    ensure(14);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13); pdf.setTextColor(...TITRE);
    pdf.text(t, M, y); y += 7;
  };
  const para = (t: string, opts: { bold?: boolean; italic?: boolean; color?: [number, number, number]; size?: number } = {}) => {
    const size = opts.size ?? 10.5;
    pdf.setFont('helvetica', opts.bold ? 'bold' : opts.italic ? 'italic' : 'normal');
    pdf.setFontSize(size); pdf.setTextColor(...(opts.color ?? TEXTE));
    const lh = size * 0.5;
    for (const line of pdf.splitTextToSize(t, CW)) { ensure(lh); pdf.text(line, M, y); y += lh; }
    y += 2;
  };
  const chips = (labels: string[], e: Element, solid: boolean) => {
    const { couleur, clair } = ELEMENT_INFO[e];
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5);
    let x = M;
    ensure(8);
    for (const l of labels) {
      const w = pdf.getTextWidth(l) + 6;
      if (x + w > M + CW) { x = M; y += 8; ensure(8); }
      pdf.setFillColor(...rgb(solid ? couleur : clair));
      pdf.roundedRect(x, y - 4.5, w, 6.5, 3, 3, 'F');
      pdf.setTextColor(...(solid ? [255, 255, 255] as [number, number, number] : rgb(couleur)));
      pdf.text(l, x + 3, y);
      x += w + 2.5;
    }
    y += 9;
  };

  // Header
  const logo = await loadImageDataUrl('/Coeur-de-lOm-Alpha-Kopie.png');
  if (logo) pdf.addImage(logo, 'PNG', M, y - 2, 16, 16, undefined, 'FAST');
  const tx = logo ? M + 20 : M;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(17); pdf.setTextColor(...TITRE);
  pdf.text('Bilan des 4 Éléments', tx, y + 5);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(110, 110, 110);
  pdf.text(`${client} · ${testDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, tx, y + 11);
  y += 24;

  // 1. Lecture selon Bardon
  const { blanc, noir, synthese } = bardonSentences(bardon);
  heading('Lecture selon Bardon');
  para(blanc);
  para(noir);
  if (synthese) para(synthese, { bold: true, color: TITRE });
  if (bardon.dominantNoir && bardon.defautsPrioritaires.length) {
    y += 1; para('Défauts à travailler en premier', { bold: true, color: TITRE });
    chips(bardon.defautsPrioritaires, bardon.dominantNoir, true);
  }
  if (bardon.dominantNoir && bardon.qualitesACultiver.length) {
    para('Qualités à cultiver en regard (même élément, polarité positive)', { bold: true, color: TITRE });
    chips(bardon.qualitesACultiver, bardon.dominantNoir, false);
  }

  // In-depth reading, as real text: word-wrapped runs keep <strong> in bold
  if (lectureEl) {
    y += 2;
    heading('Lecture approfondie');
    const runs = (node: HTMLElement) => {
      const out: { t: string; b: boolean }[] = [];
      node.childNodes.forEach((ch) => {
        if (ch.nodeType === 3) out.push({ t: pdfSafeRun(ch.textContent || ''), b: false });
        else out.push({ t: pdfSafeRun(ch.textContent || ''), b: (ch as HTMLElement).tagName.toLowerCase() === 'strong' });
      });
      return out;
    };
    const drawRuns = (tokens: { t: string; b: boolean }[], size: number, color: [number, number, number], boldColor: [number, number, number]) => {
      const lh = size * 0.5;
      pdf.setFontSize(size);
      let x = M;
      ensure(lh);
      for (const tok of tokens) {
        for (const w of tok.t.split(/(\s+)/)) {
          if (!w) continue;
          const isSpace = /^\s+$/.test(w);
          pdf.setFont('helvetica', tok.b ? 'bold' : 'normal');
          const ww = pdf.getTextWidth(w);
          if (!isSpace && x > M && x + ww > M + CW) { y += lh; x = M; ensure(lh); }
          if (isSpace && x === M) continue;
          pdf.setTextColor(...(tok.b ? boldColor : color));
          pdf.text(w, x, y);
          x += ww;
        }
      }
      y += lh + 2;
    };
    for (const node of Array.from(lectureEl.children) as HTMLElement[]) {
      const text = pdfSafe(node.textContent || '');
      if (!text) continue;
      if (node.tagName.toLowerCase() === 'h3') {
        y += 2; ensure(14);
        drawRuns([{ t: text, b: true }], 11.5, TITRE, TITRE);
      } else {
        drawRuns(runs(node), 10.5, TEXTE, TITRE);
      }
    }
  }

  // 2. Radar + 3. Scores, side by side
  y += 2;
  heading('Force et Ombre des quatre éléments');
  const radarW = 80;
  ensure(radarW);
  const top = y;
  if (radarSvg) pdf.addImage(await svgToPng(radarSvg, 900), 'PNG', M, top, radarW, radarW, undefined, 'FAST');
  const colX = [M + radarW + 8, M + radarW + 40, M + radarW + 62, M + CW];
  let ty = top + 22;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...TITRE);
  pdf.text('Élément', colX[0], ty);
  pdf.text('Force', colX[1] + 14, ty, { align: 'right' });
  pdf.text('Ombre', colX[2] + 14, ty, { align: 'right' });
  pdf.text('Équilibre', colX[3], ty, { align: 'right' });
  pdf.setDrawColor(220, 220, 225); pdf.line(colX[0], ty + 2.5, colX[3], ty + 2.5);
  pdf.setFont('helvetica', 'normal');
  const n = (v: number) => v.toFixed(1).replace('.', ',');
  for (const e of ELEMENTS) {
    ty += 8;
    pdf.setFillColor(...rgb(ELEMENT_INFO[e].couleur)); pdf.circle(colX[0] + 1.5, ty - 1.3, 1.5, 'F');
    pdf.setTextColor(...TEXTE);
    pdf.text(ELEMENT_INFO[e].nom, colX[0] + 5, ty);
    pdf.text(`${n(scores[e].force)} %`, colX[1] + 14, ty, { align: 'right' });
    pdf.text(`${n(scores[e].ombre)} %`, colX[2] + 14, ty, { align: 'right' });
    const eq = scores[e].equilibre;
    pdf.setTextColor(...(eq >= 0 ? [47, 125, 50] as [number, number, number] : [178, 59, 59] as [number, number, number]));
    pdf.text(`${eq >= 0 ? '+' : ''}${n(eq)}`, colX[3], ty, { align: 'right' });
  }
  y = top + radarW + 6;

  // 4. Profil
  const texte = INTERPRETATIONS[profil];
  if (texte) {
    ensure(40);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(150, 150, 150);
    pdf.text("PROFIL ÉLÉMENTAIRE · LECTURE COMPLÉMENTAIRE CŒUR DE L'OM", M, y); y += 6;
    const startY = y - 4;
    para(pdfSafe(texte.titre), { bold: true, size: 13, color: rgb(texte.couleur) });
    para(texte.sousTitre, { size: 9.5, color: [120, 120, 120] });
    para(`« ${texte.texte} »`, { italic: true });
    pdf.setFillColor(...rgb(texte.couleur)); pdf.rect(M - 5, startY, 1.6, y - startY - 2, 'F');
  }

  // Footer on every page
  const total = pdf.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(...TITRE); pdf.setLineWidth(0.3); pdf.line(M, H - 12, W - M, H - 12);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(120, 120, 120);
    pdf.text("Valérie Jourdan · Cœur de l'Om · contact@coeurdelom.fr · coeurdelom.fr", M, H - 8);
    pdf.text(`Page ${p}/${total}`, W - M, H - 8, { align: 'right' });
  }
  pdf.save(`bilan-4-elements-${client.trim().replace(/\s+/g, '_') || 'client'}.pdf`);
}
