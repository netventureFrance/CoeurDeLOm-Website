/**
 * Script to download blog images and save them locally for Netlify CDN delivery
 * This script runs during Netlify build to ensure fast image loading
 *
 * Sources (in priority order):
 * 1. Image_URL field (permanent ImgBB URL - recommended)
 * 2. Image attachment field (Airtable CDN - URLs may expire)
 *
 * Usage: node scripts/sync-blog-images.js
 */

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'blog');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Download an image from URL and save it locally
 * Supports both HTTP and HTTPS
 */
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if file already exists and has content
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 0) {
        console.log(`  ⏭️  Skipping ${filename} (already exists)`);
        resolve({ filepath, skipped: true });
        return;
      }
    }

    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        const redirectProtocol = redirectUrl.startsWith('https') ? https : http;

        redirectProtocol.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`  ✅ Downloaded ${filename}`);
            resolve({ filepath, skipped: false });
          });
        }).on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
        return;
      }

      if (response.statusCode !== 200) {
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Downloaded ${filename}`);
        resolve({ filepath, skipped: false });
      });
    });

    request.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Get file extension from URL or attachment
 */
function getExtensionFromUrl(url) {
  // Try to extract from URL path
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath).toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return ext === '.jpeg' ? '.jpg' : ext;
  }

  // Default to jpg for ImgBB and other URLs without clear extension
  return '.jpg';
}

function getExtensionFromAttachment(attachment) {
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
    const manifest = {};

    for (const record of records) {
      const slug = record.fields.Slug;
      const imageUrl = record.fields.Image_URL; // Priority: permanent ImgBB URL
      const imageField = record.fields.Image;    // Fallback: Airtable attachment

      if (!slug) {
        console.log(`⚠️  Skipping record without slug`);
        continue;
      }

      console.log(`📝 Processing: ${slug}`);

      // Determine image source and extension
      let url = null;
      let extension = '.jpg';

      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
        // Use permanent Image_URL field (ImgBB)
        url = imageUrl.trim();
        extension = getExtensionFromUrl(url);
        console.log(`  📸 Using Image_URL: ${url.substring(0, 50)}...`);
      } else if (imageField && Array.isArray(imageField) && imageField.length > 0) {
        // Fallback to Airtable attachment
        const attachment = imageField[0];
        url = attachment.url;
        extension = getExtensionFromAttachment(attachment);
        console.log(`  📎 Using Airtable attachment`);
      }

      if (url) {
        const filename = `${slug}${extension}`;

        try {
          const result = await downloadImage(url, filename);
          if (result.skipped) {
            skippedCount++;
          } else {
            downloadedCount++;
          }
          // Add to manifest
          manifest[slug] = `/images/blog/${filename}`;
        } catch (err) {
          console.error(`  ❌ Failed to download image for ${slug}:`, err.message);
        }
      } else {
        console.log(`  ℹ️  No image URL available`);
      }
    }

    // Write manifest file
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\n📋 Manifest saved to: ${MANIFEST_PATH}`);

    console.log(`\n✨ Sync complete!`);
    console.log(`   Downloaded: ${downloadedCount} images`);
    console.log(`   Skipped: ${skippedCount} images (already exist)`);
    console.log(`   Total in manifest: ${Object.keys(manifest).length} images`);
    console.log(`\n📁 Images saved to: ${IMAGES_DIR}`);

  } catch (error) {
    console.error('Error syncing blog images:', error);
    process.exit(1);
  }
}

syncBlogImages();
