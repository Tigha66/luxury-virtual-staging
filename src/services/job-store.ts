import { StagingJob } from '@/types';

export interface JobStore {
  saveJob(job: StagingJob): Promise<void>;
  getJob(jobId: string): Promise<StagingJob | null>;
  updateJob(jobId: string, updates: Partial<StagingJob>): Promise<void>;
  listJobs(): Promise<StagingJob[]>;
  deleteJob(jobId: string): Promise<void>;
}

export interface BlobStore {
  put(path: string, data: Buffer | string, options?: any): Promise<void>;
  get(path: string): Promise<Buffer | null>;
  delete(path: string): Promise<void>;
  head(path: string): Promise<{ size: number; uploadedAt: Date } | null>;
  list(prefix?: string): Promise<Array<{ pathname: string; uploadedAt: Date; size: number }>>;
}

let blobStoreInstance: BlobStore | null = null;

export async function initializeBlobStore(): Promise<BlobStore> {
  if (blobStoreInstance) return blobStoreInstance;

  // Try to use Vercel Blob if available
  try {
    const blob = await import('@vercel/blob');
    const { put: blobPut, del: blobDel } = blob;

    blobStoreInstance = {
      put: async (path: string, data: Buffer | string) => {
        const buffer = typeof data === 'string' ? Buffer.from(data) : data;
        await blobPut(path, buffer, { access: 'private' } as any);
      },
      get: async (path: string) => {
        try {
          const response = await fetch(`https://blob.vercel-storage.com/${path}`);
          if (!response.ok) return null;
          return Buffer.from(await response.arrayBuffer());
        } catch {
          return null;
        }
      },
      delete: async (path: string) => {
        await blobDel(path);
      },
      head: async (path: string) => {
        try {
          const response = await fetch(`https://blob.vercel-storage.com/${path}`, {
            method: 'HEAD',
          });
          if (!response.ok) return null;
          const size = response.headers.get('content-length');
          return {
            size: size ? parseInt(size, 10) : 0,
            uploadedAt: new Date(),
          };
        } catch {
          return null;
        }
      },
      list: async () => {
        // Mock implementation - would need Vercel Blob list API
        return [];
      },
    };
  } catch {
    throw new Error('Vercel Blob not configured. Set up @vercel/blob integration.');
  }

  return blobStoreInstance;
}

export async function createJobStore(): Promise<JobStore> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = await initializeBlobStore() as any;
  const blobStore: BlobStore = store;

  const jobStoreInstance: JobStore = {
    async saveJob(job: StagingJob): Promise<void> {
      const path = `jobs/${job.jobId}.json`;
      await blobStore.put(path, JSON.stringify(job));
    },

    async getJob(jobId: string): Promise<StagingJob | null> {
      const path = `jobs/${jobId}.json`;
      const data = await blobStore.get(path);
      if (!data) return null;
      try {
        return JSON.parse(data.toString());
      } catch {
        return null;
      }
    },

    async updateJob(jobId: string, updates: Partial<StagingJob>): Promise<void> {
      const job = await jobStoreInstance.getJob(jobId);
      if (!job) throw new Error(`Job ${jobId} not found`);
      const updated = { ...job, ...updates, updatedAt: new Date().toISOString() };
      await jobStoreInstance.saveJob(updated);
    },

    async listJobs(): Promise<StagingJob[]> {
      const blobs = await blobStore.list('jobs/');
      const jobs: StagingJob[] = [];
      for (const blob of blobs) {
        const data = await blobStore.get(blob.pathname);
        if (data) {
          try {
            jobs.push(JSON.parse(data.toString()));
          } catch {
            // Skip invalid job files
          }
        }
      }
      return jobs;
    },

    async deleteJob(jobId: string): Promise<void> {
      const path = `jobs/${jobId}.json`;
      await blobStore.delete(path);
    },
  };

  return jobStoreInstance;
}

