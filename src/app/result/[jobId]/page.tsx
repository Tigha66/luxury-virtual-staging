'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StagingJob } from '@/types';

export default function ResultPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<StagingJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDisclosure, setAddDisclosure] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const token = new URLSearchParams(window.location.search).get('token');
        const response = await fetch(`/api/jobs/${params.jobId}?token=${token}`);

        if (!response.ok) {
          throw new Error('Failed to load result');
        }

        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [params.jobId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-stone-600">Loading your result...</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Unable to load result</h1>
          <p className="text-stone-600 mb-8">{error}</p>
          <Link href="/stage" className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
            Stage another photo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">Your staged photo is ready</h1>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200 mb-8">
          <div className="bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg aspect-video flex items-center justify-center mb-6">
            <p className="text-stone-600">[Before/after comparison slider]</p>
          </div>

          {job.status === 'complete' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addDisclosure}
                    onChange={(e) => setAddDisclosure(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-stone-900">Add "Virtually Staged" label to exports</span>
                </label>
              </div>

              <p className="text-xs text-stone-600 px-3">
                Different MLSs have different disclosure requirements. Check your local MLS rules.
              </p>
            </div>
          )}
        </div>

        {job.status === 'generating' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Staging your photo</h2>
            <div className="space-y-3 text-stone-600">
              <p>• Securing your photo</p>
              <p>• Analyzing the room</p>
              <p>• Designing the space</p>
              <p>• Rendering furnishings</p>
              <p>• Preparing exports</p>
            </div>
            <p className="text-sm text-stone-600 mt-8">This may take a few minutes. You can close this page—we'll keep your result.</p>
          </div>
        )}

        {job.status === 'complete' && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { name: 'MLS Standard', format: 'mls' },
              { name: 'High Resolution', format: 'highRes' },
              { name: 'Instagram Feed', format: 'instagramFeed' },
              { name: 'Instagram Story', format: 'instagramStory' },
            ].map((item) => (
              <button
                key={item.format}
                onClick={() => {
                  window.location.href = `/api/jobs/${job.jobId}/download/${item.format}?disclosure=${addDisclosure}`;
                }}
                className="p-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-left"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm opacity-75">Download</p>
              </button>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/stage" className="px-8 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
            Stage another photo
          </Link>
        </div>
      </div>
    </main>
  );
}
