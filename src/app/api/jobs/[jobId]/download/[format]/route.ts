import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { createStagingProvider } from '@/services/image-provider';
import { config } from '@/config/config';
import { verifyJobToken } from '@/lib/auth';
import { exportMLS, exportHighRes, exportInstagramFeed, exportInstagramStory } from '@/services/export-pipeline';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string; format: string } }
) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const disclosure = request.nextUrl.searchParams.get('disclosure') === 'true';

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

    if (job.status !== 'complete') {
      return NextResponse.json({ error: 'Staging not complete' }, { status: 400 });
    }

    if (!job.masterOutputPath) {
      return NextResponse.json({ error: 'No output available' }, { status: 404 });
    }

    // Mock response for now - in production would fetch from blob storage
    const mockBuffer = Buffer.from('mock image data');
    let exportBuffer: Buffer = mockBuffer;

    if (params.format === 'mls') {
      exportBuffer = await exportMLS(mockBuffer, { addDisclosureLabel: disclosure });
    } else if (params.format === 'highRes') {
      exportBuffer = await exportHighRes(mockBuffer);
    } else if (params.format === 'instagramFeed') {
      exportBuffer = await exportInstagramFeed(mockBuffer);
    } else if (params.format === 'instagramStory') {
      exportBuffer = await exportInstagramStory(mockBuffer);
    }

    const filename = `${params.jobId}_${params.format}.jpg`;

    return new NextResponse(exportBuffer as any, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download' }, { status: 500 });
  }
}
