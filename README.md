# LuxeStage AI

AI-powered virtual staging for luxury real estate photography.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Mobile-first staging**: Upload and stage photos directly from your phone
- **Multiple export formats**: MLS, high-resolution, Instagram Feed, Instagram Story
- **Privacy-first**: Private blob storage, EXIF stripping, signed access tokens
- **One-tap checkout**: Stripe integration with $9 per staging
- **AI-powered**: OpenAI image editing with luxury real estate-specific prompts
- **No subscriptions**: Pay per staging, no recurring charges

## Architecture

```
Phone Photo
  ↓
Private Upload (Vercel Blob)
  ↓
Sanitize / Strip EXIF
  ↓
Stripe Checkout
  ↓
Verify Payment (server-side)
  ↓
AI Image Edit (OpenAI)
  ↓
Private Master Result
  ↓
MLS / Instagram Export
  ↓
Secure Download (signed URLs)
```

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Configuration
STAGING_PRICE_CENTS=900
IMAGE_MODEL=gpt-image-2
JOB_SIGNING_SECRET=your-secret-key
INPUT_RETENTION_HOURS=24
RESULT_RETENTION_DAYS=30
MOCK_IMAGE_PROVIDER=false

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Development

### Mock Mode

Run with AI mocks to test the full flow without API keys:

```bash
MOCK_IMAGE_PROVIDER=true pnpm dev
```

### Testing

```bash
pnpm test
pnpm test:coverage
```

### Linting & Type Checking

```bash
pnpm lint
pnpm tsc
```

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in environment variables
4. Configure webhook at `/api/stripe/webhook` to listen for `checkout.session.completed`

## Image Provider Setup

### OpenAI

1. Create an account at [openai.com](https://platform.openai.com)
2. Generate an API key
3. Set `OPENAI_API_KEY` environment variable
4. The system uses the `gpt-image-2` model for image editing

## Vercel Blob Setup

1. Connect your GitHub repository to Vercel
2. In Vercel dashboard, create a Blob Store for this project
3. Vercel automatically sets up OIDC authentication
4. The application will use the configured Blob store for storage

## Data Retention

- **Unpaid uploads**: Deleted after 24 hours
- **Completed jobs**: Retained for 30 days then deleted
- **Generation locks**: Cleaned up after completion or timeout

Configure via `INPUT_RETENTION_HOURS` and `RESULT_RETENTION_DAYS`.

## Deployment

### Vercel

```bash
vercel link
vercel env pull
vercel deploy --prod
```

After deployment, update your Stripe webhook to:

```
https://yourdomain.com/api/stripe/webhook
```

## Security

- **Server-side validation**: Zod for all inputs
- **Private storage**: All user photos in private Vercel Blob
- **Signed tokens**: Job access via cryptographically signed JWTs
- **EXIF stripping**: Automatic removal of GPS and metadata
- **HTTPS only**: Secure cookies in production
- **No client secrets**: All API keys server-only

See [SECURITY.md](./SECURITY.md) for details.

## Legal

- **Privacy**: See [/privacy](/privacy) page
- **Terms**: See [/terms](/terms) page
- **Virtual Staging Disclosure**: Users are responsible for disclosing staging where required by their MLS

## Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Storage**: Vercel Private Blob
- **Payments**: Stripe
- **AI**: OpenAI image editing
- **Validation**: Zod
- **Auth**: jose (JWT signing)
- **Images**: sharp (processing)
- **Package Manager**: pnpm

## License

MIT
