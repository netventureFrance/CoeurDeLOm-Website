# Images Guide 📸

## Where Are All Images?

All your WordPress images are preserved in:
```
wordpress-backup/wp-content/uploads/
```

### Summary
- **Total:** ~200 image files
- **Size:** 33 MB
- **Formats:** PNG, JPG, SVG, WebP, GIF
- **Organization:** By year/month (2023-2025)

## Images Already Added ✅

Your logo has been copied to the new site:
```
public/images/
├── logo.svg    # Vector version (best quality)
└── logo.png    # Raster version
```

## How to Add More Images

### Method 1: For Static Images (Logos, Icons)

Copy to `/public` folder:
```bash
# Copy specific images
cp wordpress-backup/wp-content/uploads/2024/05/image.png public/images/

# Or copy all images at once
cp -r wordpress-backup/wp-content/uploads/* public/images/
```

Then use in your code:
```jsx
import Image from 'next/image'

<Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
```

### Method 2: For Blog/Content Images (Recommended)

Upload to **Airtable**:

1. Open your Airtable base
2. In "Blog Posts" or "Pages" table
3. Click the "Featured_Image" attachment field
4. Upload the image
5. Airtable hosts it with CDN: `https://dl.airtableusercontent.com/...`

**Benefits:**
- ✅ Automatic CDN
- ✅ Tied to content
- ✅ Easy to manage
- ✅ Multilingual support

### Method 3: External CDN (Optional)

For large sites, use:
- **Cloudinary** - https://cloudinary.com
- **ImageKit** - https://imagekit.io
- **Uploadcare** - https://uploadcare.com

Upload images there and use their URLs.

## Image Optimization

Next.js automatically optimizes images when you use:

```jsx
import Image from 'next/image'

<Image
  src="/images/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={85}
  priority={false} // true for above-fold images
/>
```

**Benefits:**
- ✅ Automatic resizing
- ✅ WebP conversion
- ✅ Lazy loading
- ✅ Responsive images

## Finding Specific Images

### Search by name:
```bash
find wordpress-backup/wp-content/uploads -name "*keyword*"
```

### Search by type:
```bash
# Find all PNGs
find wordpress-backup/wp-content/uploads -name "*.png"

# Find all SVGs
find wordpress-backup/wp-content/uploads -name "*.svg"
```

### List images by year:
```bash
ls wordpress-backup/wp-content/uploads/2024/05/
```

## Common Images in Your Site

Based on WordPress export:

1. **Logo**: `Coeur-de-lOm.svg` ✅ Already copied
2. **Background images**: `bg-cta-*.png`
3. **Partner logos**: AURA-SOMA, biophinity
4. **Blog featured images**: Various in 2024-2025 folders
5. **Theme assets**: In liquid_temp, liquid-styles folders

## Recommended Workflow

### For New Content:

1. **Create blog post in Airtable**
2. **Upload featured image** to Attachment field
3. **Airtable provides URL** automatically
4. **Site fetches image** from Airtable CDN

### For Migrating Old Posts:

```bash
# 1. Find the image
find wordpress-backup/wp-content/uploads -name "image-name*"

# 2. Option A: Copy to public/
cp wordpress-backup/wp-content/uploads/2024/05/image.jpg public/images/

# 2. Option B: Upload to Airtable
# Manually upload via Airtable interface
```

## File Structure

```
CoeurDeLOm-Website/
├── public/
│   └── images/              # Static images
│       ├── logo.svg         ✅
│       ├── logo.png         ✅
│       └── [add more here]
│
└── wordpress-backup/
    └── wp-content/
        └── uploads/         # All WordPress images (backup)
            ├── 2023/
            ├── 2024/
            └── 2025/
```

## Image Sizes & Formats

WordPress created multiple sizes:
- Original: `image.png`
- Thumbnail: `image-150x150.png`
- Medium: `image-300x300.png`
- Large: `image-1024x1024.png`

For Next.js, you only need the **original** - it handles all resizing!

## Quick Commands

```bash
# Copy all images to public
cp -r wordpress-backup/wp-content/uploads/* public/images/

# Count images
find wordpress-backup/wp-content/uploads -type f \( -name "*.jpg" -o -name "*.png" \) | wc -l

# List largest images
find wordpress-backup/wp-content/uploads -type f -exec ls -lh {} \; | sort -k5 -hr | head -20

# Clean up WordPress thumbnails (keep originals only)
# This would require careful filtering by filename patterns
```

## Tips

1. **Use SVG for logos** - Scales perfectly, smaller size
2. **Optimize before uploading** - Use tools like TinyPNG, ImageOptim
3. **Use descriptive filenames** - `blog-meditation-header.jpg` not `IMG_1234.jpg`
4. **Alt text is important** - For accessibility and SEO
5. **Lazy load below fold** - Better performance

## Need Specific Images?

Your images are organized by date in WordPress backup. Common locations:

- **Logos/Branding**: `2024/05/` (May 2024)
- **Recent Blog Images**: `2025/` folders
- **Theme Assets**: `elementor/`, `liquid-styles/`

Let me know which images you need and I can help locate them!
