export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function generateLockId(jobId: string): string {
  return `locks/${jobId}.json`;
}

export function sanitizePath(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '_');
}
