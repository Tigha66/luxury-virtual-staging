import { validateImageFile, sanitizeFilename } from '@/lib/validation';

describe('validation', () => {
  describe('validateImageFile', () => {
    it('should reject files over 20MB', () => {
      const file = new File(['x'.repeat(21 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('smaller than');
    });

    it('should accept valid image types', () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('should reject unsupported types', () => {
      const file = new File(['data'], 'test.svg', { type: 'image/svg+xml' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove special characters', () => {
      const result = sanitizeFilename('my@file#name.jpg');
      expect(result).toBe('my_file_name.jpg');
    });

    it('should lowercase the output', () => {
      const result = sanitizeFilename('MyFile.JPG');
      expect(result).toBe('myfile.jpg');
    });

    it('should limit length to 255 characters', () => {
      const long = 'a'.repeat(300) + '.jpg';
      const result = sanitizeFilename(long);

      expect(result.length).toBeLessThanOrEqual(255);
    });
  });
});
