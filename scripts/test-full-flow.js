// Test full ChromoBio flow - from pre-test to results
require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const Airtable = require('airtable');
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Test email
const testEmail = 'test-flow@example.com';
const testName = 'Test Flow User';

function escapeFormulaString(str) {
  return str.replace(/'/g, "\\'");
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up previous test data...');

  // Find and delete any existing test records for this email
  try {
    // Find contact
    const contacts = await base('Contact Submissions')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${escapeFormulaString(testEmail)}')`,
      })
      .all();

    for (const contact of contacts) {
      // Find tests linked to this contact
      const tests = await base('ChromoBio_Tests')
        .select({
          filterByFormula: `FIND('${contact.id}', ARRAYJOIN({Contact})) > 0`,
        })
        .all();

      // Delete tests
      for (const test of tests) {
        await base('ChromoBio_Tests').destroy(test.id);
        console.log(`  Deleted test: ${test.id}`);
      }

      // Delete contact
      await base('Contact Submissions').destroy(contact.id);
      console.log(`  Deleted contact: ${contact.id}`);
    }
  } catch (error) {
    console.log('  Cleanup completed (may have had nothing to clean)');
  }
}

async function simulatePreTestForm() {
  console.log('\n📝 Step 1: Simulating pre-test form submission...');

  try {
    // Step 1a: Find or create contact
    let contactId;
    const existingContacts = await base('Contact Submissions')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${escapeFormulaString(testEmail)}')`,
        maxRecords: 1,
      })
      .all();

    if (existingContacts.length > 0) {
      contactId = existingContacts[0].id;
      console.log(`  ✅ Found existing contact: ${contactId}`);
    } else {
      const newContact = await base('Contact Submissions').create([
        {
          fields: {
            Name: testName,
            Email: testEmail,
            Phone: '',
            Language: 'FR',
            GDPR_Consent: true,
            Newsletter_Consent: false,
            Submitted_At: new Date().toISOString(),
            Status: 'New',
          },
        },
      ]);
      contactId = newContact[0].id;
      console.log(`  ✅ Created new contact: ${contactId}`);
    }

    // Step 1b: Create test record linked to contact
    const testRecord = await base('ChromoBio_Tests').create([
      {
        fields: {
          Contact: [contactId],
          Test_Date: new Date().toISOString().split('T')[0],
          Status: 'New',
          IP_Address: '127.0.0.1',
          IP_Location: 'Test Location',
        },
      },
    ]);
    console.log(`  ✅ Created test record: ${testRecord[0].id} with Status: New`);

    return { contactId, testId: testRecord[0].id };
  } catch (error) {
    console.error('  ❌ Error:', error.message);
    return null;
  }
}

async function simulateFindTestForResults() {
  console.log('\n🔍 Step 2: Finding test record (like /api/chromobio-results does)...');

  try {
    // Find contact
    const contacts = await base('Contact Submissions')
      .select({
        filterByFormula: `LOWER({Email}) = LOWER('${escapeFormulaString(testEmail)}')`,
        maxRecords: 1,
      })
      .all();

    if (contacts.length === 0) {
      console.log('  ❌ No contact found');
      return null;
    }

    const contactId = contacts[0].id;
    console.log(`  ✅ Found contact: ${contactId}`);

    // Find tests for this contact with Status = 'New' or 'In Progress'
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

    if (tests.length === 0) {
      console.log('  ❌ No pending test found');

      // Debug: show all tests for this contact
      const allTests = await base('ChromoBio_Tests')
        .select({
          filterByFormula: `FIND('${contactId}', ARRAYJOIN({Contact})) > 0`,
        })
        .all();
      console.log(`  📋 Total tests for this contact: ${allTests.length}`);
      allTests.forEach(t => {
        console.log(`    - ${t.id}: Status=${t.fields.Status}`);
      });

      return null;
    }

    console.log(`  ✅ Found pending test: ${tests[0].id} (Status: ${tests[0].fields.Status})`);
    return tests[0].id;
  } catch (error) {
    console.error('  ❌ Error:', error.message);
    return null;
  }
}

async function simulateSaveResults(testId) {
  console.log('\n💾 Step 3: Saving results to test record...');

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
    console.log(`  ✅ Results saved! Status: ${result.fields.Status}`);
    return true;
  } catch (error) {
    console.error('  ❌ Save failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('ChromoBio Full Flow Test');
  console.log('='.repeat(60));

  // Cleanup
  await cleanupTestData();

  // Step 1: Pre-test form
  const preTestResult = await simulatePreTestForm();
  if (!preTestResult) {
    console.log('\n❌ FAILED: Could not create pre-test records');
    return;
  }

  // Step 2: Find test for results
  const testId = await simulateFindTestForResults();
  if (!testId) {
    console.log('\n❌ FAILED: Could not find test record for results');
    return;
  }

  // Verify it's the same test
  if (testId !== preTestResult.testId) {
    console.log(`\n⚠️ WARNING: Found different test ID (${testId}) than created (${preTestResult.testId})`);
  }

  // Step 3: Save results
  const saveSuccess = await simulateSaveResults(testId);
  if (!saveSuccess) {
    console.log('\n❌ FAILED: Could not save results');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SUCCESS: Full flow completed successfully!');
  console.log('='.repeat(60));

  // Cleanup after test
  await cleanupTestData();
}

main().catch(console.error);
