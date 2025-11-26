/**
 * Script to download blog images from Airtable and save them locally
 * Run this script whenever you add new blog posts with images in Airtable
 *
 * Usage: node scripts/sync-blog-images.js
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const https = require('https');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'blog');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Download an image from URL and save it locally
 */
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  Skipping ${filename} (already exists)`);
      resolve(filepath);
      return;
    }

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`  ✅ Downloaded ${filename}`);
            resolve(filepath);
          });
        }).on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Downloaded ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Get file extension from Airtable attachment
 */
function getExtension(attachment) {
  if (attachment.type) {
    const typeMap = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return typeMap[attachment.type] || '.jpg';
  }
  // Extract from filename
  const ext = path.extname(attachment.filename || '');
  return ext || '.jpg';
}

async function syncBlogImages() {
  console.log('🔄 Syncing blog images from Airtable...\n');

  try {
    const records = await base('Blog Posts')
      .select({
        filterByFormula: `{Status} = 'Published'`,
      })
      .all();

    console.log(`Found ${records.length} published blog posts\n`);

    let downloadedCount = 0;
    let skippedCount = 0;

    for (const record of records) {
      const slug = record.fields.Slug;
      const imageField = record.fields.Image;

      if (!slug) {
        console.log(`⚠️  Skipping record without slug`);
        continue;
      }

      console.log(`📝 Processing: ${slug}`);

      if (imageField && Array.isArray(imageField) && imageField.length > 0) {
        const attachment = imageField[0];
        const extension = getExtension(attachment);
        const filename = `${slug}${extension}`;

        try {
          const filepath = path.join(IMAGES_DIR, filename);
          if (fs.existsSync(filepath)) {
            skippedCount++;
          } else {
            downloadedCount++;
          }
          await downloadImage(attachment.url, filename);
        } catch (err) {
          console.error(`  ❌ Failed to download image for ${slug}:`, err.message);
        }
      } else {
        console.log(`  ℹ️  No image attached`);
      }
    }

    console.log(`\n✨ Sync complete!`);
    console.log(`   Downloaded: ${downloadedCount} images`);
    console.log(`   Skipped: ${skippedCount} images (already exist)`);
    console.log(`\n📁 Images saved to: ${IMAGES_DIR}`);

  } catch (error) {
    console.error('Error syncing blog images:', error);
    process.exit(1);
  }
}

syncBlogImages();
