export type RoomType =
  | 'living-room'
  | 'primary-bedroom'
  | 'guest-bedroom'
  | 'dining-room'
  | 'home-office'
  | 'kitchen'
  | 'entry-foyer'
  | 'outdoor-patio';

export type DesignStyle =
  | 'modern-luxury'
  | 'warm-contemporary'
  | 'organic-modern'
  | 'transitional'
  | 'scandinavian'
  | 'mid-century-modern'
  | 'coastal-luxury'
  | 'minimalist-luxury';

export type StagingMode = 'empty-room' | 'restyle';

export type JobStatus =
  | 'uploaded'
  | 'checkout_created'
  | 'paid'
  | 'generating'
  | 'complete'
  | 'failed';

export interface StagingJob {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  inputPath: string;
  roomType: RoomType;
  stagingMode: StagingMode;
  designStyle: DesignStyle;
  customInstruction?: string;
  pricePaid: number;
  currency: string;
  stripeCheckoutSessionId?: string;
  generationProvider: string;
  imageModel: string;
  generationStartTime?: string;
  generationCompletionTime?: string;
  masterOutputPath?: string;
  exportPaths?: {
    mls?: string;
    highRes?: string;
    instagramFeed?: string;
    instagramStory?: string;
  };
  errorCode?: string;
  errorMessage?: string;
}

export interface UploadedImage {
  jobId: string;
  originalPath: string;
  cleanedPath: string;
  width: number;
  height: number;
  mimeType: string;
}

export const ROOM_TYPES: { label: string; value: RoomType }[] = [
  { label: 'Living Room', value: 'living-room' },
  { label: 'Primary Bedroom', value: 'primary-bedroom' },
  { label: 'Guest Bedroom', value: 'guest-bedroom' },
  { label: 'Dining Room', value: 'dining-room' },
  { label: 'Home Office', value: 'home-office' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Entry / Foyer', value: 'entry-foyer' },
  { label: 'Outdoor / Patio', value: 'outdoor-patio' },
];

export const DESIGN_STYLES: { label: string; value: DesignStyle }[] = [
  { label: 'Modern Luxury', value: 'modern-luxury' },
  { label: 'Warm Contemporary', value: 'warm-contemporary' },
  { label: 'Organic Modern', value: 'organic-modern' },
  { label: 'Transitional', value: 'transitional' },
  { label: 'Scandinavian', value: 'scandinavian' },
  { label: 'Mid-Century Modern', value: 'mid-century-modern' },
  { label: 'Coastal Luxury', value: 'coastal-luxury' },
  { label: 'Minimalist Luxury', value: 'minimalist-luxury' },
];

export const STAGING_MODES: { label: string; value: StagingMode; description: string }[] = [
  {
    label: 'Stage Empty Room',
    value: 'empty-room',
    description: 'Best for vacant rooms',
  },
  {
    label: 'Restyle Existing Room',
    value: 'restyle',
    description: 'Replace or visually restyle furniture (Beta)',
  },
];
