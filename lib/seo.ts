import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/lib/i18n';

export const SITE_URL = 'https://coeurdelom.fr';
export const SITE_NAME = "Cœur de l'Om";
export const DEFAULT_OG_IMAGE = '/Coeur-de-lOm-Alpha-Kopie.png';

export const OG_LOCALES: Record<Locale, string> = {
  fr: 'fr_FR',
  de: 'de_DE',
  en: 'en_US',
};

// Practice location (OpenStreetMap geocode of 140 rue Pioch Boutonnet)
export const GEO = { latitude: 43.6214854, longitude: 3.8779717 };

export type PageKey = 'home' | 'about' | 'therapies' | 'why' | 'chromobiotest' | 'contact' | 'blog';

const PAGE_PATHS: Record<PageKey, string> = {
  home: '',
  about: '/about',
  therapies: '/therapies',
  why: '/why',
  chromobiotest: '/chromobiotest',
  contact: '/contact',
  blog: '/blog',
};

// Meta titles/descriptions from the handover Keyword Map & Regional Copy docs
const PAGE_META: Record<PageKey, Record<Locale, { title: string; description: string }>> = {
  home: {
    fr: {
      title: "Cœur de l'Om — Naturopathe et Soins Vibratoires à Montpellier | Valérie Heydlauf",
      description: "Cabinet de naturopathie à Montpellier (quartier Pioch Boutonnet). Soins vibratoires, méditation et Chromobio-Énergie avec Valérie Heydlauf, Heilpraktikerin diplômée depuis plus de 20 ans. Prenez rendez-vous en ligne.",
    },
    de: {
      title: "Cœur de l'Om — Heilpraktikerin und Schwingungstherapie in Montpellier",
      description: "Naturheilpraxis in Montpellier (Stadtviertel Pioch Boutonnet). Schwingungstherapie, Meditation und Chromobio-Energie mit Valérie Heydlauf, diplomierte Heilpraktikerin mit über 20 Jahren Erfahrung. Termin online vereinbaren.",
    },
    en: {
      title: "Cœur de l'Om — Naturopath and Vibratory Healing in Montpellier",
      description: "Naturopathy practice in Montpellier (Pioch Boutonnet district). Vibratory healing, meditation and Chromobio-Energy with Valérie Heydlauf, a certified Heilpraktikerin with over 20 years' experience. Book an appointment online.",
    },
  },
  about: {
    fr: {
      title: "Qui suis-je ? Valérie Heydlauf, Naturopathe à Montpellier | Cœur de l'Om",
      description: "Valérie Heydlauf, Heilpraktikerin diplômée en Allemagne depuis 2004, exerce à Montpellier. Spécialiste en Chromobio-Énergie et soins vibratoires, plus de 20 ans d'expérience en naturopathie holistique.",
    },
    de: {
      title: "Wer bin ich? Valérie Heydlauf, Heilpraktikerin in Montpellier | Cœur de l'Om",
      description: "Valérie Heydlauf, diplomierte Heilpraktikerin seit 2004, praktiziert in Montpellier. Spezialisiert auf Chromobio-Energie und Schwingungstherapie, über 20 Jahre Erfahrung in ganzheitlicher Naturheilkunde.",
    },
    en: {
      title: "About Valérie Heydlauf, Naturopath in Montpellier | Cœur de l'Om",
      description: "Valérie Heydlauf, a certified Heilpraktikerin since 2004, practises in Montpellier. Specialising in Chromobio-Energy and vibratory healing, with over 20 years of experience in holistic naturopathy.",
    },
  },
  therapies: {
    fr: {
      title: "Soins Vibratoires et Énergétiques à Montpellier | Cœur de l'Om",
      description: "Reiki, chromothérapie, médecine traditionnelle chinoise, Feng Shui et tambour chamanique à Montpellier. Découvrez les soins vibratoires et énergétiques proposés par Cœur de l'Om.",
    },
    de: {
      title: "Schwingungstherapie und Energiebehandlungen in Montpellier | Cœur de l'Om",
      description: "Reiki, Chromotherapie, Traditionelle Chinesische Medizin, Feng-Shui-Beratung und schamanische Trommel in Montpellier. Entdecken Sie die Schwingungstherapie von Cœur de l'Om.",
    },
    en: {
      title: "Vibratory Healing and Energy Therapies in Montpellier | Cœur de l'Om",
      description: "Reiki, chromotherapy, Traditional Chinese Medicine, Feng Shui consultations and shamanic drum sessions in Montpellier. Discover the vibratory healing therapies offered at Cœur de l'Om.",
    },
  },
  why: {
    fr: {
      title: "Pourquoi Consulter un Naturopathe à Montpellier ? | Cœur de l'Om",
      description: "Découvrez les bienfaits des soins énergétiques et d'une approche holistique du bien-être avec Cœur de l'Om, cabinet de naturopathie à Montpellier.",
    },
    de: {
      title: "Vorteile der Naturheilkunde in Montpellier | Cœur de l'Om",
      description: "Erfahren Sie, wie Schwingungstherapie wirkt und warum ein ganzheitlicher Ansatz Ihr Wohlbefinden stärkt. Naturheilpraxis Cœur de l'Om in Montpellier.",
    },
    en: {
      title: "Benefits of Naturopathy in Montpellier | Cœur de l'Om",
      description: "Discover how energy healing works and why a holistic approach supports lasting wellbeing. Naturopathy practice Cœur de l'Om in Montpellier.",
    },
  },
  chromobiotest: {
    fr: {
      title: "ChromobioTest — Bilan Chromobio-Énergie à Montpellier | Cœur de l'Om",
      description: "Réalisez votre bilan énergétique en couleur avec le ChromobioTest, méthode de chromothérapie en trois dimensions proposée à Montpellier par Cœur de l'Om.",
    },
    de: {
      title: "Chromobio-Energie-Test in Montpellier | Cœur de l'Om",
      description: "Erstellen Sie Ihre Farbtherapie-Bilanz mit dem Chromobio-Energie-Test, einer dreidimensionalen Chromotherapie-Methode der Praxis Cœur de l'Om in Montpellier.",
    },
    en: {
      title: "Chromobio-Energy Test in Montpellier | Cœur de l'Om",
      description: "Get your colour therapy assessment with the Chromobio-Energy test, a three-dimensional chromotherapy method offered at Cœur de l'Om in Montpellier.",
    },
  },
  contact: {
    fr: {
      title: "Prendre Rendez-vous à Montpellier | Cœur de l'Om",
      description: "Réservez votre consultation de naturopathie, soins vibratoires ou méditation au cabinet Cœur de l'Om, 140 rue Pioch Boutonnet à Montpellier. Réservation en ligne disponible.",
    },
    de: {
      title: "Termin in Montpellier vereinbaren | Cœur de l'Om",
      description: "Vereinbaren Sie Ihren Termin für Naturheilkunde, Schwingungstherapie oder Meditation in der Praxis Cœur de l'Om, 140 rue Pioch Boutonnet in Montpellier. Online-Buchung verfügbar.",
    },
    en: {
      title: "Book an Appointment in Montpellier | Cœur de l'Om",
      description: "Book your naturopathy, vibratory healing or meditation consultation at Cœur de l'Om, 140 rue Pioch Boutonnet in Montpellier. Online booking available.",
    },
  },
  // Not covered by the handover docs
  blog: {
    fr: {
      title: "Blog Naturopathie, Bien-être et Spiritualité | Cœur de l'Om",
      description: "Articles et conseils sur la naturopathie, les soins énergétiques, la méditation et le bien-être holistique, par Cœur de l'Om, cabinet de naturopathie à Montpellier.",
    },
    de: {
      title: "Blog über Naturheilkunde, Wohlbefinden und Spiritualität | Cœur de l'Om",
      description: "Artikel und Tipps zu Naturheilkunde, Energiebehandlungen, Meditation und ganzheitlichem Wohlbefinden von Cœur de l'Om, Naturheilpraxis in Montpellier.",
    },
    en: {
      title: "Naturopathy, Wellbeing and Spirituality Blog | Cœur de l'Om",
      description: "Articles and advice on naturopathy, energy healing, meditation and holistic wellbeing from Cœur de l'Om, a naturopathy practice in Montpellier.",
    },
  },
};

