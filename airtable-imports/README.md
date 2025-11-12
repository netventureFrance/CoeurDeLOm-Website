# Airtable Setup for Coeur de l'OM

This project uses Airtable **ONLY for storing customer contact form submissions**. All website content (pages, blog posts, etc.) is stored locally in the codebase.

## Quick Setup

### 1. Create Contact Submissions Table

1. Go to your Airtable base: https://airtable.com/appRQaqXOUs5bLMIs
2. Click **+ Add or import** → **CSV file**
3. Upload `Contact-Submissions.csv`
4. The table will be created with these fields:
   - **Name** (Single line text)
   - **Email** (Email)
   - **Phone** (Phone number)
   - **Message** (Long text)
   - **Language** (Single line text) - fr, de, or en
   - **Submitted_At** (Date with time)
   - **Status** (Single select: New, Read, Replied)

### 2. Adjust Field Types (Optional but Recommended)

After importing, adjust these field types in Airtable:

- **Email**: Convert to **Email** type
- **Phone**: Convert to **Phone number** type
- **Submitted_At**: Convert to **Date** with time
- **Status**: Convert to **Single select** with options: New, Read, Replied
- **Language**: Convert to **Single select** with options: fr, de, en

## That's It!

Your contact form will now save submissions to Airtable. You can:
- View all form submissions in Airtable
- Mark them as Read or Replied
- Export to CSV if needed
- Set up Airtable automations (email notifications, etc.)

## Content Management

**Important**: Blog posts, pages, and all other content are stored locally in your Git repository:
- **Blog posts**: `/content/blog/{lang}/*.mdx`
- **Page content**: In the page components
- **Images**: `/public/images/`

To add a new blog post:
1. Create a new `.mdx` file in `/content/blog/fr/`, `/content/blog/de/`, and `/content/blog/en/`
2. Follow the frontmatter format from existing posts
3. Commit and deploy - no Airtable needed!

## Why This Architecture?

✅ **Faster** - No API calls to load content
✅ **Cheaper** - Minimal Airtable usage
✅ **Version controlled** - All content in Git
✅ **Easier to manage** - Content with code
✅ **Better for SEO** - Static generation

Airtable is perfect for dynamic user data (contact forms, bookings, etc.) but not necessary for static content.
