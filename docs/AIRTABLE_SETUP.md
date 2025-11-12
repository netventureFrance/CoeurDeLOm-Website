# Airtable Setup Guide

This guide will help you set up your Airtable base for the Coeur de l'OM website.

## Step 1: Create a New Base

1. Go to https://airtable.com
2. Sign in or create an account
3. Click "Add a base" → "Start from scratch"
4. Name it "CoeurDeLOm Website"

## Step 2: Create Tables

### Table 1: Pages

**Fields:**
1. `Slug` - Single line text (e.g., "home", "therapies")
2. `Title_FR` - Single line text
3. `Title_DE` - Single line text
4. `Title_EN` - Single line text
5. `Content_FR` - Long text
6. `Content_DE` - Long text
7. `Content_EN` - Long text
8. `Meta_Description_FR` - Single line text
9. `Meta_Description_DE` - Single line text
10. `Meta_Description_EN` - Single line text
11. `Featured_Image` - Attachment
12. `Status` - Single select (Options: "Published", "Draft")

**Sample Record:**
- Slug: `home`
- Title_FR: `Accueil`
- Title_DE: `Startseite`
- Title_EN: `Home`
- Content_FR: `Bienvenue sur Coeur de l'OM...`
- Status: `Published`

### Table 2: Blog Posts

**Fields:**
1. `Slug` - Single line text
2. `Title_FR` - Single line text
3. `Title_DE` - Single line text
4. `Title_EN` - Single line text
5. `Excerpt_FR` - Long text
6. `Excerpt_DE` - Long text
7. `Excerpt_EN` - Long text
8. `Content_FR` - Long text
9. `Content_DE` - Long text
10. `Content_EN` - Long text
11. `Category` - Link to another record (Categories table)
12. `Tags` - Multiple select (Options: Create as needed)
13. `Featured_Image` - Attachment
14. `Author` - Single line text
15. `Published_Date` - Date
16. `Status` - Single select (Options: "Published", "Draft")

**Sample Tags:**
- Méditation
- Spiritualité
- Thérapies Douces
- Astrosanté
- Psychologie

### Table 3: Categories

**Fields:**
1. `Slug` - Single line text
2. `Name_FR` - Single line text
3. `Name_DE` - Single line text
4. `Name_EN` - Single line text
5. `Color` - Single line text (hex color, e.g., "#001df9")

**Sample Records:**
| Slug | Name_FR | Name_DE | Name_EN | Color |
|------|---------|---------|---------|-------|
| meditation | Méditation | Meditation | Meditation | #001df9 |
| spiritualite | Spiritualité | Spiritualität | Spirituality | #dbb5ff |
| therapies-douces | Thérapies Douces | Sanfte Therapien | Gentle Therapies | #37EB48 |
| psychologie | Psychologie | Psychologie | Psychology | #E9427A |
| astrosante | Astrosanté | Astrogesundheit | Astrohealth | #F7C14B |

### Table 4: Contact Submissions

**Fields:**
1. `Name` - Single line text
2. `Email` - Email
3. `Message` - Long text
4. `Language` - Single select (Options: "FR", "DE", "EN")
5. `Submitted_Date` - Date (with time)
6. `Status` - Single select (Options: "New", "Read", "Replied")

### Table 5: Navigation

**Fields:**
1. `Label_FR` - Single line text
2. `Label_DE` - Single line text
3. `Label_EN` - Single line text
4. `URL` - Single line text
5. `Order` - Number
6. `Parent` - Link to another record (Navigation table)

**Sample Records:**
| Label_FR | Label_DE | Label_EN | URL | Order |
|----------|----------|----------|-----|-------|
| Accueil | Startseite | Home | / | 1 |
| Qui suis-je? | Über mich | About Me | /about | 2 |
| Soins | Behandlungen | Therapies | /therapies | 3 |
| Blog | Blog | Blog | /blog | 4 |
| Contact | Kontakt | Contact | /contact | 5 |

### Table 6: UI Translations

**Fields:**
1. `Key` - Single line text
2. `Text_FR` - Single line text
3. `Text_DE` - Single line text
4. `Text_EN` - Single line text
5. `Category` - Single line text

**Sample Records:**
| Key | Text_FR | Text_DE | Text_EN | Category |
|-----|---------|---------|---------|----------|
| contact.submit | Envoyer | Senden | Send | forms |
| blog.read_more | Lire la suite | Weiterlesen | Read more | blog |
| common.loading | Chargement... | Laden... | Loading... | common |

### Table 7: Site Settings

**Fields:**
1. `Setting_Name` - Single line text
2. `Value_FR` - Single line text
3. `Value_DE` - Single line text
4. `Value_EN` - Single line text
5. `Type` - Single select (Options: "text", "image", "url")

**Sample Records:**
| Setting_Name | Value_FR | Value_DE | Value_EN | Type |
|--------------|----------|----------|----------|------|
| site_title | Coeur de l'OM | Coeur de l'OM | Coeur de l'OM | text |
| tagline | Bien-être et spiritualité | Wellness und Spiritualität | Wellness and Spirituality | text |

## Step 3: Import Content from WordPress

You can manually copy content from your WordPress export XML to Airtable:

1. Open your WordPress export: `coeurdel039om.WordPress.2025-11-11.xml`
2. Find blog posts in the XML
3. Copy the titles and content
4. Paste into the appropriate Airtable fields

**Tip:** Use a tool like [xmltojson.com](https://www.xmltojson.com/) to convert the WordPress XML to JSON for easier viewing.

## Step 4: Get Your Airtable Credentials

### API Key:
1. Go to https://airtable.com/account
2. Click "Generate API key"
3. Copy your API key

### Base ID:
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/BASE_ID/...`
3. The BASE_ID is the part that starts with `app...`
4. Copy this ID

## Step 5: Add to Environment Variables

Create a `.env.local` file in your `site` directory:

\`\`\`
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
\`\`\`

## Step 6: Test the Connection

Run your Next.js dev server:

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000/fr to see your site!

## Tips for Content Management

1. **Always fill in all three languages** (FR, DE, EN) for better multilingual support
2. **Use consistent slugs** across pages and posts
3. **Set Status to "Published"** for content to appear on the site
4. **Use clear category names** and assign colors that match your brand
5. **Add featured images** for better visual appeal
6. **Fill in meta descriptions** for better SEO

## Troubleshooting

**Error: "AIRTABLE_API_KEY is not set"**
- Make sure your `.env.local` file is in the `site` directory
- Restart your development server after adding environment variables

**No content appearing:**
- Check that Status is set to "Published"
- Verify your Base ID is correct
- Check the browser console for errors

**Missing translations:**
- Ensure all three language fields (FR, DE, EN) are filled
- The system falls back to French if a translation is missing

## Need Help?

Contact: y.heydlauf@netventure.tv
