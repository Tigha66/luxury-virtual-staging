import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { verifyJobToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verified = await verifyJobToken(token);
    if (!verified || verified.jobId !== jobId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobStore = await createJobStore();
    const job = await jobStore.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Failed to get job' }, { status: 500 });
  }
}
