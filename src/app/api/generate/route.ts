import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { createStagingProvider } from '@/services/image-provider';
import { config } from '@/config/config';
import { verifyJobToken } from '@/lib/auth';
import { generateLockId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;
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

    if (job.status !== 'paid') {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
    }

    await jobStore.updateJob(jobId, {
      status: 'generating',
      generationStartTime: new Date().toISOString(),
    });

    const provider = createStagingProvider(
      config.openai.apiKey,
      config.imageGeneration.model,
      config.imageGeneration.mockProvider
    );

    try {
      const result = await provider.stageImage(
        'mock://input', // In production, would be signed URL to private blob
        job.roomType as any,
        job.designStyle as any,
        job.stagingMode as any,
        job.customInstruction
      );

      await jobStore.updateJob(jobId, {
        status: 'complete',
        masterOutputPath: `outputs/${jobId}/master.jpg`,
        generationCompletionTime: new Date().toISOString(),
        exportPaths: {
          mls: `exports/${jobId}/mls.jpg`,
          highRes: `exports/${jobId}/high-res.jpg`,
          instagramFeed: `exports/${jobId}/instagram-feed.jpg`,
          instagramStory: `exports/${jobId}/instagram-story.jpg`,
        },
      });

      return NextResponse.json({
        status: 'complete',
        jobId,
        outputPath: `outputs/${jobId}/master.jpg`,
      });
    } catch (error) {
      await jobStore.updateJob(jobId, {
        status: 'failed',
        errorCode: 'GENERATION_FAILED',
        errorMessage: error instanceof Error ? error.message : 'Generation failed',
      });

      throw error;
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
