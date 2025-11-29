// Debug contact link issue
require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const Airtable = require('airtable');
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function main() {
  console.log('=== Debug Contact Link ===\n');

  // 1. List all test records with their Contact field values
  console.log('📋 All ChromoBio_Tests records:');
  const tests = await base('ChromoBio_Tests').select().all();

  for (const test of tests) {
    console.log(`\nTest ID: ${test.id}`);
    console.log(`  Status: ${test.fields.Status}`);
    console.log(`  Contact field (raw):`, test.fields.Contact);
    console.log(`  Test_Date: ${test.fields.Test_Date}`);
  }

  // 2. Check a specific formula
  console.log('\n\n📋 Testing FIND formula with different approaches:');

  // Get first test with a Contact
  const testWithContact = tests.find(t => t.fields.Contact && t.fields.Contact.length > 0);
  if (testWithContact) {
    const contactId = testWithContact.fields.Contact[0];
    console.log(`\nUsing contact ID: ${contactId}`);

    // Try the formula from findRecentChromoBioTest
    console.log('\n1. Testing ARRAYJOIN formula:');
    try {
      const result1 = await base('ChromoBio_Tests')
        .select({
          filterByFormula: `FIND('${contactId}', ARRAYJOIN({Contact})) > 0`,
        })
        .all();
      console.log(`   Found ${result1.length} record(s)`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }

    // Try direct record ID comparison
    console.log('\n2. Testing RECORD_ID comparison:');
    try {
      const result2 = await base('ChromoBio_Tests')
        .select({
          filterByFormula: `RECORD_ID() = '${testWithContact.id}'`,
        })
        .all();
      console.log(`   Found ${result2.length} record(s)`);
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }

    // Try without formula (filter in JS)
    console.log('\n3. Testing JS filter:');
    const result3 = tests.filter(t =>
      t.fields.Contact && t.fields.Contact.includes(contactId)
    );
    console.log(`   Found ${result3.length} record(s)`);
    result3.forEach(r => console.log(`   - ${r.id}: Status=${r.fields.Status}`));
  }

  // 3. Check the specific contact from earlier
  console.log('\n\n📋 Checking contact recD8VNtmRRrhz2S7:');
  try {
    const contact = await base('Contact Submissions').find('recD8VNtmRRrhz2S7');
    console.log('Contact exists:', contact.fields.Name, contact.fields.Email);

    // Find tests that link to this contact
    const linkedTests = tests.filter(t =>
      t.fields.Contact && t.fields.Contact.includes('recD8VNtmRRrhz2S7')
    );
    console.log(`Tests linked to this contact: ${linkedTests.length}`);
    linkedTests.forEach(t => console.log(`  - ${t.id}`));
  } catch (e) {
    console.log('Contact not found:', e.message);
  }
}

main().catch(console.error);
