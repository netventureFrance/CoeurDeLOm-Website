# Security Checklist - Before Launch

## Completed

- [x] Airtable formula injection protection (`lib/airtable.ts`)
- [x] Admin JWT authentication with HMAC-SHA256
- [x] HttpOnly, Secure, SameSite cookies
- [x] Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- [x] File upload validation (type + size limits)
- [x] GDPR consent required for data collection
- [x] API keys in environment variables only

## Before Launch

### High Priority

- [ ] **Add Turnstile CAPTCHA** to forms (contact + chromobio)
  - Sign up at https://dash.cloudflare.com/ (free)
  - Add site key to env: `TURNSTILE_SITE_KEY`
  - Add secret key to env: `TURNSTILE_SECRET_KEY`
  - Forms: contact, chromobio-pretest

- [ ] **Add honeypot field** to forms (extra bot protection)
  - Hidden field that bots fill but humans don't
  - Reject submissions where honeypot has value

### Medium Priority

- [ ] **Add rate limiting** to API endpoints
  - Option 1: Netlify Functions rate limiting
  - Option 2: Simple in-memory counter with IP tracking
  - Protect: /api/contact, /api/chromobio-pretest, /api/admin/auth

- [ ] **Add CSP header** to netlify.toml
  ```toml
  Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-src challenges.cloudflare.com;"
  ```

### Low Priority

- [ ] **Hash admin password** instead of plain text comparison
- [ ] **Add audit logging** for admin actions
- [ ] **Set up monitoring** for failed login attempts

## Testing

Before launch, test:
1. Try submitting forms with special characters (`'`, `"`, `\`)
2. Verify CAPTCHA blocks automated submissions
3. Check all security headers at https://securityheaders.com/
4. Test admin login/logout flow
