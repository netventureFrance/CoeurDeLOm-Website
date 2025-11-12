# Coeur de l'OM - Multilingual Wellness Website

A modern, multilingual website built with Next.js 15, Tailwind CSS, and Airtable as a headless CMS. Supports French, German, and English.

## Features

- 🌍 **Multilingual Support**: French, German, English with automatic language detection
- 🎨 **Modern Design**: Beautiful gradient colors and smooth animations
- 📱 **Fully Responsive**: Mobile-first design
- 🗂️ **Airtable CMS**: Easy content management through Airtable
- 📝 **Blog System**: Multilingual blog with categories and tags
- 📧 **Contact Forms**: Submissions saved to Airtable
- 📅 **Cal.com Integration**: Online appointment booking
- ⚡ **Performance**: Next.js 15 with App Router for optimal performance
- 🎯 **SEO Optimized**: Multilingual SEO with proper meta tags

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **CMS**: Airtable
- **Animations**: Framer Motion
- **Deployment**: Netlify
- **Calendar**: Cal.com

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Airtable account
- (Optional) A Cal.com account for bookings

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/netventureFrance/CoeurDeLOm-Website.git
cd CoeurDeLOm-Website/site
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Airtable

#### Create Your Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base
2. Create the following tables with these fields:

**Pages Table:**
- Slug (Single line text)
- Title_FR, Title_DE, Title_EN (Single line text)
- Content_FR, Content_DE, Content_EN (Long text)
- Meta_Description_FR, Meta_Description_DE, Meta_Description_EN (Single line text)
- Featured_Image (Attachment)
- Status (Single select: Published, Draft)

**Blog Posts Table:**
- Slug (Single line text)
- Title_FR, Title_DE, Title_EN (Single line text)
- Excerpt_FR, Excerpt_DE, Excerpt_EN (Long text)
- Content_FR, Content_DE, Content_EN (Long text)
- Category (Link to Categories table)
- Tags (Multiple select)
- Featured_Image (Attachment)
- Author (Single line text)
- Published_Date (Date)
- Status (Single select: Published, Draft)

**Categories Table:**
- Slug (Single line text)
- Name_FR, Name_DE, Name_EN (Single line text)
- Color (Single line text) - hex color code

**Contact Submissions Table:**
- Name (Single line text)
- Email (Email)
- Message (Long text)
- Language (Single select: FR, DE, EN)
- Submitted_Date (Date)
- Status (Single select: New, Read, Replied)

**Navigation Table:**
- Label_FR, Label_DE, Label_EN (Single line text)
- URL (Single line text)
- Order (Number)
- Parent (Link to Navigation)

**UI Translations Table:**
- Key (Single line text)
- Text_FR, Text_DE, Text_EN (Single line text)
- Category (Single line text)

**Site Settings Table:**
- Setting_Name (Single line text)
- Value_FR, Value_DE, Value_EN (Single line text)
- Type (Single select: text, image, url)

#### Get Your Airtable Credentials

1. Get your API key from https://airtable.com/account
2. Get your Base ID from the URL when viewing your base: `https://airtable.com/BASE_ID/...`

### 4. Configure Environment Variables

Create a `.env.local` file in the `site` directory:

\`\`\`env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
NEXT_PUBLIC_CAL_COM_USERNAME=your_cal_com_username
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your site!

## Project Structure

\`\`\`
site/
├── app/
│   ├── [lang]/           # Multilingual routes
│   │   ├── page.tsx      # Homepage
│   │   ├── layout.tsx    # Language-specific layout
│   │   ├── contact/      # Contact page
│   │   └── blog/         # Blog pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/
│   ├── Header.tsx        # Site header with navigation
│   ├── Footer.tsx        # Site footer
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── i18n.ts          # i18n configuration
│   ├── airtable.ts      # Airtable API functions
│   └── dictionaries/    # Translation files
├── public/              # Static assets
├── middleware.ts        # Language routing middleware
└── next.config.js       # Next.js configuration
\`\`\`

## Deployment to Netlify

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/netventureFrance/CoeurDeLOm-Website.git
git push -u origin main
\`\`\`

### 2. Deploy on Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `site`
   - **Build command**: `npm run build`
   - **Publish directory**: `site/.next`
5. Add environment variables:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `NEXT_PUBLIC_CAL_COM_USERNAME`
6. Click "Deploy site"

Your site will be live at `https://your-site-name.netlify.app`!

## Customization

### Colors

Edit the color scheme in `tailwind.config.ts`:

\`\`\`typescript
colors: {
  primary: '#271340',
  secondary: '#37244E',
  // Add your custom colors
}
\`\`\`

### Translations

Add or edit translations in `lib/dictionaries/`:
- `fr.json` - French translations
- `de.json` - German translations
- `en.json` - English translations

### Cal.com Integration

Update your Cal.com username in:
1. Environment variable: `NEXT_PUBLIC_CAL_COM_USERNAME`
2. Contact page embed: `app/[lang]/contact/page.tsx`

## Content Management

### Adding a New Page

1. Add a record to the "Pages" table in Airtable
2. Fill in the content for all languages (FR, DE, EN)
3. Set Status to "Published"
4. The page will be automatically available at `/{lang}/{slug}`

### Adding a Blog Post

1. Add a record to the "Blog Posts" table
2. Fill in title, excerpt, content for all languages
3. Select category, tags, and set published date
4. Set Status to "Published"

### Managing Contact Submissions

All form submissions are saved to the "Contact Submissions" table in Airtable where you can:
- View all submissions
- Mark as Read/Replied
- Filter by language
- Export to CSV

## Support

For issues or questions, please open an issue on GitHub or contact: y.heydlauf@netventure.tv

## License

© 2025 Coeur de l'OM. All rights reserved.
