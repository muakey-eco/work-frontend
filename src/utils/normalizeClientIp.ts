export function normalizeClientIp(xForwardedFor?: string | null): string {
  const rawIp = xForwardedFor?.split(',')[0]?.trim()

  if (!rawIp || rawIp === '::1') {
    return '127.0.0.1'
  }

  if (rawIp.startsWith('::ffff:')) {
    return rawIp.replace('::ffff:', '')
  }

  return rawIp
}
