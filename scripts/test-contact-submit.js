// Test script to verify Airtable contact form submission works
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function testContactSubmission() {
  console.log('Testing Airtable Contact Submission...\n');
  console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
  console.log('Table Name: Contact Submissions\n');

  try {
    // Try to create a test record
    const record = await base('Contact Submissions').create([
      {
        fields: {
          Name: 'Test User',
          Email: 'test@example.com',
          Phone: '+33123456789',
          Message: 'This is a test message from the setup script.',
          Language: 'FR',
          Submitted_At: new Date().toISOString(),
          Status: 'New',
        },
      },
    ]);

    console.log('✅ SUCCESS! Test record created successfully!\n');
    console.log('Record ID:', record[0].id);
    console.log('Record fields:', record[0].fields);
    console.log('\n🎉 Your Airtable integration is working correctly!');
    console.log('You can delete the test record from your Airtable base.\n');

    return true;
  } catch (error) {
    console.error('❌ ERROR: Failed to create test record\n');
    console.error('Error message:', error.message);

    if (error.message.includes('Could not find table')) {
      console.error('\n⚠️  Table "Contact Submissions" not found in your base.');
      console.error('Please verify:');
      console.error('  1. The table is named exactly "Contact Submissions" (with capital C and S)');
      console.error('  2. The table has the following fields:');
      console.error('     - Name (Single line text)');
      console.error('     - Email (Email)');
      console.error('     - Phone (Phone number)');
      console.error('     - Message (Long text)');
      console.error('     - Language (Single line text or Single select)');
      console.error('     - Submitted_At (Date with time)');
      console.error('     - Status (Single select)');
    } else if (error.message.includes('Unknown field')) {
      console.error('\n⚠️  Field mismatch error.');
      console.error('Make sure your table has all the required fields with correct names (case-sensitive)');
    }

    console.error('\nFull error details:', error);
    return false;
  }
}

testContactSubmission();
