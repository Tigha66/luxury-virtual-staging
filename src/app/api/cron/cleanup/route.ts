import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Cleanup stale jobs and files
    // In production: delete unpaid jobs older than INPUT_RETENTION_HOURS
    // delete completed jobs older than RESULT_RETENTION_DAYS
    // delete stale generation locks

    return NextResponse.json({
      message: 'Cleanup job completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
