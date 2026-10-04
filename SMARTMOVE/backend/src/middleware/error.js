export function notFound(req, res) {
  res.status(404).json({ message: "API endpoint not found" });
}

// Central error handler. Anything that reaches here via next(e) is an
// *unexpected* server-side failure (DB errors, thrown exceptions, etc).
// Deliberate client-facing errors (validation, auth, 404s) are returned
// directly from controllers via res.status(...).json(...) and never
// pass through this handler, so it is always safe to hide the raw
// error message from the client here and log the details instead.
export function errorHandler(err, req, res, next) {
  const status = err.status && err.status < 500 ? err.status : 500;

  // Full details (including raw DB error text) go to the server log only.
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ->`, err);

  const clientMessage =
    status < 500
      ? err.message || "Request could not be processed"
      : "Something went wrong on our end. Please try again shortly.";

  res.status(status).json({ message: clientMessage });
}
