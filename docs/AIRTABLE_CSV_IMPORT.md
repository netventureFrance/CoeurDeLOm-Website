# How to Import CSV Files into Airtable

This guide will help you quickly set up your Airtable tables using the provided CSV files.

## Files Available

1. `airtable-import-news-promos.csv` - Sample news and promotional content
2. `airtable-import-blog-posts.csv` - Sample blog posts with multilingual content

## Import Instructions

### Step 1: Create the Tables

First, create the tables in your Airtable base as described in `AIRTABLE_SETUP.md`:

#### For News_Promos Table:
1. Go to your Airtable base: https://airtable.com/appRQaqXOUs5bLMIs
2. Click "+ Add or import" at the bottom left
3. Select "CSV file"
4. Upload `docs/airtable-import-news-promos.csv`
5. Name the table: `News_Promos`
6. Click "Import"

#### For Blog Posts Table:
1. In the same base, click "+ Add or import"
2. Select "CSV file"
3. Upload `docs/airtable-import-blog-posts.csv`
4. Name the table: `Blog Posts`
5. Click "Import"

### Step 2: Adjust Field Types

After importing, you need to adjust some field types:

#### News_Promos Table:
1. Click on the `Link` field header → "Customize field type" → Change to "URL"
2. Click on `Language` → "Customize field type" → Change to "Single select"
3. Click on `Start_Date` → "Customize field type" → Change to "Date"
4. Click on `End_Date` → "Customize field type" → Change to "Date"
5. Click on `Status` → "Customize field type" → Change to "Single select"

#### Blog Posts Table:
1. Click on `Category` → "Customize field type" → Change to "Single line text"
2. Click on `Tags` → "Customize field type" → Change to "Multiple select" (Airtable will parse the comma-separated values)
3. Click on `Published_Date` → "Customize field type" → Change to "Date"
4. Click on `Status` → "Customize field type" → Change to "Single select"
5. Optionally, add a `Featured_Image` field of type "Attachment" (this needs to be added manually as it can't be imported via CSV)

### Step 3: Verify the Data

1. Check that all records were imported correctly
2. Verify that dates are formatted properly
3. Make sure the `Status` field shows "Active" or "Published" as appropriate

## Sample Data Included

### News_Promos (9 records):
- 3 records in French (FR)
- 3 records in German (DE)
- 3 records in English (EN)

Sample promotions include:
- Weekly meditation sessions
- Spring promotion on energy healing
- Chromobio-Energy workshop announcement

### Blog Posts (5 records):
Each post includes:
- Multilingual titles (FR, DE, EN)
- Multilingual excerpts (FR, DE, EN)
- Multilingual content (FR, DE, EN)
- Categories (meditation, therapies-douces, spiritualite)
- Tags
- Author: Valérie Heydlauf
- Publication dates

Topics covered:
1. Benefits of Meditation
2. Introduction to Energy Healing
3. Chromobio-Energy: Color Therapy
4. Developing Your Intuition
5. Principles of Naturopathy

## Adding Your Own Content

### For News/Promos:
- Keep `Language` as FR, DE, or EN
- Use `Start_Date` to control when the promo appears
- Leave `End_Date` blank for ongoing promos
- Set `Status` to "Active" to show on website

### For Blog Posts:
- Use consistent slugs (lowercase, hyphens, no spaces)
- Fill all three language fields (FR, DE, EN)
- Set `Status` to "Published" to show on website
- Use existing categories or create new ones
- Tags are comma-separated in the CSV

## Troubleshooting

**Problem: CSV won't import**
- Make sure the file is saved as CSV (UTF-8)
- Check that there are no extra commas in the content fields

**Problem: Dates not showing correctly**
- After import, change the field type to "Date"
- Airtable will automatically parse the YYYY-MM-DD format

**Problem: Tags showing as single text**
- Change field type to "Multiple select"
- Airtable will split the comma-separated values

## Next Steps

After importing:
1. Add Featured Images to blog posts (manually upload via Airtable)
2. Customize the content to match your needs
3. Add more records as needed
4. The website will automatically fetch and display the data

## Need Help?

Contact: y.heydlauf@netventure.tv
