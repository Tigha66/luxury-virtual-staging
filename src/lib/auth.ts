import { jwtVerify, SignJWT } from 'jose';
import { config } from '@/config/config';

const secret = new TextEncoder().encode(config.job.signingSecret || 'dev-secret-key');

export async function signJobToken(jobId: string): Promise<string> {
  const token = await new SignJWT({ jobId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function verifyJobToken(token: string): Promise<{ jobId: string } | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return { jobId: verified.payload.jobId as string };
  } catch {
    return null;
  }
}
