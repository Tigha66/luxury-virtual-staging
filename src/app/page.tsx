'use client';

import Link from 'next/link';
import { config } from '@/config/config';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white bg-opacity-95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">{config.app.name}</h1>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-stone-600 hover:text-stone-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-stone-600 hover:text-stone-900">
              Terms
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold text-stone-900 mb-6">
            Stage luxury listings in minutes, not days.
          </h2>
          <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Upload a room photo and turn it into a professionally staged, listing-ready image—right from your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href="/stage"
              className="inline-block bg-stone-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              Stage a Photo — ${(config.pricing.stagingPriceCents / 100).toFixed(2)}
            </Link>
          </div>
          <p className="text-stone-600">No subscription. MLS-friendly exports. Instagram-ready formats.</p>
        </div>
      </section>

      {/* Before/After Demo */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">See the transformation</h3>
          <div className="bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-stone-600">[Demo before/after images coming soon]</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Three simple steps</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload', desc: 'Take or upload a photo from your phone' },
              { step: '2', title: 'Select', desc: 'Choose room type and design style' },
              { step: '3', title: 'Download', desc: 'Get MLS and Instagram-ready files' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-serif font-bold text-stone-400 mb-4">{item.step}</div>
                <h4 className="text-xl font-semibold text-stone-900 mb-2">{item.title}</h4>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Choose your style</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              'Modern Luxury',
              'Warm Contemporary',
              'Organic Modern',
              'Scandinavian',
              'Mid-Century Modern',
              'Coastal Luxury',
              'Transitional',
              'Minimalist Luxury',
            ].map((style) => (
              <div key={style} className="p-4 bg-stone-50 rounded-lg text-center hover:bg-stone-100 transition-colors">
                <p className="font-semibold text-stone-900">{style}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For professionals */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Built for real estate professionals</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Real Estate Agents', desc: 'Impress buyers with polished listings' },
              { title: 'Photographers', desc: 'Deliver premium results faster' },
              { title: 'Brokerages', desc: 'Empower your entire team' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-stone-50 rounded-lg">
                <h4 className="text-lg font-semibold text-stone-900 mb-2">{item.title}</h4>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrity */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-serif font-bold mb-6">Listing integrity matters</h3>
          <p className="text-stone-600 mb-6">
            Virtual staging adds or restyles movable furnishings. It should not be used to misrepresent permanent property
            features or condition. MLS-ready export formats. Disclosure requirements vary by MLS and market.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-serif font-bold mb-8">Ready to stage your first listing?</h3>
          <Link
            href="/stage"
            className="inline-block bg-stone-900 text-white px-10 py-4 rounded-lg font-semibold hover:bg-stone-800 transition-colors text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-400 text-sm">
          <p>&copy; 2024 {config.app.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
