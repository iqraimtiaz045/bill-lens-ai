// Vercel turns this file into a serverless function.
// It simply re-uses the exact same Express app (and all its /api routes:
// /api/ocr-scan, /api/analyze-bill, /api/ask-charge, /api/health)
// that already exists in server.ts — no logic is duplicated or changed.
import app from '../server.js';

// IMPORTANT: Vercel normally auto-parses the request body itself before
// it reaches this function. That conflicts with Express's own
// express.json() middleware in server.ts (used to read the base64 bill
// image), causing POST requests to fail with a 500 error. Disabling
// Vercel's parser here lets Express handle the body like it normally does.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
