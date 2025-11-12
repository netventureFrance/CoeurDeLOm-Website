const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

async function getBlogPostBySlug(slug, language) {
  try {
    console.log(`\nTesting getBlogPostBySlug('${slug}', '${language}')\n`);

    const records = await base('Blog Posts')
      .select({
        filterByFormula: `AND({Slug} = '${slug}', {Status} = 'Published')`,
        maxRecords: 1,
      })
      .all();

    console.log(`Records found: ${records.length}`);

    if (records.length === 0) {
      console.log('❌ No records found with this filter');
      return null;
    }

    const record = records[0];
    console.log('\n✅ Record found!');
    console.log('Record ID:', record.id);
    console.log('Slug:', record.fields.Slug);
    console.log('Status:', record.fields.Status);
    console.log('\nAll fields:', Object.keys(record.fields));

    const titleField = `Title_${language.toUpperCase()}`;
    const excerptField = `Excerpt_${language.toUpperCase()}`;
    const contentField = `Content_${language.toUpperCase()}`;

    console.log(`\nLanguage fields for '${language}':`);
    console.log(`- ${titleField}:`, record.fields[titleField]);
    console.log(`- ${excerptField}:`, record.fields[excerptField] ? 'exists' : 'missing');
    console.log(`- ${contentField}:`, record.fields[contentField] ? 'exists' : 'missing');

    return {
      id: record.id,
      slug: record.fields.Slug,
      title: record.fields[titleField] || record.fields.Title_FR,
      excerpt: record.fields[excerptField] || record.fields.Excerpt_FR,
      content: record.fields[contentField] || record.fields.Content_FR,
      category: record.fields.Category,
      tags: record.fields.Tags,
      featuredImage: record.fields.Featured_Image ? record.fields.Featured_Image[0]?.url : undefined,
      author: record.fields.Author,
      publishedDate: record.fields.Published_Date,
      status: record.fields.Status,
    };
  } catch (error) {
    console.error('❌ Error fetching blog post:');
    console.error(error.message);
    return null;
  }
}

// Test the function
getBlogPostBySlug('naturopathie-principes', 'fr').then((post) => {
  if (post) {
    console.log('\n=== Final Post Object ===');
    console.log(JSON.stringify(post, null, 2));
  } else {
    console.log('\n❌ Function returned null');
  }
});
