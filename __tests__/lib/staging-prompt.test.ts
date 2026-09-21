import { buildStagingPrompt } from '@/lib/staging-prompt';
import { ROOM_TYPES, DESIGN_STYLES } from '@/types';

describe('stagingPrompt', () => {
  it('should build a staging prompt with room and style instructions', () => {
    const prompt = buildStagingPrompt('living-room', 'modern-luxury', 'empty-room');

    expect(prompt).toContain('Virtually stage this real-estate listing photograph');
    expect(prompt).toContain('living-room');
    expect(prompt).toContain('modern-luxury');
  });

  it('should include custom instruction when provided', () => {
    const custom = 'Use warm tones';
    const prompt = buildStagingPrompt('primary-bedroom', 'scandinavian', 'restyle', custom);

    expect(prompt).toContain(custom);
  });

  it('should not exceed reasonable length', () => {
    const prompt = buildStagingPrompt(
      'kitchen',
      'coastal-luxury',
      'restyle',
      'Very long instruction with many details'
    );

    expect(prompt.length).toBeLessThan(5000);
  });
});
