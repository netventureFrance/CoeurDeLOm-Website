export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://coeurdelom.fr/#organization",
        "name": "Cœur de l'OM",
        "alternateName": "Coeur de l'OM",
        "url": "https://coeurdelom.fr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://coeurdelom.fr/Coeur-de-lOm-Alpha-Kopie.png",
          "width": 512,
          "height": 512
        },
        "image": [
          "https://coeurdelom.fr/Coeur-de-lOm-Alpha-Kopie.png",
          "https://coeurdelom.fr/Val-1.png"
        ],
        "description": "Cabinet de naturopathie, soins vibratoires et méditation. Valérie Heydlauf, Heilpraktikerin diplômée en Allemagne, spécialisée en Chromobio-Énergie.",
        "email": "contact@coeurdelom.fr",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "FR",
          "addressLocality": "France"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "addressCountry": "FR"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        },
        "priceRange": "€€",
        "servedCuisine": [],
        "founder": {
          "@type": "Person",
          "name": "Valérie Heydlauf",
          "jobTitle": "Heilpraktikerin",
          "description": "Naturopathe diplômée en Allemagne (Heilpraktikerin), spécialisée en Chromobio-Énergie et soins vibratoires depuis plus de 20 ans.",
          "image": "https://coeurdelom.fr/Val-1.png",
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Formation Heilpraktikerin - Allemagne"
          },
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "name": "Heilpraktikerin",
              "dateCreated": "2004",
              "credentialCategory": "Diplôme"
            },
            {
              "@type": "EducationalOccupationalCredential",
              "name": "Chromobio-Énergie",
              "educationalLevel": "Formation Spécialisée"
            }
          ]
        },
        "areaServed": {
          "@type": "Country",
          "name": "France"
        },
        "sameAs": [
          "https://facebook.com/coeurdelom",
          "https://instagram.com/coeurdelom"
        ]
      },
      {
        "@type": "MedicalBusiness",
        "@id": "https://coeurdelom.fr/#medicalbusiness",
        "name": "Cœur de l'OM - Cabinet de Naturopathie",
        "url": "https://coeurdelom.fr",
        "medicalSpecialty": [
          "Naturopathie",
          "Soins Énergétiques",
          "Chromobio-Énergie",
          "Méditation"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services de Bien-être",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Naturopathie",
                "description": "Soins naturels pour harmoniser le corps et l'esprit. Heilpraktikerin diplômée."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Soins Vibratoires",
                "description": "Soins énergétiques pour libérer les tensions et favoriser la circulation de l'énergie."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Chromobio-Énergie",
                "description": "Thérapie énergétique utilisant les couleurs et les fréquences vibratoires."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Méditation Guidée",
                "description": "Séances de méditation pour retrouver le calme intérieur et la clarté mentale."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Reiki",
                "description": "Thérapie énergétique japonaise pour favoriser la guérison holistique."
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://coeurdelom.fr/#website",
        "url": "https://coeurdelom.fr",
        "name": "Cœur de l'OM",
        "description": "Site officiel de Cœur de l'OM - Naturopathie, Soins Vibratoires et Méditation",
        "inLanguage": ["fr-FR", "de-DE", "en-US"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://coeurdelom.fr/fr/blog?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
