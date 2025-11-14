import sgMail from '@sendgrid/mail';

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    return false;
  }

  try {
    await sgMail.send({
      to,
      from: from || process.env.SENDGRID_FROM_EMAIL || 'contact@coeurdelom.fr',
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
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
