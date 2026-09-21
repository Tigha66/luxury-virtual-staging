'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROOM_TYPES, DESIGN_STYLES, STAGING_MODES, RoomType, DesignStyle, StagingMode } from '@/types';

interface StageFormState {
  roomType: RoomType;
  designStyle: DesignStyle;
  stagingMode: StagingMode;
  customInstruction: string;
}

export default function StagePage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'select' | 'review'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [form, setForm] = useState<StageFormState>({
    roomType: 'living-room',
    designStyle: 'modern-luxury',
    stagingMode: 'empty-room',
    customInstruction: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be smaller than 20MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type)) {
      setError('Unsupported image format. Use JPG, PNG, WebP, or HEIC.');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setStep('select');
  };

  const handleContinue = () => {
    if (!uploadedFile) {
      setError('Please upload an image');
      return;
    }
    setStep('review');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('roomType', form.roomType);
      formData.append('designStyle', form.designStyle);
      formData.append('stagingMode', form.stagingMode);
      if (form.customInstruction) {
        formData.append('customInstruction', form.customInstruction);
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create job');
      }

      const data = await response.json();
      router.push(`/checkout?jobId=${data.jobId}&token=${data.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/" className="inline-block text-stone-600 hover:text-stone-900 mb-8">
          ← Back to home
        </Link>

        <h1 className="text-3xl font-serif font-bold mb-8">Stage your photo</h1>

        {step === 'upload' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-semibold mb-6">Upload your photo</h2>

            <div className="border-2 border-dashed border-stone-300 rounded-lg p-12 text-center hover:border-stone-400 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <p className="text-lg font-medium text-stone-900 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-stone-600">JPG, PNG, WebP, or HEIC • Max 20MB</p>
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-6 p-4 bg-stone-50 rounded-lg">
                <p className="text-sm text-stone-600">Selected: {uploadedFile.name}</p>
              </div>
            )}

            {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            <button
              onClick={handleContinue}
              disabled={!uploadedFile}
              className="mt-8 w-full bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'select' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('review'); }} className="space-y-6">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
              <h2 className="text-xl font-semibold mb-6">Select room type</h2>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.value}
                    type="button"
                    onClick={() => setForm({ ...form, roomType: room.value })}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      form.roomType === room.value
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-50 text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
              <h2 className="text-xl font-semibold mb-6">Select design style</h2>
              <div className="grid grid-cols-2 gap-3">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setForm({ ...form, designStyle: style.value })}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      form.designStyle === style.value
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-50 text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
              <h2 className="text-xl font-semibold mb-6">Staging mode</h2>
              <div className="space-y-3">
                {STAGING_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setForm({ ...form, stagingMode: mode.value })}
                    className={`w-full p-4 rounded-lg text-left transition-colors border ${
                      form.stagingMode === mode.value
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-900 hover:border-stone-400'
                    }`}
                  >
                    <div className="font-semibold">{mode.label}</div>
                    <div className="text-sm opacity-75">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
              <h2 className="text-xl font-semibold mb-6">Custom instruction (optional)</h2>
              <textarea
                value={form.customInstruction}
                onChange={(e) => setForm({ ...form, customInstruction: e.target.value.slice(0, 500) })}
                placeholder="e.g., Neutral palette with cream sofa and walnut accents"
                className="w-full p-3 border border-stone-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <p className="text-xs text-stone-600 mt-2">{form.customInstruction.length}/500</p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="flex-1 py-3 rounded-lg font-semibold border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
              >
                Review
              </button>
            </div>
          </form>
        )}

        {step === 'review' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-semibold mb-6">Review your staging</h2>

            <div className="space-y-4 mb-8 pb-8 border-b border-stone-200">
              <div>
                <p className="text-sm text-stone-600">Room type</p>
                <p className="font-semibold text-stone-900">
                  {ROOM_TYPES.find((r) => r.value === form.roomType)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Design style</p>
                <p className="font-semibold text-stone-900">
                  {DESIGN_STYLES.find((s) => s.value === form.designStyle)?.label}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Staging mode</p>
                <p className="font-semibold text-stone-900">
                  {STAGING_MODES.find((m) => m.value === form.stagingMode)?.label}
                </p>
              </div>
              {form.customInstruction && (
                <div>
                  <p className="text-sm text-stone-600">Custom instruction</p>
                  <p className="font-semibold text-stone-900">{form.customInstruction}</p>
                </div>
              )}
            </div>

            <div className="mb-8 p-4 bg-blue-50 text-blue-900 rounded-lg text-sm">
              <p>
                <strong>Note:</strong> I confirm that I have the right to use this image and understand that virtual
                staging should be disclosed where required.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="flex-1 py-3 rounded-lg font-semibold border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Stage this photo — $9'}
              </button>
            </div>

            {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          </div>
        )}
      </div>
    </main>
  );
}
