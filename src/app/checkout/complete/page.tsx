'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    async function verifyPayment() {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          setError('No session ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        setRedirecting(true);
        router.push(`/result/${data.jobId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    verifyPayment();
  }, [router]);

  if (redirecting) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-stone-600">Processing your order...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-stone-600">Verifying payment...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Payment error</h1>
        <p className="text-stone-600 mb-8">{error}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors">
            Return home
          </Link>
          <Link
            href="/stage"
            className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    </main>
  );
}
