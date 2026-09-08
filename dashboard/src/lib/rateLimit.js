// DB-backed (not in-memory) rate limiter — an in-memory counter would reset
// per serverless cold start and be trivially bypassed. Adapted from the
// sister project's lib/chat/rateLimit.ts; this project uses @supabase/ssr
// instead of postgres.js, and it calls the admin_ratelimit_hit RPC
// (SECURITY DEFINER, atomic) so the counter table stays RLS-locked and the
// anon-key SSR client can still update it. See
// supabase/migrations/*_add_rate_limits.sql.

async function hashKey(raw) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Fixed-window rate limit on (bucket, ip).
 *
 * @param sb           Supabase server client (adminClient()).
 * @param bucket       Logical namespace, e.g. "login".
 * @param ip           Raw client IP; hashed before storage.
 * @param windowSeconds Window size.
 * @param maxCount     Max hits per window before returning { allowed: false }.
 * @returns { allowed: boolean, retryAfterSeconds?: number }
 */
export async function checkRateLimit(sb, bucket, ip, windowSeconds, maxCount) {
  const key = await hashKey(`${bucket}:${ip}`)
  const { data, error } = await sb.rpc('admin_ratelimit_hit', {
    k: key,
    window_seconds: windowSeconds,
    max_count: maxCount,
  })
  if (error) {
    // Fail-open on infra error rather than locking every user out — the
    // Supabase logs will surface the misconfiguration.
    return { allowed: true }
  }
  if (data === false) {
    return { allowed: false, retryAfterSeconds: windowSeconds }
  }
  return { allowed: true }
}

export function clientIp(req) {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
