import { NextResponse } from 'next/server';
import spec from '@/lib/openapi';

export function GET() {
  return NextResponse.json(spec);
}
