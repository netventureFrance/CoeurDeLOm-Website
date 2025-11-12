const Airtable = require('airtable');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

const missingPosts = [
  {
    Slug: 'intuition-developpement',
    Title_FR: 'Développer son Intuition',
    Title_DE: 'Ihre Intuition entwickeln',
    Title_EN: 'Developing Your Intuition',
    Excerpt_FR: "L'intuition est un guide précieux dans notre vie. Apprenez à l'écouter et à la développer pour prendre de meilleures décisions.",
    Excerpt_DE: 'Intuition ist ein wertvoller Wegweiser in unserem Leben. Lernen Sie, ihr zuzuhören und sie zu entwickeln, um bessere Entscheidungen zu treffen.',
    Excerpt_EN: 'Intuition is a valuable guide in our life. Learn to listen to it and develop it to make better decisions.',
    Content_FR: "Notre intuition est une forme de sagesse intérieure qui nous guide au quotidien. Pour la développer, il est important de créer des moments de silence et d'écoute intérieure. La méditation, les exercices de respiration et l'attention portée aux sensations corporelles sont autant de moyens de renforcer cette connexion avec soi-même.",
    Content_DE: 'Unsere Intuition ist eine Form innerer Weisheit, die uns täglich führt. Um sie zu entwickeln, ist es wichtig, Momente der Stille und des inneren Zuhörens zu schaffen. Meditation, Atemübungen und Aufmerksamkeit für Körperempfindungen sind alles Möglichkeiten, diese Verbindung zu sich selbst zu stärken.',
    Content_EN: "Our intuition is a form of inner wisdom that guides us daily. To develop it, it's important to create moments of silence and inner listening. Meditation, breathing exercises, and attention to bodily sensations are all ways to strengthen this connection with oneself.",
    Category: 'spiritualite',
    Tags: ['intuition', 'développement personnel', 'méditation'],
    Author: 'Valérie Heydlauf',
    Published_Date: '2025-01-25',
    Status: 'Published'
  },
  {
    Slug: 'naturopathie-principes',
    Title_FR: 'Les Principes de la Naturopathie',
    Title_DE: 'Die Prinzipien der Naturheilkunde',
    Title_EN: 'The Principles of Naturopathy',
    Excerpt_FR: 'La naturopathie est une approche globale de la santé qui privilégie les méthodes naturelles et la prévention.',
    Excerpt_DE: 'Naturheilkunde ist ein ganzheitlicher Gesundheitsansatz, der natürliche Methoden und Prävention bevorzugt.',
    Excerpt_EN: 'Naturopathy is a holistic approach to health that favors natural methods and prevention.',
    Content_FR: "La naturopathie repose sur cinq principes fondamentaux: ne pas nuire, identifier et traiter la cause, enseigner, traiter la personne dans sa globalité, et favoriser l'auto-guérison. En tant que Heilpraktikerin, j'accompagne mes clients vers un mieux-être durable en utilisant des méthodes naturelles adaptées à chacun.",
    Content_DE: 'Die Naturheilkunde basiert auf fünf Grundprinzipien: nicht schaden, die Ursache identifizieren und behandeln, lehren, die Person als Ganzes behandeln und die Selbstheilung fördern. Als Heilpraktikerin begleite ich meine Klienten zu nachhaltigem Wohlbefinden, indem ich natürliche Methoden verwende, die auf jeden einzelnen zugeschnitten sind.',
    Content_EN: 'Naturopathy is based on five fundamental principles: do no harm, identify and treat the cause, teach, treat the whole person, and promote self-healing. As a Heilpraktikerin, I guide my clients toward sustainable well-being using natural methods tailored to each individual.',
    Category: 'therapies-douces',
    Tags: ['naturopathie', 'heilpraktikerin', 'santé naturelle'],
    Author: 'Valérie Heydlauf',
    Published_Date: '2025-02-01',
    Status: 'Published'
  }
];

console.log('Adding missing blog posts to Airtable...\n');

async function addPosts() {
  try {
    // Check which posts already exist
    const existingRecords = await base('Blog Posts').select({
      fields: ['Slug']
    }).all();

    const existingSlugs = existingRecords.map(r => r.fields.Slug);
    console.log('Existing slugs:', existingSlugs);

    // Filter out posts that already exist
    const postsToAdd = missingPosts.filter(post => !existingSlugs.includes(post.Slug));

    if (postsToAdd.length === 0) {
      console.log('\n✅ All blog posts already exist in Airtable!');
      return;
    }

    console.log(`\nAdding ${postsToAdd.length} missing post(s)...\n`);

    // Add posts one by one
    for (const post of postsToAdd) {
      console.log(`Adding: ${post.Slug}`);
      await base('Blog Posts').create([
        { fields: post }
      ]);
      console.log(`✅ Added: ${post.Title_EN}`);
    }

    console.log('\n✅ Successfully added all missing blog posts!');
  } catch (error) {
    console.error('❌ Error adding blog posts:');
    console.error(error.message);
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    process.exit(1);
  }
}

addPosts();
