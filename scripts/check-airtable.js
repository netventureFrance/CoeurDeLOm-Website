// Script to check what tables exist in Airtable base
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function checkTables() {
  console.log('Checking Airtable base:', process.env.AIRTABLE_BASE_ID);
  console.log('\nAttempting to list tables using Meta API...\n');

  try {
    // Try to access some common table names
    const possibleTables = ['Pages', 'Blog Posts', 'Categories', 'Contact Submissions', 'Navigation', 'UI Translations', 'Site Settings'];

    for (const tableName of possibleTables) {
      try {
        const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
        console.log(`✓ Table "${tableName}" exists (${records.length > 0 ? 'has records' : 'empty'})`);
      } catch (error) {
        console.log(`✗ Table "${tableName}" does not exist`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTables();
