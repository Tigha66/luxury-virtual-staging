import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createJobStore } from '@/services/job-store';
import { config } from '@/config/config';

export const runtime = 'nodejs';

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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const jobStore = await createJobStore();
      const jobs = await jobStore.listJobs();
      const job = jobs.find((j) => j.stripeCheckoutSessionId === session.id);

      // Idempotent: only fulfill a job still awaiting payment.
      if (job && job.status === 'checkout_created') {
        await jobStore.updateJob(job.jobId, {
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
