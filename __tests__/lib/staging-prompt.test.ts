import { buildStagingPrompt } from '@/lib/staging-prompt';

describe('stagingPrompt', () => {
  it('should build a staging prompt with base architecture-preservation rules', () => {
    const prompt = buildStagingPrompt('living-room', 'modern-luxury', 'empty-room');

    expect(prompt).toContain('Virtually stage this real-estate listing photograph');
    expect(prompt).toContain('Preserve the original');
    expect(prompt).toContain('No people');
  });

  it('should include room-specific and style-specific guidance', () => {
    const prompt = buildStagingPrompt('kitchen', 'coastal-luxury', 'empty-room');

    // Kitchen guidance must protect installed fixtures.
    expect(prompt).toContain('Do not replace cabinetry, countertops or installed appliances');
    // Coastal style guidance.
    expect(prompt.toLowerCase()).toContain('nautical');
  });

  it('should include custom instruction when provided', () => {
    const custom = 'Use warm tones with a cream sofa';
    const prompt = buildStagingPrompt('primary-bedroom', 'scandinavian', 'restyle', custom);

    expect(prompt).toContain(custom);
  });

  it('should distinguish empty-room from restyle modes', () => {
    const empty = buildStagingPrompt('living-room', 'modern-luxury', 'empty-room');
    const restyle = buildStagingPrompt('living-room', 'modern-luxury', 'restyle');

    expect(empty).not.toEqual(restyle);
    expect(restyle).toContain('restyle movable furniture');
  });

  it('should not exceed a reasonable length', () => {
    const prompt = buildStagingPrompt(
      'kitchen',
      'coastal-luxury',
      'restyle',
      'Very long instruction with many details'
    );

    expect(prompt.length).toBeLessThan(5000);
  });
});
