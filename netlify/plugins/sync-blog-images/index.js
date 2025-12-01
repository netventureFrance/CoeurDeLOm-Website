/**
 * Netlify Build Plugin: Sync Blog & Carousel Content from Airtable
 *
 * Downloads all blog and carousel data during build for fast static serving:
 * - Blog posts content (all languages) → /public/data/blog-posts.json
 * - Blog images → /public/images/blog/{slug}.{ext}
 * - Audio files → /public/audio/blog/{slug}.mp3
 * - Carousel images → /public/images/office/{order}.{ext}
 * - Carousel manifest → /public/data/carousel-images.json
 *
 * This eliminates runtime Airtable API calls for maximum performance.
 */

const Airtable = require('airtable');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');
const CAROUSEL_DIR = path.join(process.cwd(), 'public', 'images', 'office');
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio', 'blog');
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const BLOG_DATA_PATH = path.join(DATA_DIR, 'blog-posts.json');
const CAROUSEL_DATA_PATH = path.join(DATA_DIR, 'carousel-images.json');

// Airtable table ID for Carousel_Images
const CAROUSEL_TABLE = 'tblLtxTVqDjiUfQIc';

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    // Skip if file already exists and has content
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

function getExtensionFromUrl(url, defaultExt = '.jpg') {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (ext && ext.length > 1 && ext.length < 6) {
      return ext === '.jpeg' ? '.jpg' : ext;
    }
  } catch (e) {}
  return defaultExt;
}

function getExtensionFromAttachment(attachment, defaultExt = '.jpg') {
  const typeMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
  };
  return typeMap[attachment.type] || defaultExt;
}

