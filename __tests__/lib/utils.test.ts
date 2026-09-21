import { formatPrice, generateJobId } from '@/lib/utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('should format cents as USD currency', () => {
      const result = formatPrice(900);
      expect(result).toBe('$9.00');
    });

    it('should handle large amounts', () => {
      const result = formatPrice(99999);
      expect(result).toContain('$');
      expect(result).toContain('999.99');
    });
  });

  describe('generateJobId', () => {
    it('should generate unique job IDs', () => {
      const id1 = generateJobId();
      const id2 = generateJobId();

      expect(id1).toContain('job_');
      expect(id2).toContain('job_');
      expect(id1).not.toBe(id2);
    });
  });
});
