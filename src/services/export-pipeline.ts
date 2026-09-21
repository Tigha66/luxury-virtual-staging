import { parse } from 'url';

export interface ExportOptions {
  addDisclosureLabel?: boolean;
}

export async function exportMLS(
  sourceImageBuffer: Buffer,
  options: ExportOptions = {}
): Promise<Buffer> {
  const { default: sharp } = await import('sharp');

  let image = sharp(sourceImageBuffer).resize(2048, 2048, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (options.addDisclosureLabel) {
    const label = Buffer.from(`
      <svg width="2048" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="2048" height="100" fill="rgba(0,0,0,0.7)"/>
        <text x="20" y="60" fill="white" font-size="48" font-family="Arial">
          Virtually Staged
        </text>
      </svg>
    `);
    image = image.composite([{ input: label, gravity: 'south' }]);
  }

  return image.jpeg({ quality: 90 }).toBuffer();
}

export async function exportHighRes(sourceImageBuffer: Buffer): Promise<Buffer> {
  const { default: sharp } = await import('sharp');
  return sharp(sourceImageBuffer).jpeg({ quality: 95 }).toBuffer();
}

export async function exportInstagramFeed(sourceImageBuffer: Buffer): Promise<Buffer> {
  const { default: sharp } = await import('sharp');
  return sharp(sourceImageBuffer)
    .resize(1080, 1350, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function exportInstagramStory(sourceImageBuffer: Buffer): Promise<Buffer> {
  const { default: sharp } = await import('sharp');
  return sharp(sourceImageBuffer)
    .resize(1080, 1920, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toBuffer();
}
