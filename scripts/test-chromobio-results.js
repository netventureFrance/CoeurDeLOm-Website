// Test script for ChromoBio results API
require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const Airtable = require('airtable');
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function testFindRecentTest(email) {
  console.log(`\n🔍 Finding recent test for email: ${email}`);

  try {
    // First find the contact
    const contacts = await base('Contact Submissions')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${email}')`,
        maxRecords: 1,
      })
      .all();

    if (contacts.length === 0) {
      console.log('❌ No contact found for this email');
      return null;
    }

    const contactId = contacts[0].id;
    const contactName = contacts[0].fields.Name;
    console.log(`✅ Found contact: ${contactName} (${contactId})`);

    // Find tests for this contact
    const tests = await base('ChromoBio_Tests')
      .select({
        filterByFormula: `AND(
          FIND('${contactId}', ARRAYJOIN({Contact})) > 0,
          OR({Status} = 'New', {Status} = 'In Progress')
        )`,
        sort: [{ field: 'Test_Date', direction: 'desc' }],
        maxRecords: 1,
      })
      .all();

    console.log(`📋 Found ${tests.length} matching test(s)`);

    if (tests.length === 0) {
      // Let's try without the status filter to see all tests
      console.log('\n🔍 Checking all tests for this contact (without status filter)...');
      const allTests = await base('ChromoBio_Tests')
        .select({
          filterByFormula: `FIND('${contactId}', ARRAYJOIN({Contact})) > 0`,
          sort: [{ field: 'Test_Date', direction: 'desc' }],
        })
        .all();

      console.log(`Found ${allTests.length} total test(s) for this contact:`);
      allTests.forEach(t => {
        console.log(`  - ID: ${t.id}, Status: ${t.fields.Status}, Date: ${t.fields.Test_Date}`);
      });

      return null;
    }

    const testId = tests[0].id;
    const testStatus = tests[0].fields.Status;
    console.log(`✅ Found test: ${testId} (Status: ${testStatus})`);

    return testId;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

async function testSaveResults(testId) {
  console.log(`\n💾 Testing save to test record: ${testId}`);

  const testResults = {
    Results_JSON: JSON.stringify({
      'Magenta': 2, 'Pourpre': 3, 'Violet': 5, 'Bleu Roi': 2,
      'Indigo': 5, 'Bleu': 5, 'Cyan': 3, 'Bleu Turquoise': 6,
      'Vert Turquoise': 4, 'Vert': 6, 'Citron': 6, 'Pomme': 4,
      'Jaune': 4, 'Or': 4, 'Orange': 3, 'Rouge': 4,
      'Écarlate': 1, 'Framboise': 5
    }),
    Brief_Excess: 'Test excess interpretation',
    Brief_Balanced: 'Test balanced interpretation',
    Brief_Deficient: 'Test deficient interpretation',
    Detailed_Interpretation: 'Test detailed interpretation paragraph.',
    Status: 'Completed',
  };

  try {
    const result = await base('ChromoBio_Tests').update(testId, testResults);
    console.log('✅ Save successful!');
    console.log('Updated record:', result.id);
    return true;
  } catch (error) {
    console.error('❌ Save failed:', error.message);
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    return false;
  }
}

// Check all ChromoBio_Tests records
async function listAllTests() {
  // Try different table names
  const tableNames = ['ChromoBio_Tests', 'ChromoBioTests', 'Chromobio Tests', 'Tests'];

  for (const tableName of tableNames) {
    console.log(`\n📋 Trying table: "${tableName}"...`);
    try {
      const tests = await base(tableName)
        .select({
          maxRecords: 10,
        })
        .all();

      console.log(`✅ Found ${tests.length} record(s) in "${tableName}"`);
      tests.forEach(t => {
        console.log(`  - ID: ${t.id}`);
        console.log(`    Fields: ${Object.keys(t.fields).join(', ')}`);
        console.log('');
      });

      if (tests.length > 0) {
        return tableName;
      }
    } catch (error) {
      console.log(`❌ Table "${tableName}" error: ${error.message}`);
    }
  }
  return null;
}

// Try to create a test record
async function createTestRecord(contactId) {
  console.log(`\n🆕 Creating test record for contact: ${contactId}`);
  try {
    const result = await base('ChromoBio_Tests').create([
      {
        fields: {
          Contact: [contactId],
          Test_Date: new Date().toISOString().split('T')[0],
          Status: 'New',
          IP_Address: '127.0.0.1',
        },
      },
    ]);
    console.log('✅ Created test record:', result[0].id);
    return result[0].id;
  } catch (error) {
    console.error('❌ Failed to create:', error.message);
    return null;
  }
}

// Run the test
const testEmail = 'y.heydlauf@netventure.tv';

async function main() {
  await listAllTests();

  const testId = await testFindRecentTest(testEmail);

  if (!testId) {
    // Try to find the contact and create a test
    console.log('\n📋 No test found. Checking contact...');
    const contacts = await base('Contact Submissions')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${testEmail}')`,
        maxRecords: 1,
      })
      .all();

    if (contacts.length > 0) {
      const contactId = contacts[0].id;
      console.log('Contact ID:', contactId);

      // Create a test record
      const newTestId = await createTestRecord(contactId);

      if (newTestId) {
        // Now try to save results
        console.log('\n💾 Attempting to save results...');
        await testSaveResults(newTestId);
      }
    }
  }
}

main();
