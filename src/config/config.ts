export const config = {
  app: {
    name: 'LuxeStage AI',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  pricing: {
    stagingPriceCents: parseInt(process.env.STAGING_PRICE_CENTS || '900', 10),
  },
  imageGeneration: {
    model: process.env.IMAGE_MODEL || 'gpt-image-2',
    mockProvider: process.env.MOCK_IMAGE_PROVIDER === 'true',
  },
  retention: {
    inputHours: parseInt(process.env.INPUT_RETENTION_HOURS || '24', 10),
    resultDays: parseInt(process.env.RESULT_RETENTION_DAYS || '30', 10),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  job: {
    signingSecret: process.env.JOB_SIGNING_SECRET,
  },
};

export function validateConfig(): string[] {
  const missing: string[] = [];

  if (!config.stripe.secretKey) missing.push('STRIPE_SECRET_KEY');
  if (!config.openai.apiKey && !config.imageGeneration.mockProvider) {
    missing.push('OPENAI_API_KEY');
  }
  if (!config.job.signingSecret) missing.push('JOB_SIGNING_SECRET');

  return missing;
}
