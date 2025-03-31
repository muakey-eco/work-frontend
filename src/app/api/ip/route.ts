import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const ip = request.headers.get('x-real-ip')

  return NextResponse.json({ ip })
}
