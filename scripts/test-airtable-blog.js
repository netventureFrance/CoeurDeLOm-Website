const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

console.log('Testing Blog Posts table connection...');
console.log('Base ID:', baseId);

base('Blog Posts')
  .select({ maxRecords: 3 })
  .firstPage()
  .then((records) => {
    console.log('✅ Successfully connected to Blog Posts table');
    console.log(`Found ${records.length} records`);
    records.forEach((record) => {
      console.log('\nRecord:', record.id);
      console.log('Slug:', record.fields.Slug);
      console.log('Status:', record.fields.Status);
      console.log('Fields:', Object.keys(record.fields));
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to Blog Posts table:');
    console.error(err.message);
    if (err.statusCode === 404) {
      console.error('\n⚠️  Table "Blog Posts" not found. Please create it in Airtable first.');
    }
  });
