# Security Policy

## Overview

LuxeStage AI is a privacy-first application handling sensitive real estate photos. This document outlines our security practices and commitments.

## Data Protection

### User Photos

- All uploaded photos are stored in **private Vercel Blob storage**
- Photos are never exposed through public URLs
- Media is served through authenticated API routes only
- Access requires a cryptographically signed, time-limited token

### Metadata Removal

- EXIF data is automatically stripped from all uploads
- GPS coordinates are removed to protect property privacy
- Temporary files are deleted after processing

### Retention

- Unpaid uploads: Deleted after 24 hours
- Completed jobs: Retained for 30 days, then deleted
- Automatic cleanup via scheduled Vercel Cron

## Input Validation

- **File size**: Limited to 20 MB
- **MIME types**: Only image formats allowed (JPG, PNG, WebP, HEIC)
- **Zod validation**: All API inputs validated server-side
- **Filename sanitization**: Special characters removed
- **SQL/NoSQL injection**: N/A (no traditional database)
- **XSS prevention**: React auto-escaping + CSP headers

## Authentication & Authorization

### Job Access

- Jobs accessed via signed JWT tokens
- Tokens expire after 24 hours
- Tokens contain only job ID (no sensitive data)
- HTTP-only cookies in production
- Secure flag enabled in production

## Payment Security

- **Stripe**: All payment processing through Stripe
- **PCI compliance**: We never store card details
- **Webhook verification**: All Stripe events cryptographically verified
- **No payment info in logs**: Sensitive data never logged
- **Server-side verification**: Payment verified before generation

## API Security

### Endpoints

- All user-data endpoints require signed token
- Rate limiting via Vercel
- CORS properly scoped
- CSP headers configured
- X-Frame-Options set to DENY

### Secrets Management

- All secrets in Vercel environment variables
- Never committed to git
- Never logged or printed
- Rotated regularly

## Third-Party Services

### OpenAI

- Images sent to OpenAI for generation
- Processed per OpenAI's privacy policy
- No image storage by default
- API key secured as environment variable

### Stripe

- Payment processing only
- Customer email collected by Stripe only
- Webhook secret verified on every event

## Development Security

- TypeScript strict mode enforced
- ESLint rules prevent common vulnerabilities
- `node_modules` never committed
- `.env` files in .gitignore
- Git hooks enforce pre-commit checks

## Incident Response

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Email security concerns to the maintainers
3. Include details and reproduction steps
4. We will respond within 24 hours
5. Coordinated disclosure appreciated

## Compliance

- **GDPR**: Privacy policy compliant
- **CCPA**: User data control honored
- **HIPAA**: Not applicable (real estate only)
- **PCI-DSS**: Compliant via Stripe

## Monitoring

- Server logs reviewed for errors
- Stripe dashboard monitored for fraud
- No personal data in application logs
- Failed job cleanup to prevent data accumulation

## Future Security Measures

- [ ] Rate limiting per IP
- [ ] CAPTCHA for repeated failures
- [ ] Advanced fraud detection
- [ ] Email verification for result access
- [ ] Two-factor auth for bulk operations

## Questions?

Contact the development team with security questions.
