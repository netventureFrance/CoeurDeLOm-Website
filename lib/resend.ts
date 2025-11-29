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

// Base URL for assets in emails
const SITE_URL = 'https://coeurdelom.fr';
// Use Netlify subdomain for logo to ensure it always loads (regardless of DNS caching)
const LOGO_URL = 'https://coeurdelom.netlify.app/images/logo.png';

/**
 * Generate email wrapper with logo and branding
 */
function generateEmailTemplate(content: string, language: string = 'fr'): string {
  const footerTexts = {
    fr: {
      visit: 'Visitez notre site',
      address: '140, Rue du Pioch de Boutonnet B1',
      city: '34090 Montpellier, France',
    },
    en: {
      visit: 'Visit our website',
      address: '140, Rue du Pioch de Boutonnet B1',
      city: '34090 Montpellier, France',
    },
    de: {
      visit: 'Besuchen Sie unsere Website',
      address: '140, Rue du Pioch de Boutonnet B1',
      city: '34090 Montpellier, Frankreich',
    },
  };

  const lang = language.toLowerCase() as 'fr' | 'en' | 'de';
  const footer = footerTexts[lang] || footerTexts.fr;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <style>
          :root { color-scheme: light; }
          @media (prefers-color-scheme: dark) {
            body, .email-body { background-color: #f5f0ff !important; }
            .email-content { background-color: #ffffff !important; color: #333333 !important; }
            .email-header { background-color: #ffffff !important; }
            p, h1, h2, h3, td, div { color: inherit !important; }
          }
        </style>
      </head>
      <body class="email-body" style="margin: 0; padding: 0; background-color: #f5f0ff !important; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f0ff !important; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header with white background -->
                <tr>
                  <td class="email-header" style="background-color: #ffffff !important; padding: 35px 30px; text-align: center; border-bottom: 3px solid #7C3AED;">
                    <img src="${LOGO_URL}" alt="Coeur de l'OM" style="height: 80px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="color: #7C3AED !important; margin: 0; font-size: 36px; font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive; font-style: italic; font-weight: normal; letter-spacing: 2px;">Cœur de l'Om</h1>
                  </td>
                </tr>

                <!-- Main content -->
                <tr>
                  <td class="email-content" style="background-color: #ffffff !important; padding: 40px 35px; color: #333333 !important;">
                    ${content}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #7C3AED 100%); padding: 30px; text-align: center;">
                    <a href="${SITE_URL}" style="display: inline-block; background: white; color: #7C3AED !important; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; margin-bottom: 20px;">
                      ${footer.visit}
                    </a>
                    <p style="color: rgba(255,255,255,0.9) !important; margin: 15px 0 5px 0; font-size: 13px;">
                      ${footer.address}<br>
                      ${footer.city}
                    </p>
                    <p style="margin: 10px 0 0 0;">
                      <a href="mailto:contact@coeurdelom.fr" style="color: white !important; text-decoration: none; font-size: 13px;">contact@coeurdelom.fr</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
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
    fr: 'Merci pour votre message - Coeur de l\'OM',
    en: 'Thank you for your message - Coeur de l\'OM',
    de: 'Vielen Dank für Ihre Nachricht - Coeur de l\'OM',
  };

  const contents = {
    fr: `
      <h1 style="color: #7C3AED; margin: 0 0 20px 0; font-size: 24px;">Merci de nous avoir contactés !</h1>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        Bonjour <strong>${name}</strong>,
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        Nous avons bien reçu votre message et nous vous en remercions chaleureusement.
      </p>

      <div style="background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); border-left: 4px solid #7C3AED; padding: 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
        <p style="color: #5B21B6; font-size: 16px; line-height: 1.6; margin: 0;">
          <strong>Valérie</strong> prendra connaissance de votre message et vous répondra personnellement dans les plus brefs délais.
        </p>
      </div>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        En attendant, n'hésitez pas à explorer notre site pour découvrir nos services de bien-être holistique, chromothérapie et accompagnement personnalisé.
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
        À très bientôt,<br>
        <strong style="color: #7C3AED;">L'équipe Coeur de l'OM</strong>
      </p>
    `,
    en: `
      <h1 style="color: #7C3AED; margin: 0 0 20px 0; font-size: 24px;">Thank you for contacting us!</h1>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        We have received your message and thank you warmly for reaching out.
      </p>

      <div style="background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); border-left: 4px solid #7C3AED; padding: 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
        <p style="color: #5B21B6; font-size: 16px; line-height: 1.6; margin: 0;">
          <strong>Valérie</strong> will review your message and respond to you personally as soon as possible.
        </p>
      </div>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        In the meantime, feel free to explore our website to discover our holistic wellness services, chromotherapy and personalized support.
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
        See you soon,<br>
        <strong style="color: #7C3AED;">The Coeur de l'OM Team</strong>
      </p>
    `,
    de: `
      <h1 style="color: #7C3AED; margin: 0 0 20px 0; font-size: 24px;">Vielen Dank für Ihre Nachricht!</h1>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        Hallo <strong>${name}</strong>,
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
        Wir haben Ihre Nachricht erhalten und danken Ihnen herzlich dafür.
      </p>

      <div style="background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); border-left: 4px solid #7C3AED; padding: 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
        <p style="color: #5B21B6; font-size: 16px; line-height: 1.6; margin: 0;">
          <strong>Valérie</strong> wird Ihre Nachricht lesen und Ihnen so schnell wie möglich persönlich antworten.
        </p>
      </div>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        In der Zwischenzeit können Sie gerne unsere Website erkunden, um unsere ganzheitlichen Wellness-Dienste, Chromotherapie und persönliche Begleitung zu entdecken.
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
        Bis bald,<br>
        <strong style="color: #7C3AED;">Das Coeur de l'OM Team</strong>
      </p>
    `,
  };

  const lang = language.toLowerCase() as 'fr' | 'en' | 'de';
  const subject = subjects[lang] || subjects.fr;
  const content = contents[lang] || contents.fr;
  const html = generateEmailTemplate(content, lang);

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

  const content = `
    <h1 style="color: #7C3AED; margin: 0 0 20px 0; font-size: 24px;">Nouveau message de contact</h1>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; background: #f5f0ff; border-radius: 8px 0 0 0; font-weight: 600; color: #5B21B6; width: 120px;">Nom</td>
        <td style="padding: 12px; background: #faf8ff; border-radius: 0 8px 0 0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f0ff; font-weight: 600; color: #5B21B6;">Email</td>
        <td style="padding: 12px; background: #faf8ff;">
          <a href="mailto:${email}" style="color: #7C3AED;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f0ff; border-radius: 0 0 0 8px; font-weight: 600; color: #5B21B6;">Newsletter</td>
        <td style="padding: 12px; background: #faf8ff; border-radius: 0 0 8px 0;">
          ${newsletterConsent
            ? '<span style="color: #059669; font-weight: 600;">Oui</span>'
            : '<span style="color: #6b7280;">Non</span>'}
        </td>
      </tr>
    </table>

    <div style="margin-top: 25px;">
      <h3 style="color: #5B21B6; margin: 0 0 10px 0; font-size: 16px;">Message :</h3>
      <div style="background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #7C3AED;">
        <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>

    <div style="margin-top: 25px; text-align: center;">
      <a href="mailto:${email}?subject=Re: Votre message sur Coeur de l'OM" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); color: white; padding: 14px 30px; border-radius: 25px; text-decoration: none; font-weight: 600;">
        Répondre à ${name}
      </a>
    </div>
  `;

  const html = generateEmailTemplate(content, 'fr');

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
      <h3 style="color: #e74c3c; margin-bottom: 10px; font-size: 16px;">En excès</h3>
      <p style="background: #fdf2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #e74c3c; margin: 0; color: #333; line-height: 1.6;">
        ${results.briefInterpretation.excess}
      </p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #27ae60; margin-bottom: 10px; font-size: 16px;">Équilibré</h3>
      <p style="background: #f2fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 0; color: #333; line-height: 1.6;">
        ${results.briefInterpretation.balanced}
      </p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #3498db; margin-bottom: 10px; font-size: 16px;">En déficience</h3>
      <p style="background: #f2f8fd; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin: 0; color: #333; line-height: 1.6;">
        ${results.briefInterpretation.deficient}
      </p>
    </div>
  `;

  const content = `
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #7C3AED; margin: 0 0 10px 0; font-size: 24px;">Vos Résultats ChromoBioÉnergie</h1>
      <p style="color: #666; margin: 0; font-size: 14px;">Test réalisé le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Bonjour <strong>${name}</strong>,
    </p>

    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Merci d'avoir réalisé le test ChromoBioÉnergie. Voici vos résultats personnalisés :
    </p>

    <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin: 0 0 20px 0; font-size: 18px;">
      Votre Profil Chromatique
    </h2>

    ${colorBarHtml}

    <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin: 30px 0 20px 0; font-size: 18px;">
      Interprétation brève
    </h2>

    ${interpretationHtml}

    <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin: 30px 0 20px 0; font-size: 18px;">
      Interprétation approfondie
    </h2>

    <div style="background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); padding: 20px; border-radius: 12px; margin: 0 0 25px 0;">
      ${results.detailedInterpretation.split('\n').map(p => `<p style="margin: 10px 0; color: #333; line-height: 1.7;">${p}</p>`).join('')}
    </div>

    <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
      <h3 style="margin: 0 0 12px 0; font-size: 18px;">Envie d'aller plus loin ?</h3>
      <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; opacity: 0.95;">
        <strong>Valérie</strong> peut vous accompagner pour une exploration approfondie de votre profil chromatique avec les Flacons Équilibre d'Aura-Soma.
      </p>
      <a href="${SITE_URL}/fr/contact" style="display: inline-block; background: white; color: #7C3AED; padding: 14px 30px; border-radius: 25px; text-decoration: none; font-weight: 600;">
        Prendre rendez-vous
      </a>
    </div>
  `;

  const html = generateEmailTemplate(content, lang);

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
