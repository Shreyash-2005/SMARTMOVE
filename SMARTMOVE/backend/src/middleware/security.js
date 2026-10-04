const buckets = new Map();

export function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
}

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 120, message = "Too many requests. Please try again later." } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now - b.started > windowMs) b = { started: now, count: 0 };
    b.count += 1; buckets.set(key, b);
    if (b.count > max) return res.status(429).json({ message });
    next();
  };
}

export function authRateLimit() {
  return rateLimit({ windowMs: 10 * 60 * 1000, max: 20, message: "Too many authentication attempts. Please wait 10 minutes." });
}

export function cleanString(value, max = 255) {
  return String(value ?? "").trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max);
}
