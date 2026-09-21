import { NextRequest, NextResponse } from 'next/server';
import { createJobStore } from '@/services/job-store';
import { generateJobId } from '@/lib/utils';
import { validateImageFile } from '@/lib/validation';
import { config } from '@/config/config';
import { signJobToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const roomType = formData.get('roomType') as string;
    const designStyle = formData.get('designStyle') as string;
    const stagingMode = formData.get('stagingMode') as string;
    const customInstruction = formData.get('customInstruction') as string | undefined;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 });
    }

    const validation = validateImageFile(imageFile);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const jobId = generateJobId();
    const jobStore = await createJobStore();

    const job = {
      jobId,
      status: 'uploaded' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inputPath: `inputs/${jobId}.jpg`,
      roomType: roomType as any,
      stagingMode: stagingMode as any,
      designStyle: designStyle as any,
      customInstruction,
      pricePaid: 0,
      currency: 'USD',
      generationProvider: config.imageGeneration.mockProvider ? 'mock' : 'openai',
      imageModel: config.imageGeneration.model,
    };

    await jobStore.saveJob(job);

    const token = await signJobToken(jobId);

    return NextResponse.json({ jobId, token }, { status: 201 });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const jobStore = await createJobStore();
    const jobs = await jobStore.listJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Job list error:', error);
    return NextResponse.json({ error: 'Failed to list jobs' }, { status: 500 });
  }
}
