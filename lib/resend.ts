import { Resend } from 'resend';
import { ChromoBioTestResults, CHROMOBIO_COLORS } from './airtable';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<boolean> {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    return false;
  }

  try {
    await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || 'Cœur de l\'OM <contact@coeurdelom.fr>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return false;
  }
}

/**
 * Send contact confirmation email to user
 */
export async function sendContactConfirmation(
  email: string,
  name: string,
  language: string = 'fr'
): Promise<boolean> {
  const subjects = {
    fr: 'Confirmation de votre message - Cœur de l\'OM',
    en: 'Confirmation of your message - Cœur de l\'OM',
    de: 'Bestätigung Ihrer Nachricht - Cœur de l\'OM',
  };

  const messages = {
    fr: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7C3AED;">Merci de nous avoir contactés !</h2>
            <p>Bonjour ${name},</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Valérie vous répondra dans les plus brefs délais.</p>
            <p>À très bientôt,</p>
            <p><strong>L'équipe Cœur de l'OM</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              Cœur de l'OM<br>
              140, Rue du Pioch de Boutonnet B1<br>
              34090 Montpellier<br>
              contact@coeurdelom.fr
            </p>
          </div>
        </body>
      </html>
    `,
    en: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7C3AED;">Thank you for contacting us!</h2>
            <p>Hello ${name},</p>
            <p>We have received your message and thank you for reaching out.</p>
            <p>Valérie will respond to you as soon as possible.</p>
            <p>See you soon,</p>
            <p><strong>The Cœur de l'OM Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              Cœur de l'OM<br>
              140, Rue du Pioch de Boutonnet B1<br>
              34090 Montpellier<br>
              contact@coeurdelom.fr
            </p>
          </div>
        </body>
      </html>
    `,
    de: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7C3AED;">Vielen Dank für Ihre Nachricht!</h2>
            <p>Hallo ${name},</p>
            <p>Wir haben Ihre Nachricht erhalten und danken Ihnen dafür.</p>
            <p>Valérie wird Ihnen so schnell wie möglich antworten.</p>
            <p>Bis bald,</p>
            <p><strong>Das Cœur de l'OM Team</strong></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              Cœur de l'OM<br>
              140, Rue du Pioch de Boutonnet B1<br>
              34090 Montpellier<br>
              contact@coeurdelom.fr
            </p>
          </div>
        </body>
      </html>
    `,
  };

  const lang = language.toLowerCase() as 'fr' | 'en' | 'de';
  const subject = subjects[lang] || subjects.fr;
  const html = messages[lang] || messages.fr;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send notification email to admin when new contact is received
 */
export async function sendAdminNotification(
  name: string,
  email: string,
  message: string,
  newsletterConsent: boolean
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@coeurdelom.fr';

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7C3AED;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Newsletter :</strong> ${newsletterConsent ? 'Oui' : 'Non'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message :</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Nouveau message de ${name}`,
    html,
  });
}

// Color hex codes for the visualization
const COLOR_HEX: { [key: string]: string } = {
  'Magenta': '#FF00FF',
  'Pourpre': '#9400D3',
  'Violet': '#8B00FF',
  'Bleu Roi': '#0000CD',
  'Indigo': '#4B0082',
  'Bleu': '#00BFFF',
  'Cyan': '#00FFFF',
  'Bleu Turquoise': '#00CED1',
  'Vert Turquoise': '#40E0D0',
  'Vert': '#00FF00',
  'Citron': '#ADFF2F',
  'Pomme': '#7CFC00',
  'Jaune': '#FFFF00',
  'Or': '#FFD700',
  'Orange': '#FFA500',
  'Rouge': '#FF0000',
  'Écarlate': '#FF2400',
  'Framboise': '#E30B5D',
};

/**
 * Generate HTML for color bar visualization
 */
