// Vercel turns this file into a serverless function.
// It simply re-uses the exact same Express app (and all its /api routes:
// /api/ocr-scan, /api/analyze-bill, /api/ask-charge, /api/health)
// that already exists in server.ts — no logic is duplicated or changed.
import app from '../server';

export default app;