export function toLocale(lang: string): Locale {
  return (locales as readonly string[]).includes(lang) ? (lang as Locale) : defaultLocale;
}

// Canonical + hreflang alternates (incl. x-default) for a path that exists in every language
export function languageAlternates(lang: string, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`;
  return { canonical: `${SITE_URL}/${toLocale(lang)}${path}`, languages };
}

// Open Graph block with the correct per-language locale. Child pages must always pass
// this, because Next.js replaces (not merges) the layout's openGraph object.
export function openGraphFor(
  lang: string,
  path: string,
  { title, description, images = [DEFAULT_OG_IMAGE], type = 'website' }:
    { title: string; description: string; images?: string[]; type?: 'website' | 'article' }
): Metadata['openGraph'] {
  const locale = toLocale(lang);
  return {
    type,
    locale: OG_LOCALES[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
    url: `${SITE_URL}/${locale}${path}`,
    siteName: SITE_NAME,
    title,
    description,
    images,
  };
}

export function pageMetadata(lang: string, page: PageKey, images?: string[]): Metadata {
  const path = PAGE_PATHS[page];
  const { title, description } = PAGE_META[page][toLocale(lang)];
  return {
    // Titles already carry the brand, so bypass the layout's "%s | Cœur de l'Om" template
    title: { absolute: title },
    description,
    alternates: languageAlternates(lang, path),
    openGraph: openGraphFor(lang, path, { title, description, images }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images ?? [DEFAULT_OG_IMAGE],
    },
  };
}
