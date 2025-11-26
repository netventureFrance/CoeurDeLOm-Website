/**
 * Netlify Build Plugin: Sync Blog Images from Airtable
 *
 * This plugin runs before the build and downloads all blog images
 * from Airtable to /public/images/blog/
 */

const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(IMAGES_DIR, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
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
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function getExtension(attachment) {
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

      for (const record of records) {
        const slug = record.fields.Slug;
        const imageField = record.fields.Image;

        if (!slug || !imageField || !Array.isArray(imageField) || imageField.length === 0) {
          continue;
        }

        const attachment = imageField[0];
        const ext = getExtension(attachment);
        const filename = `${slug}${ext}`;

        try {
          await downloadImage(attachment.url, filename);
          downloadedCount++;
          console.log(`  ✅ ${filename}`);
        } catch (err) {
          console.error(`  ❌ Failed: ${filename} - ${err.message}`);
        }
      }

      console.log(`✨ Synced ${downloadedCount} blog images`);

    } catch (error) {
      console.error('❌ Error syncing blog images:', error.message);
      // Don't fail the build, just log the error
    }
  },
};
