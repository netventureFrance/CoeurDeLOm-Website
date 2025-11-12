import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not set');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
  language: string;
}

/**
 * Submit contact form to Airtable
 * This is the ONLY Airtable function - all content is stored locally
 */
export async function submitContactForm(data: ContactSubmission): Promise<boolean> {
  try {
    await base('Contact Submissions').create([
      {
        fields: {
          Name: data.name,
          Email: data.email,
          Phone: data.phone || '',
          Message: data.message,
          Language: data.language.toUpperCase(),
          Submitted_At: new Date().toISOString(),
          Status: 'New',
        },
      },
    ]);
    return true;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return false;
  }
}
