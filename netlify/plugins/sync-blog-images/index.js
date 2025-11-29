/**
 * Netlify Build Plugin: Sync Blog Images from Airtable
 *
 * Downloads blog images to /public/images/blog/ and creates a manifest.json
 * for fast local serving via Netlify CDN.
 *
 * Image source priority:
 * 1. Image_URL field (permanent ImgBB URL - recommended)
 * 2. Image attachment field (Airtable CDN - URLs may expire)
 */

const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 0) {
        resolve({ filepath, skipped: true });
        return;
      }
    }

    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        const redirectProtocol = redirectUrl.startsWith('https') ? https : http;

        redirectProtocol.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
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
        resolve({ filepath, skipped: false });
      });
    });

    request.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function getExtensionFromUrl(url) {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      return ext === '.jpeg' ? '.jpg' : ext;
    }
  } catch (e) {}
  return '.jpg';
}

function getExtensionFromAttachment(attachment) {
  const typeMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
  };
  return typeMap[attachment.type] || '.jpg';
}

module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('🔄 Syncing blog images from Airtable...');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      console.log('⚠️  Airtable credentials not found, skipping image sync');
      return;
    }

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    try {
      const base = new Airtable({ apiKey }).base(baseId);

      const records = await base('Blog Posts')
        .select({
          filterByFormula: `{Status} = 'Published'`,
        })
        .all();

      console.log(`📝 Found ${records.length} published blog posts`);

      let downloadedCount = 0;
      let skippedCount = 0;
      const manifest = {};

      for (const record of records) {
        const slug = record.fields.Slug;
        const imageUrl = record.fields.Image_URL; // Priority: permanent ImgBB URL
        const imageField = record.fields.Image;   // Fallback: Airtable attachment

        if (!slug) continue;

        // Determine image source
        let url = null;
        let extension = '.jpg';

        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
          url = imageUrl.trim();
          extension = getExtensionFromUrl(url);
        } else if (imageField && Array.isArray(imageField) && imageField.length > 0) {
          url = imageField[0].url;
          extension = getExtensionFromAttachment(imageField[0]);
        }

        if (!url) continue;

        const filename = `${slug}${extension}`;

        try {
          const result = await downloadImage(url, filename);
          if (result.skipped) {
            skippedCount++;
          } else {
            downloadedCount++;
            console.log(`  ✅ ${filename}`);
          }
          manifest[slug] = `/images/blog/${filename}`;
        } catch (err) {
          console.error(`  ❌ Failed: ${filename} - ${err.message}`);
        }
      }

      // Write manifest
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

      console.log(`✨ Sync complete!`);
      console.log(`   Downloaded: ${downloadedCount} | Skipped: ${skippedCount} | Total: ${Object.keys(manifest).length}`);

    } catch (error) {
      console.error('❌ Error syncing blog images:', error.message);
      // Don't fail the build, just log the error
    }
  },
};
