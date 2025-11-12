import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://coeurdelom.fr'
  const languages = ['fr', 'de', 'en']

  // Static pages
  const pages = [
    '',
    '/about',
    '/therapies',
    '/contact',
    '/blog',
  ]

  // Generate URLs for all languages
  const urls: MetadataRoute.Sitemap = []

  languages.forEach((lang) => {
    pages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${lang}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' || page === '/blog' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/about' || page === '/therapies' ? 0.9 : 0.8,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr${page}`,
            de: `${baseUrl}/de${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      })
    })
  })

  return urls
}
