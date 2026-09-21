import { z } from 'zod';
import { RoomType, DesignStyle, StagingMode } from '@/types';

export const stagingRequestSchema = z.object({
  roomType: z.enum([
    'living-room',
    'primary-bedroom',
    'guest-bedroom',
    'dining-room',
    'home-office',
    'kitchen',
    'entry-foyer',
    'outdoor-patio',
  ] as const),
  designStyle: z.enum([
    'modern-luxury',
    'warm-contemporary',
    'organic-modern',
    'transitional',
    'scandinavian',
    'mid-century-modern',
    'coastal-luxury',
    'minimalist-luxury',
  ] as const),
  stagingMode: z.enum(['empty-room', 'restyle'] as const),
  customInstruction: z.string().max(500).optional(),
});

export type StagingRequest = z.infer<typeof stagingRequestSchema>;

export const imageValidation = {
  maxSizeBytes: 20 * 1024 * 1024,
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
};

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > imageValidation.maxSizeBytes) {
    return {
      valid: false,
      error: `Image must be smaller than ${imageValidation.maxSizeBytes / 1024 / 1024}MB`,
    };
  }

  if (!imageValidation.allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported image format. Use JPG, PNG, WebP, or HEIC.',
    };
  }

  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .toLowerCase()
    .slice(0, 255);
}
