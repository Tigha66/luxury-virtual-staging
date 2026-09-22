'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutInner() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCheckout() {
      try {
        const jobId = searchParams.get('jobId');
        if (!jobId) {
          setError('Missing job reference');
          return;
        }

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Checkout is not available yet');
        }

        const data = await response.json();
        if (data.url) {
          window.location.assign(data.url);
        } else {
          throw new Error('Checkout is not available yet');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }

    startCheckout();
  }, [searchParams]);

  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Checkout unavailable</h1>
          <p className="text-stone-600 mb-8">{error}</p>
          <Link
            href="/stage"
            className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Back to staging
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-lg text-stone-600">Opening secure checkout...</p>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-stone-50 flex items-center justify-center">
          <p className="text-lg text-stone-600">Loading...</p>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
