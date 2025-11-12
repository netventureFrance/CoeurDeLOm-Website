# Quick Start Guide 🚀

## Directory Structure (Clean!)

```
CoeurDeLOm-Website/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Airtable & i18n
├── wordpress-backup/       # Old WordPress files (reference only)
├── package.json            # Dependencies
├── README.md              # Full setup guide
├── AIRTABLE_SETUP.md      # Airtable guide
└── .env.example           # Environment template
```

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd CoeurDeLOm-Website
npm install
```

### 2️⃣ Set Up Airtable
1. Create Airtable account at https://airtable.com
2. Follow the detailed guide in `AIRTABLE_SETUP.md`
3. Create `.env.local` with your credentials:
```env
AIRTABLE_API_KEY=your_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

### 3️⃣ Run Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

## Deploy to Netlify

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Then on Netlify:
# 1. Import repository
# 2. Build command: npm run build
# 3. Publish directory: .next
# 4. Add environment variables
# 5. Deploy!
```

## File Locations

- **Main site code**: Root directory
- **WordPress backup**: `wordpress-backup/` folder
- **Documentation**:
  - `README.md` - Complete guide
  - `AIRTABLE_SETUP.md` - CMS setup
  - `PROJECT_SUMMARY.md` - What's been built

## Languages

Site supports 3 languages:
- 🇫🇷 French (default): `/fr/`
- 🇩🇪 German: `/de/`
- 🇬🇧 English: `/en/`

## Need Help?

📖 Read `README.md` for full setup instructions
📧 Contact: y.heydlauf@netventure.tv
