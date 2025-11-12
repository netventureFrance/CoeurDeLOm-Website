# Coeur de l'OM 🌟

A modern, multilingual wellness website built with Next.js, Tailwind CSS, and Airtable.

## 🌍 Languages

- 🇫🇷 French (default)
- 🇩🇪 German
- 🇬🇧 English

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Set up Airtable (see docs/AIRTABLE_SETUP.md)
cp .env.example .env.local
# Add your AIRTABLE_API_KEY and AIRTABLE_BASE_ID

# Run development server
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

All documentation is in the `/docs` folder:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 3 steps
- **[Full Setup Guide](docs/SETUP.md)** - Complete installation instructions
- **[Airtable Setup](docs/AIRTABLE_SETUP.md)** - Configure your CMS
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - What's been built

## 🚀 Deploy to Netlify

```bash
git push
```

Netlify will automatically deploy! Just configure:
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

## 📂 Structure

```
CoeurDeLOm-Website/
├── app/              # Next.js pages
├── components/       # React components
├── lib/              # Airtable & i18n
├── docs/             # Documentation
└── wordpress-backup/ # Old WordPress files (reference)
```

## 🎨 Features

✅ Multilingual (FR/DE/EN) with auto-detection
✅ Airtable CMS integration
✅ Blog system with categories
✅ Contact forms
✅ Cal.com calendar integration
✅ SEO optimized
✅ Fully responsive

## 📞 Support

**Email:** y.heydlauf@netventure.tv
**GitHub:** https://github.com/netventureFrance/CoeurDeLOm-Website

---

© 2025 Coeur de l'OM. All rights reserved.
