import { RoomType, DesignStyle, StagingMode } from '@/types';
import { buildStagingPrompt } from '@/lib/staging-prompt';

export interface ImageStagingResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface ImageStagingProvider {
  stageImage(
    inputImageUrl: string,
    roomType: RoomType,
    designStyle: DesignStyle,
    stagingMode: StagingMode,
    customInstruction?: string
  ): Promise<ImageStagingResult>;
}

export class OpenAIImageStagingProvider implements ImageStagingProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-image-2') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async stageImage(
    inputImageUrl: string,
    roomType: RoomType,
    designStyle: DesignStyle,
    stagingMode: StagingMode,
    customInstruction?: string
  ): Promise<ImageStagingResult> {
    const { OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: this.apiKey });

    const prompt = buildStagingPrompt(roomType, designStyle, stagingMode, customInstruction);

    const response = await client.images.edit({
      image: inputImageUrl as any,
      prompt,
      n: 1,
      size: '1024x1024',
    });

    return {
      imageUrl: response.data?.[0]?.url || '',
      revisedPrompt: response.data?.[0]?.revised_prompt,
    };
  }
}

export class MockImageStagingProvider implements ImageStagingProvider {
  async stageImage(): Promise<ImageStagingResult> {
    // Return a simple placeholder or generated mock
    return {
      imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"%3E%3Crect fill="%23f5f5f0" width="1024" height="1024"/%3E%3Ctext x="512" y="512" text-anchor="middle" dy=".3em" fill="%23999" font-size="48"%3EMocked staged image%3C/text%3E%3C/svg%3E',
      revisedPrompt: 'This is a mock staging result for development',
    };
  }
}

export function createStagingProvider(
  apiKey: string | undefined,
  model: string,
  mockMode: boolean
): ImageStagingProvider {
  if (mockMode) {
    return new MockImageStagingProvider();
  }

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for real image staging');
  }

  return new OpenAIImageStagingProvider(apiKey, model);
}
