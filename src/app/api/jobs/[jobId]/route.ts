import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { verifyJobToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verified = await verifyJobToken(token);
    if (!verified || verified.jobId !== params.jobId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobStore = await createJobStore();
    const job = await jobStore.getJob(params.jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Failed to get job' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verified = await verifyJobToken(token);
    if (!verified || verified.jobId !== params.jobId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const jobStore = await createJobStore();
    await jobStore.updateJob(params.jobId, updates);

    const job = await jobStore.getJob(params.jobId);
    return NextResponse.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}
