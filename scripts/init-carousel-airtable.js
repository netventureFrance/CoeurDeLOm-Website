/**
 * Script to initialize Airtable Carousel_Images table with existing office images
 *
 * This uploads existing images to ImgBB and creates Airtable records
 * Run with: node scripts/init-carousel-airtable.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Airtable = require('airtable');

const CAROUSEL_TABLE = 'tblLtxTVqDjiUfQIc';
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'office');

// Current images with their alt texts
const existingImages = [
  { filename: 'IMG_2681.jpeg', alt: 'Espace méditation avec coussins et vue jardin' },
  { filename: 'IMG_2682.jpeg', alt: 'Salle de méditation avec symbole Om' },
  { filename: 'IMG_2665.jpeg', alt: 'Cercle de méditation avec bols chantants' },
  { filename: 'IMG_2678.jpeg', alt: 'Espace de soin avec table de massage' },
  { filename: 'IMG_2658.jpeg', alt: 'Bureau avec outils de chromothérapie' },
  { filename: 'IMG_2659.jpeg', alt: 'Flacons colorés de chromothérapie' },
  { filename: 'IMG_2669.jpeg', alt: 'Bol tibétain sur table de massage' },
  { filename: 'IMG_2671.jpeg', alt: 'Coussin de méditation avec mandala' },
];

async function uploadToImgBB(filepath) {
  const imgbbApiKey = process.env.IMGBB_API_KEY;
  if (!imgbbApiKey) {
    throw new Error('IMGBB_API_KEY not found in environment');
  }

  const imageBuffer = fs.readFileSync(filepath);
  const base64Image = imageBuffer.toString('base64');

  // Use URLSearchParams for form-urlencoded data
  const params = new URLSearchParams();
  params.append('key', imgbbApiKey);
  params.append('image', base64Image);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'ImgBB upload failed');
  }

  return data.data.url;
}

async function main() {
  console.log('🚀 Initializing Carousel images in Airtable\n');

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    console.error('❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
    process.exit(1);
  }

  const base = new Airtable({ apiKey }).base(baseId);

  // Check if table already has records
  try {
    const existingRecords = await base(CAROUSEL_TABLE).select({ maxRecords: 1 }).all();
    if (existingRecords.length > 0) {
      console.log('⚠️  Carousel table already has records. Skipping to avoid duplicates.');
      console.log('   Delete existing records first if you want to re-initialize.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error checking existing records:', error.message);
    process.exit(1);
  }

  console.log(`📸 Processing ${existingImages.length} images...\n`);

  for (let i = 0; i < existingImages.length; i++) {
    const image = existingImages[i];
    const filepath = path.join(IMAGES_DIR, image.filename);

    console.log(`[${i + 1}/${existingImages.length}] ${image.filename}`);

    if (!fs.existsSync(filepath)) {
      console.log(`   ⚠️  File not found, skipping`);
      continue;
    }

    try {
      // Upload to ImgBB
      console.log(`   📤 Uploading to ImgBB...`);
      const imgbbUrl = await uploadToImgBB(filepath);
      console.log(`   ✅ Uploaded: ${imgbbUrl}`);

      // Create Airtable record
      console.log(`   📝 Creating Airtable record...`);
      const fields = {
        Image_URL: imgbbUrl,
        Order: i,
        Alt_Text: image.alt,
      };

      // Try to add Status if the field exists
      try {
        await base(CAROUSEL_TABLE).create([{ fields: { ...fields, Status: 'Active' } }]);
      } catch (e) {
        // If Status field doesn't exist, create without it
        if (e.message?.includes('Status')) {
          await base(CAROUSEL_TABLE).create([{ fields }]);
        } else {
          throw e;
        }
      }
      console.log(`   ✅ Record created (Order: ${i})\n`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('🎉 Done! Check your Airtable and Admin Panel.');
}

main().catch(console.error);
