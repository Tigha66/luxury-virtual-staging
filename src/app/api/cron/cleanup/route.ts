import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { config } from '@/config/config';

export const runtime = 'nodejs';

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  // Vercel Cron sends the configured secret as a Bearer token.
  if (!cronSecret) return true;
  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobStore = await createJobStore();
    const jobs = await jobStore.listJobs();
    const now = Date.now();

    const inputMaxAgeMs = config.retention.inputHours * 60 * 60 * 1000;
    const resultMaxAgeMs = config.retention.resultDays * 24 * 60 * 60 * 1000;

    let deleted = 0;

    for (const job of jobs) {
      const ageMs = now - new Date(job.createdAt).getTime();
      const isUnpaid = job.status === 'uploaded' || job.status === 'checkout_created';
      const isTerminal = job.status === 'complete' || job.status === 'failed';

      if (isUnpaid && ageMs > inputMaxAgeMs) {
        await jobStore.deleteJob(job.jobId);
        deleted += 1;
      } else if (isTerminal && ageMs > resultMaxAgeMs) {
        await jobStore.deleteJob(job.jobId);
        deleted += 1;
      }
    }

    return NextResponse.json({
      message: 'Cleanup complete',
      deleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
