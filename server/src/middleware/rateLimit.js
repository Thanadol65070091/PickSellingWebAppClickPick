const buckets = new Map();

export function rateLimit({ windowMs = 60000, max = 10 } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const winStart = now - windowMs;
    const b = buckets.get(key) || { count: 0, ts: now };
    if (b.ts < winStart) { b.count = 0; b.ts = now; }
    b.count += 1;
    buckets.set(key, b);
    if (b.count > max) return res.status(429).json({ error: 'Too many requests' });
    next();
  };
}
