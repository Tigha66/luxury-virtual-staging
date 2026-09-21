import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createJobStore } from '@/services/job-store';
import { config } from '@/config/config';
import { verifyStripeWebhookSignature } from '@/lib/utils';

const stripe = new Stripe(config.stripe.secretKey || '', {
  apiVersion: '2024-04-10' as any,
});

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();

    if (!signature || !config.stripe.webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const verified = await verifyStripeWebhookSignature(
      body,
      signature,
      config.stripe.webhookSecret
    );

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const jobStore = await createJobStore();
      const jobs = await jobStore.listJobs();
      const job = jobs.find((j) => j.stripeCheckoutSessionId === session.id);

      if (job && job.status === 'checkout_created') {
        await jobStore.updateJob((job as any).jobId, {
          status: 'paid',
          pricePaid: config.pricing.stagingPriceCents,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
