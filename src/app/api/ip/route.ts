import { NextResponse } from 'next/server'

export const GET = async () => {
  const ip = await fetch('https://api64.ipify.org?format=json')
    .then((res) => res.json())
    .then(({ ip }) => ip)

  return NextResponse.json({ ip })
}
