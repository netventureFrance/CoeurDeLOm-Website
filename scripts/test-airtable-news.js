const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

console.log('Testing News_Promos table connection...');
console.log('Base ID:', baseId);

base('News_Promos')
  .select({ maxRecords: 3 })
  .firstPage()
  .then((records) => {
    console.log('✅ Successfully connected to News_Promos table');
    console.log(`Found ${records.length} records`);
    records.forEach((record) => {
      console.log('\nRecord:', record.id);
      console.log('Fields:', record.fields);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to News_Promos table:');
    console.error(err.message);
    if (err.statusCode === 404) {
      console.error('\n⚠️  Table "News_Promos" not found. Please create it in Airtable first.');
    }
  });