module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('🔄 Syncing blog content from Airtable...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      console.log('⚠️  Airtable credentials not found, skipping sync');
      return;
    }

    // Ensure directories exist
    [IMAGES_DIR, CAROUSEL_DIR, AUDIO_DIR, DATA_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    try {
      const base = new Airtable({ apiKey }).base(baseId);

      const records = await base('Blog Posts')
        .select({
          filterByFormula: `{Status} = 'Published'`,
          sort: [{ field: 'Published_Date', direction: 'desc' }],
        })
        .all();

      console.log(`📝 Found ${records.length} published blog posts\n`);

      const blogPosts = [];
      const imageManifest = {};
      const audioManifest = {};
      let imagesDownloaded = 0;
      let audioDownloaded = 0;

      for (const record of records) {
        const slug = record.fields.Slug;
        if (!slug) {
          console.log(`⚠️  Skipping record without slug`);
          continue;
        }

        console.log(`📄 Processing: ${slug}`);

        // Build blog post object with all translations
        const post = {
          id: record.id,
          slug,
          titleFR: record.fields.Title_FR || '',
          titleDE: record.fields.Title_DE || '',
          titleEN: record.fields.Title_EN || '',
          contentFR: record.fields.Content_FR || '',
          contentDE: record.fields.Content_DE || '',
          contentEN: record.fields.Content_EN || '',
          author: record.fields.Author || '',
          publishedDate: record.fields.Published_Date || new Date().toISOString().split('T')[0],
          status: record.fields.Status || 'Published',
          spotifyUrl: record.fields.Spotify_URL || null,
          // These will be set to local paths after download
          featuredImage: null,
          audioFile: null,
        };

        // --- Download Image ---
        const imageUrl = record.fields.Image_URL; // Priority: permanent URL
        const imageField = record.fields.Image;   // Fallback: attachment

        let imgUrl = null;
        let imgExt = '.jpg';

        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
          imgUrl = imageUrl.trim();
          imgExt = getExtensionFromUrl(imgUrl, '.jpg');
        } else if (imageField && Array.isArray(imageField) && imageField.length > 0) {
          imgUrl = imageField[0].url;
          imgExt = getExtensionFromAttachment(imageField[0], '.jpg');
        }

        if (imgUrl) {
          const imgFilename = `${slug}${imgExt}`;
          const imgPath = path.join(IMAGES_DIR, imgFilename);

          try {
            const result = await downloadFile(imgUrl, imgPath);
            const localPath = `/images/blog/${imgFilename}`;
            post.featuredImage = localPath;
            imageManifest[slug] = localPath;

            if (!result.skipped) {
              imagesDownloaded++;
              console.log(`   🖼️  Image downloaded`);
            }
          } catch (err) {
            console.error(`   ❌ Image failed: ${err.message}`);
            // Keep remote URL as fallback
            post.featuredImage = imgUrl;
          }
        }

        // --- Download Audio ---
        const audioUrl = record.fields.Audio_URL;   // Priority: permanent URL
        const audioField = record.fields.Audio_File; // Fallback: attachment

        let audUrl = null;
        let audExt = '.mp3';

        if (audioUrl && typeof audioUrl === 'string' && audioUrl.trim()) {
          audUrl = audioUrl.trim();
          audExt = getExtensionFromUrl(audUrl, '.mp3');
        } else if (audioField && Array.isArray(audioField) && audioField.length > 0) {
          audUrl = audioField[0].url;
          audExt = getExtensionFromAttachment(audioField[0], '.mp3');
        }

        if (audUrl) {
          const audFilename = `${slug}${audExt}`;
          const audPath = path.join(AUDIO_DIR, audFilename);

          try {
            const result = await downloadFile(audUrl, audPath);
            const localPath = `/audio/blog/${audFilename}`;
            post.audioFile = localPath;
            audioManifest[slug] = localPath;

            if (!result.skipped) {
              audioDownloaded++;
              console.log(`   🎵 Audio downloaded`);
            }
          } catch (err) {
            console.error(`   ❌ Audio failed: ${err.message}`);
            // Keep remote URL as fallback
            post.audioFile = audUrl;
          }
        }

        blogPosts.push(post);
      }

      // Write blog posts data
      fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogPosts, null, 2));
      console.log(`\n📋 Blog data saved to: ${BLOG_DATA_PATH}`);

      // Write image manifest (for backwards compatibility)
      fs.writeFileSync(path.join(IMAGES_DIR, 'manifest.json'), JSON.stringify(imageManifest, null, 2));

      // Write audio manifest
      if (Object.keys(audioManifest).length > 0) {
        fs.writeFileSync(path.join(AUDIO_DIR, 'manifest.json'), JSON.stringify(audioManifest, null, 2));
      }

      console.log(`\n✨ Blog sync complete!`);
      console.log(`   📄 Blog posts: ${blogPosts.length}`);
      console.log(`   🖼️  Images downloaded: ${imagesDownloaded}`);
      console.log(`   🎵 Audio downloaded: ${audioDownloaded}`);

      // ============================================
      // SYNC CAROUSEL IMAGES
      // ============================================
      console.log('\n🔄 Syncing carousel images from Airtable...\n');

      try {
        const carouselRecords = await base(CAROUSEL_TABLE)
          .select({
            filterByFormula: `{Status} = 'Active'`,
            sort: [{ field: 'Order', direction: 'asc' }],
          })
          .all();

        console.log(`🎠 Found ${carouselRecords.length} active carousel images\n`);

        const carouselImages = [];
        let carouselImagesDownloaded = 0;

        for (const record of carouselRecords) {
          const order = record.fields.Order || 0;
          const altText = record.fields.Alt_Text || '';

          console.log(`🖼️  Processing carousel image #${order}`);

          // Get image URL - prefer Image_URL, fallback to attachment
          let imgUrl = null;
          let imgExt = '.jpg';

          const imageUrl = record.fields.Image_URL;
          const imageField = record.fields.Image;

          if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
            imgUrl = imageUrl.trim();
            imgExt = getExtensionFromUrl(imgUrl, '.jpg');
          } else if (imageField && Array.isArray(imageField) && imageField.length > 0) {
            imgUrl = imageField[0].url;
            imgExt = getExtensionFromAttachment(imageField[0], '.jpg');
          }

          if (imgUrl) {
            const imgFilename = `carousel-${order}${imgExt}`;
            const imgPath = path.join(CAROUSEL_DIR, imgFilename);

            try {
              const result = await downloadFile(imgUrl, imgPath);
              const localPath = `/images/office/${imgFilename}`;

              carouselImages.push({
                id: record.id,
                order,
                altText,
                localPath,
                remoteUrl: imgUrl,
              });

              if (!result.skipped) {
                carouselImagesDownloaded++;
                console.log(`   ✅ Downloaded: ${imgFilename}`);
              } else {
                console.log(`   ⏭️  Skipped (exists): ${imgFilename}`);
              }
            } catch (err) {
              console.error(`   ❌ Failed: ${err.message}`);
              // Keep remote URL as fallback
              carouselImages.push({
                id: record.id,
                order,
                altText,
                localPath: null,
                remoteUrl: imgUrl,
              });
            }
          }
        }

        // Write carousel data
        fs.writeFileSync(CAROUSEL_DATA_PATH, JSON.stringify(carouselImages, null, 2));
        console.log(`\n📋 Carousel data saved to: ${CAROUSEL_DATA_PATH}`);

        console.log(`\n✨ Carousel sync complete!`);
        console.log(`   🎠 Carousel images: ${carouselImages.length}`);
        console.log(`   🖼️  Downloaded: ${carouselImagesDownloaded}`);

      } catch (carouselError) {
        console.error('⚠️  Error syncing carousel (non-fatal):', carouselError.message);
        // Don't fail the build for carousel errors
      }

    } catch (error) {
      console.error('❌ Error syncing content:', error.message);
      // Don't fail the build, just log the error
    }
  },
};
