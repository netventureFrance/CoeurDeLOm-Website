export const locales = ['fr', 'de', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export interface Dictionary {
  [key: string]: string | string[] | Dictionary | Dictionary[]
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import('@/lib/dictionaries/fr.json').then((module) => module.default),
  de: () => import('@/lib/dictionaries/de.json').then((module) => module.default),
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    return dictionaries[defaultLocale]()
  }
  return dictionaries[locale]()
}

export const getLocaleLabel = (locale: Locale): string => {
  const labels: Record<Locale, string> = {
    fr: 'Français',
    de: 'Deutsch',
    en: 'English',
  }
  return labels[locale]
}