function generateColorBarHtml(colorValues: { [key: string]: number }): string {
  let barsHtml = '';

  for (const color of CHROMOBIO_COLORS) {
    const value = colorValues[color] || 0;
    const hexColor = COLOR_HEX[color] || '#888';
    const heightPercent = (value / 8) * 100;

    barsHtml += `
      <div style="display: inline-block; text-align: center; margin: 0 2px; width: 40px;">
        <div style="height: 80px; display: flex; flex-direction: column; justify-content: flex-end;">
          <div style="background: ${hexColor}; width: 30px; height: ${heightPercent}%; margin: 0 auto; border-radius: 3px;"></div>
        </div>
        <div style="font-size: 10px; color: #666; margin-top: 4px;">${value}</div>
        <div style="font-size: 8px; color: #999; writing-mode: vertical-rl; text-orientation: mixed; height: 60px; overflow: hidden;">${color}</div>
      </div>
    `;
  }

  return `
    <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; overflow-x: auto;">
      <div style="display: flex; justify-content: center; align-items: flex-end;">
        ${barsHtml}
      </div>
    </div>
  `;
}

/**
 * Send ChromoBio test results email to user with CC to Valérie
 */
export async function sendChromoBioResults(
  email: string,
  name: string,
  language: string = 'fr',
  results: ChromoBioTestResults
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@coeurdelom.fr';

  const subjects = {
    fr: 'Vos résultats ChromoBioÉnergie - Coeur de l\'OM',
    en: 'Your ChromoBioEnergy Results - Coeur de l\'OM',
    de: 'Ihre ChromoBioEnergie-Ergebnisse - Coeur de l\'OM',
  };

  const lang = language.toLowerCase() as 'fr' | 'en' | 'de';
  const subject = subjects[lang] || subjects.fr;

  // Generate color visualization
  const colorBarHtml = generateColorBarHtml(results.colorValues);

  // Build interpretation sections
  const interpretationHtml = `
    <div style="margin: 20px 0;">
      <h3 style="color: #e74c3c; margin-bottom: 10px;">En excès</h3>
      <p style="background: #fdf2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #e74c3c;">
        ${results.briefInterpretation.excess}
      </p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #27ae60; margin-bottom: 10px;">Équilibré</h3>
      <p style="background: #f2fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
        ${results.briefInterpretation.balanced}
      </p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #3498db; margin-bottom: 10px;">En déficience</h3>
      <p style="background: #f2f8fd; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
        ${results.briefInterpretation.deficient}
      </p>
    </div>
  `;

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; background: #f9f9f9;">
        <div style="max-width: 700px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">Vos Résultats ChromoBioÉnergie</h1>
            <p style="color: #666;">Test réalisé le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <p>Bonjour ${name},</p>
          <p>Merci d'avoir réalisé le test ChromoBioÉnergie. Voici vos résultats :</p>

          <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px;">
            Votre Profil Chromatique
          </h2>

          ${colorBarHtml}

          <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin-top: 30px;">
            Interprétation brève
          </h2>

          ${interpretationHtml}

          <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin-top: 30px;">
            Interprétation approfondie
          </h2>

          <div style="background: #f8f5ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            ${results.detailedInterpretation.split('\n').map(p => `<p style="margin: 10px 0;">${p}</p>`).join('')}
          </div>

          <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); color: white; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">Envie d'aller plus loin ?</h3>
            <p style="margin: 0 0 15px 0;">Valérie peut vous accompagner pour une exploration approfondie de votre profil chromatique avec les Flacons Équilibre d'Aura-Soma.</p>
            <a href="https://www.coeurdelom.fr/fr/contact" style="display: inline-block; background: white; color: #7C3AED; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold;">
              Prendre rendez-vous
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="font-size: 12px; color: #666; text-align: center;">
            Coeur de l'OM<br>
            140, Rue du Pioch de Boutonnet B1<br>
            34090 Montpellier<br>
            contact@coeurdelom.fr
          </p>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Coeur de l\'OM <contact@coeurdelom.fr>',
      to: email,
      cc: adminEmail,
      subject,
      html,
    });
    console.log(`✅ ChromoBio results email sent to ${email} (CC: ${adminEmail})`);
    return true;
  } catch (error) {
    console.error('Error sending ChromoBio results email:', error);
    return false;
  }
}
