import { NextResponse } from 'next/server';

// Endpoint health check — dùng cho CI/CD blue-green deploy (deploy-ssh.yml gọi path này).
export function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
