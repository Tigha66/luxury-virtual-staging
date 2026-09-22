export default function Terms() {
  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-stone">
        <h1>Terms of Service</h1>

        <h2>Acceptance of Terms</h2>
        <p>
          By using LuxeStage AI, you agree to these Terms of Service. If you do not agree, please do not use our Service.
        </p>

        <h2>Your Responsibilities</h2>
        <ul>
          <li>You must own or have permission to use all photos you upload</li>
          <li>You warrant that uploaded photos do not violate any third-party rights</li>
          <li>You are responsible for reviewing staged results for accuracy and appropriateness</li>
          <li>You must comply with applicable MLS and real estate regulations in your jurisdiction</li>
        </ul>

        <h2>Virtual Staging Disclosure</h2>
        <p>
          Virtual staging adds or restyles movable furnishings and décor. It should not be used to misrepresent permanent
          property features or condition. You are responsible for disclosing virtual staging to buyers and listing sites as
          required by your local MLS rules and regulations. Different MLS organizations have different disclosure requirements.
        </p>

        <h2>AI-Generated Content</h2>
        <p>
          Staged images are AI-generated and may contain errors or unrealistic elements. AI may hallucinate details not
          present in the original photo. Always review staged images carefully before using them in listings. You remain
          solely responsible for the accuracy and appropriateness of images you publish.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, LuxeStage AI shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of the Service, including but not limited to damages from
          inaccurate staged images, failed transactions, or service interruptions.
        </p>

        <h2>Payment Terms</h2>
        <p>
          All charges are non-refundable except as required by law. Transactions are processed through Stripe and subject to
          Stripe&apos;s terms and conditions.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Your continued use of the Service constitutes acceptance of
          modified terms.
        </p>
      </div>
    </main>
  );
}
