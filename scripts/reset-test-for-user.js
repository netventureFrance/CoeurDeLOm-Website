// Reset test records for a user so they can test again
require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const Airtable = require('airtable');
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const userEmail = 'y.heydlauf@netventure.tv';

function escapeFormulaString(str) {
  return str.replace(/'/g, "\\'");
}

async function main() {
  console.log(`\n🔍 Finding tests for email: ${userEmail}`);

  // Find contact
  const contacts = await base('Contact Submissions')
    .select({
      filterByFormula: `LOWER({Email}) = LOWER('${escapeFormulaString(userEmail)}')`,
    })
    .all();

  if (contacts.length === 0) {
    console.log('No contact found');
    return;
  }

  const contactId = contacts[0].id;
  console.log(`✅ Found contact: ${contacts[0].fields.Name} (${contactId})`);

  // Find all tests for this contact
  const tests = await base('ChromoBio_Tests').select().all();
  const userTests = tests.filter(t => {
    const contactLinks = t.fields.Contact;
    return contactLinks && contactLinks.includes(contactId);
  });

  console.log(`\n📋 Found ${userTests.length} test(s) for this user:`);
  for (const test of userTests) {
    console.log(`  - ${test.id}: Status=${test.fields.Status}, Date=${test.fields.Test_Date}`);
  }

  // Delete all existing tests for this user
  console.log(`\n🗑️ Deleting existing tests to allow fresh test...`);
  for (const test of userTests) {
    await base('ChromoBio_Tests').destroy(test.id);
    console.log(`  ✅ Deleted: ${test.id}`);
  }

  console.log('\n✅ Done! You can now take a fresh test.');
}

main().catch(console.error);
