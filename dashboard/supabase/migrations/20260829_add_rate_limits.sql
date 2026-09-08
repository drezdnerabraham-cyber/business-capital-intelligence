-- Rate-limit counter table used by /api/auth to throttle failed logins.
-- Modelled after chat_rate_limits in backstone-capital-connect.
--
-- Only a SHA-256-hashed IP (or ip+route key) is stored — no raw IPs or
-- credentials. Callers use the admin_ratelimit_hit() RPC below (SECURITY
-- DEFINER, atomic) rather than reading/writing the table directly, so the
-- table stays RLS-locked and no policies are needed.

CREATE TABLE IF NOT EXISTS chat_rate_limits (
  key TEXT PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies — access is only via admin_ratelimit_hit().

-- Atomically bumps the counter for `k` within a `window_seconds` window.
-- Returns TRUE if the caller is under `max_count` (allowed), FALSE if over
-- (should 429). Uses SECURITY DEFINER so the anon-key SSR client can call it
-- without the caller needing write access to the table.
CREATE OR REPLACE FUNCTION admin_ratelimit_hit(
  k TEXT,
  window_seconds INT,
  max_count INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_existing chat_rate_limits%ROWTYPE;
  now_ts TIMESTAMPTZ := NOW();
BEGIN
  SELECT * INTO row_existing FROM chat_rate_limits WHERE key = k FOR UPDATE;

  IF NOT FOUND OR (now_ts - row_existing.window_start) >= (window_seconds || ' seconds')::INTERVAL THEN
    INSERT INTO chat_rate_limits (key, window_start, count)
      VALUES (k, now_ts, 1)
      ON CONFLICT (key) DO UPDATE SET window_start = now_ts, count = 1;
    RETURN TRUE;
  END IF;

  IF row_existing.count >= max_count THEN
    RETURN FALSE;
  END IF;

  UPDATE chat_rate_limits SET count = count + 1 WHERE key = k;
  RETURN TRUE;
END;
$$;

-- Anon role needs EXECUTE so the SSR client (which uses the anon key) can
-- invoke it. The function itself does the enforcement; the table stays locked.
GRANT EXECUTE ON FUNCTION admin_ratelimit_hit(TEXT, INT, INT) TO anon, authenticated;
