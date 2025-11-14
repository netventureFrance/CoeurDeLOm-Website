/**
 * Test script for chromobio-interpretation API
 * Tests both short and detailed interpretations
 */

const testColorResults = [
  { id: 1, name: 'Magenta', count: 3, status: 'shortage' },
  { id: 2, name: 'Pourpre', count: 7, status: 'excess' },
  { id: 3, name: 'Violet', count: 5, status: 'balanced' },
  { id: 4, name: 'Bleu Roi', count: 0, status: 'shortage' }, // Extreme shortage
  { id: 5, name: 'Indigo', count: 4, status: 'balanced' },
  { id: 6, name: 'Bleu', count: 8, status: 'excess' }, // Extreme excess
  { id: 7, name: 'Cyan', count: 5, status: 'balanced' },
  { id: 8, name: 'Bleu Turquoise', count: 2, status: 'shortage' },
  { id: 9, name: 'Vert Turquoise', count: 4, status: 'balanced' },
  { id: 10, name: 'Vert', count: 6, status: 'excess' },
  { id: 11, name: 'Citron', count: 4, status: 'balanced' },
  { id: 12, name: 'Pomme', count: 3, status: 'shortage' },
  { id: 13, name: 'Jaune', count: 5, status: 'balanced' },
  { id: 14, name: 'Or', count: 7, status: 'excess' },
  { id: 15, name: 'Orange', count: 4, status: 'balanced' },
  { id: 16, name: 'Rouge', count: 1, status: 'shortage' },
  { id: 17, name: 'Ecarlate', count: 6, status: 'excess' },
  { id: 18, name: 'Framboise', count: 4, status: 'balanced' },
];

async function testAPI() {
  console.log('🧪 Testing chromobio-interpretation API...\n');

  // Test French
  console.log('📍 Testing French (fr) interpretation...');
  await testLanguage('fr');

  console.log('\n' + '='.repeat(80) + '\n');

  // Test English
  console.log('📍 Testing English (en) interpretation...');
  await testLanguage('en');

  console.log('\n' + '='.repeat(80) + '\n');

  // Test German
  console.log('📍 Testing German (de) interpretation...');
  await testLanguage('de');
}

async function testLanguage(lang) {
  try {
    const response = await fetch('http://localhost:3001/api/chromobio-interpretation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        colorResults: testColorResults,
        lang: lang,
      }),
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      return;
    }

    const data = await response.json();

    // Verify structure
    console.log('✅ API Response received\n');

    // Check short interpretation
    if (data.short) {
      console.log('📝 SHORT INTERPRETATION:');
      console.log('  ├─ Excess:', data.short.excess ? '✓' : '✗');
      console.log('  ├─ Balanced:', data.short.balanced ? '✓' : '✗');
      console.log('  └─ Shortage:', data.short.shortage ? '✓' : '✗');
      console.log('\n  EXCESS TEXT:');
      console.log('  ' + data.short.excess);
      console.log('\n  BALANCED TEXT:');
      console.log('  ' + data.short.balanced);
      console.log('\n  SHORTAGE TEXT:');
      console.log('  ' + data.short.shortage);
    } else {
      console.log('❌ SHORT interpretation missing!');
    }

    console.log('\n');

    // Check detailed interpretation
    if (data.detailed) {
      console.log('📖 DETAILED INTERPRETATION:');
      console.log('  Length:', data.detailed.length, 'characters');
      console.log('  Paragraphs:', data.detailed.split('\n\n').length);
      console.log('\n  CONTENT:');
      console.log('  ' + data.detailed.split('\n').join('\n  '));
    } else {
      console.log('❌ DETAILED interpretation missing!');
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('  Language:', lang);
    console.log('  Short interpretation:', data.short ? '✅ Present' : '❌ Missing');
    console.log('  Detailed interpretation:', data.detailed ? '✅ Present' : '❌ Missing');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
console.log('🚀 Starting chromobio-interpretation API test\n');
console.log('Test data includes:');
console.log('  - Extreme shortage: Bleu Roi (count=0)');
console.log('  - Extreme excess: Bleu (count=8)');
console.log('  - Regular excess: 4 colors');
console.log('  - Balanced: 8 colors');
console.log('  - Regular shortage: 4 colors');
console.log('\n' + '='.repeat(80) + '\n');

testAPI().then(() => {
  console.log('\n✅ Test completed!');
}).catch(error => {
  console.error('\n❌ Test failed:', error);
});
