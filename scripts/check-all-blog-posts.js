const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

console.log('Fetching ALL blog posts from Airtable...\n');

base('Blog Posts')
  .select({
    // No maxRecords limit - get all
  })
  .all()
  .then((records) => {
    console.log(`✅ Found ${records.length} total records\n`);

    records.forEach((record, index) => {
      console.log(`\n--- Record ${index + 1} ---`);
      console.log('Record ID:', record.id);
      console.log('Slug:', record.fields.Slug);
      console.log('Status:', record.fields.Status);
      console.log('Title_FR:', record.fields.Title_FR);
      console.log('Has Content_FR:', !!record.fields.Content_FR);
      console.log('Published_Date:', record.fields.Published_Date);
    });

    // Show which slugs exist
    console.log('\n\n=== SUMMARY ===');
    console.log('All slugs in database:');
    records.forEach(r => console.log(`  - ${r.fields.Slug} (${r.fields.Status})`));
  })
  .catch((err) => {
    console.error('❌ Error fetching blog posts:');
    console.error(err.message);
  });
