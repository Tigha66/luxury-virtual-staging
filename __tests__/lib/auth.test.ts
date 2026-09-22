/**
 * @jest-environment node
 */
import { signJobToken, verifyJobToken } from '@/lib/auth';

describe('job token signing', () => {
  it('should sign and verify a job token round-trip', async () => {
    const token = await signJobToken('job_123');
    const verified = await verifyJobToken(token);

    expect(verified).not.toBeNull();
    expect(verified?.jobId).toBe('job_123');
  });

  it('should reject a tampered token', async () => {
    const token = await signJobToken('job_abc');
    const tampered = token.slice(0, -3) + 'xyz';
    const verified = await verifyJobToken(tampered);

    expect(verified).toBeNull();
  });

  it('should reject a garbage token', async () => {
    const verified = await verifyJobToken('not-a-real-token');
    expect(verified).toBeNull();
  });

  it('should not grant access to a different job id', async () => {
    const token = await signJobToken('job_owner');
    const verified = await verifyJobToken(token);

    expect(verified?.jobId).not.toBe('job_intruder');
  });
});
