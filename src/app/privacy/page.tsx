export default function Privacy() {
  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-stone">
        <h1>Privacy Policy</h1>

        <h2>Introduction</h2>
        <p>
          LuxeStage AI (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects the privacy of our
          users (&quot;User&quot;, &quot;you&quot;, &quot;your&quot;).
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you use our Service, we collect the following information:
        </p>
        <ul>
          <li>Photos you upload for staging</li>
          <li>Styling preferences you select</li>
          <li>Your email address (through Stripe payment processing)</li>
        </ul>

        <h2>Photo Storage and Retention</h2>
        <p>
          Uploaded photos and staged results are stored in private, encrypted cloud storage. We retain generated results for
          30 days. Unpaid uploads are deleted after 24 hours. You may request deletion of your data at any time.
        </p>

        <h2>Metadata Removal</h2>
        <p>
          We automatically strip EXIF data, GPS metadata, and other sensitive location information from all uploaded photos.
        </p>

        <h2>Payment Information</h2>
        <p>
          Payment processing is handled by Stripe. We do not store credit card details. You can review Stripe&apos;s privacy
          policy at stripe.com/privacy.
        </p>

        <h2>Image Generation</h2>
        <p>
          Staged images are generated using OpenAI&apos;s image editing API. OpenAI processes your image for generation purposes.
          Please review OpenAI&apos;s privacy policy for details.
        </p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes are effective when posted to the Service.</p>
      </div>
    </main>
  );
}
