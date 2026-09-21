import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createJobStore } from '@/services/job-store';
import { config } from '@/config/config';
import { signJobToken } from '@/lib/auth';

const stripe = new Stripe(config.stripe.secretKey || '', {
  apiVersion: '2024-04-10' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    const jobStore = await createJobStore();
    const job = await jobStore.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const baseUrl = config.app.url;
    const token = await signJobToken(jobId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Virtual Staging',
              description: `Staging: ${job.roomType} - ${job.designStyle}`,
            },
            unit_amount: config.pricing.stagingPriceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/stage`,
      customer_email: undefined,
    });

    await jobStore.updateJob(jobId, {
      status: 'checkout_created',
      stripeCheckoutSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const jobStore = await createJobStore();
    const jobs = await jobStore.listJobs();
    const job = jobs.find((j: any) => j.stripeCheckoutSessionId === sessionId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await jobStore.updateJob(job.jobId, {
      status: 'paid',
      pricePaid: config.pricing.stagingPriceCents,
    });

    const token = await signJobToken(job.jobId);

    return NextResponse.json({ jobId: job.jobId, token });
  } catch (error) {
    console.error('Verify checkout error:', error);
    return NextResponse.json({ error: 'Failed to verify checkout' }, { status: 500 });
  }
}
