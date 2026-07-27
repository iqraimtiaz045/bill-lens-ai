import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __dirname = process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

console.log("Gemini API Loaded:", !!process.env.GEMINI_API_KEY);
console.log("Key Prefix:", process.env.GEMINI_API_KEY?.substring(0, 4));

// Initialize Google Gen AI client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// AI OCR Vision Endpoint using Gemini Vision
app.post('/api/ocr-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType, language = 'English' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    // Clean base64 string
    const base64Clean = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
    const detectedMime = mimeType || (mimeMatch ? mimeMatch[1] : 'image/jpeg');

    const languageInstruction = language === 'Urdu'
      ? 'CRITICAL LANGUAGE INSTRUCTION: The user prefers URDU language. Write all explanations, anomaly reasons, and line item descriptions strictly in URDU script (اردو).'
      : 'Write all text output in clear, simple English.';

    const visionPrompt = `You are a precision bill and invoice scanner using OCR & Gemini Vision. Analyze the provided document image and extract all billing details. ${languageInstruction}

CRITICAL INSTRUCTIONS:
1. providerName: Extract the exact official company name, vendor, utility provider, or merchant printed on the bill (e.g., "K-Electric", "SNGPL", "LESCO", "IESCO", "PTCL", "WASA"). Do NOT return "Scanned Invoice" or file names unless completely unreadable.
2. customerName: Name of the customer/account holder visible on the bill if present, else null.
3. accountNumberMasked: Account number, bill number, or invoice reference number visible on the bill, masked or full (e.g. "INV-98231").
4. totalAmount: The net total amount payable / total due on the bill as a numeric float.
5. currency: The detected currency code (e.g. "PKR", "USD", "EUR", "GBP", "INR", "CAD", "AED", "SAR", etc.). DEFAULT to PKR if Rs., Rupees, or Pakistani providers (LESCO, K-Electric, SNGPL, PTCL, WASA) are visible!
6. currencySymbol: Display symbol for the currency (e.g. "Rs.", "PKR", "$", "€", "£").
7. billDate: Date of the bill/invoice in YYYY-MM-DD or readable date string.
8. dueDate: Payment due date in YYYY-MM-DD or readable date string if visible.
9. category: Categorize into one of: ["electricity", "gas", "water", "internet", "hospital", "retail", "insurance", "other"].
10. lineItems: Array of itemized charges visible on the bill: [{ name: string, amount: number, type: ("base_charge" | "tax" | "fee" | "adjustment" | "discount"), explanation: string, is_anomaly: boolean, anomaly_reason: string | null }].
11. ocrRawText: A short snippet of key text extracted from the bill.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: base64Clean,
              },
            },
            { text: visionPrompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            providerName: { type: Type.STRING },
            customerName: { type: Type.STRING },
            accountNumberMasked: { type: Type.STRING },
            totalAmount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            currencySymbol: { type: Type.STRING },
            billDate: { type: Type.STRING },
            dueDate: { type: Type.STRING },
            category: { type: Type.STRING },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  is_anomaly: { type: Type.BOOLEAN },
                  anomaly_reason: { type: Type.STRING },
                },
                required: ['name', 'amount', 'type', 'explanation'],
              },
            },
            ocrRawText: { type: Type.STRING },
          },
          required: ['providerName', 'totalAmount', 'currency', 'category'],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, data: parsed, source: 'gemini_vision' });
    } else {
      return res.status(500).json({ error: 'OCR processing failed', message: 'No content returned from Gemini API' });
    }
  } catch (err: any) {
    console.error('Error in /api/ocr-scan:', err);
    const errorMessage = err?.message || err?.statusText || 'Internal Server Error';
    res.status(500).json({ error: 'OCR processing failed', message: errorMessage });
  }
});

// AI Bill Analysis Endpoint
app.post('/api/analyze-bill', async (req, res) => {
  try {
    const {
      providerName,
      category,
      billDate,
      dueDate,
      totalAmount,
      currency,
      currencySymbol,
      lineItems: userLineItems,
      previousBillsSummary,
      householdContext,
      ocrText,
      language = 'English',
    } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    const detectedCurrency = currencySymbol || (currency === 'PKR' ? 'Rs.' : currency) || 'Rs.';

    // Build line items context if supplied
    const itemsContext = Array.isArray(userLineItems) && userLineItems.length > 0
      ? JSON.stringify(userLineItems)
      : 'Not explicitly itemized yet.';

    const urduSystemPrompt = `You are BillWise AI, an expert bill analysis assistant specializing in Pakistani utility bills (LESCO, K-Electric, SNGPL, SSGC, PTCL, WASA).
CRITICAL LANGUAGE REQUIREMENT: The user's preferred language is URDU.
You MUST write ALL plain_summary text, line_items explanations, anomaly_reason, savings_suggestions (titles AND details), financial_health_score factor labels & descriptions, and disclaimer strictly in URDU script (اردو).
Use PKR / Rs. / ₨ for all currency values.`;

    const englishSystemPrompt = `You are BillWise AI, an expert bill analysis assistant. You explain utility, hospital, internet, gas, water, insurance, and retail bills in simple, friendly, non-technical language for everyday consumers. Use the specified bill currency symbol (${detectedCurrency}) in all text output, and default to PKR / Rs. for Pakistani providers. You are NOT a financial advisor, lawyer, or medical professional.`;

    const systemPrompt = language === 'Urdu' ? urduSystemPrompt : englishSystemPrompt;

    const userPrompt = `ANALYZE THIS BILL (${language === 'Urdu' ? 'OUTPUT ENTIRELY IN URDU' : 'OUTPUT IN ENGLISH'}):
Category: ${category || 'general'}
Provider Name: ${providerName || 'Unknown Provider'}
Bill Date: ${billDate || 'Current'}
Due Date: ${dueDate || 'N/A'}
Currency: ${detectedCurrency}
Total Amount: ${detectedCurrency} ${totalAmount || '0.00'}
User-Provided Line Items: ${itemsContext}
OCR Raw Text Snippet: ${ocrText || 'N/A'}
Previous Bills History Context: ${JSON.stringify(previousBillsSummary || [])}
User Household Context: ${JSON.stringify(householdContext || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plain_summary: { type: Type.STRING },
            line_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  is_anomaly: { type: Type.BOOLEAN },
                  anomaly_reason: { type: Type.STRING },
                },
                required: ['name', 'amount', 'type', 'explanation', 'is_anomaly'],
              },
            },
            totals: {
              type: Type.OBJECT,
              properties: {
                subtotal: { type: Type.NUMBER },
                taxes_and_fees: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
              },
              required: ['subtotal', 'taxes_and_fees', 'total'],
            },
            comparison: {
              type: Type.OBJECT,
              properties: {
                vs_previous: { type: Type.STRING },
                percent_change: { type: Type.NUMBER },
                primary_driver: { type: Type.STRING },
              },
            },
            financial_health_score: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                label: { type: Type.STRING },
                factors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      impact: { type: Type.NUMBER },
                      description: { type: Type.STRING },
                    },
                  },
                },
              },
              required: ['score', 'label', 'factors'],
            },
            savings_suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  estimated_monthly_savings: { type: Type.NUMBER },
                  category_relevance: { type: Type.STRING },
                },
                required: ['title', 'detail', 'category_relevance'],
              },
            },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'plain_summary',
            'line_items',
            'totals',
            'financial_health_score',
            'savings_suggestions',
            'disclaimer',
          ],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, data: parsed, source: 'gemini' });
    } else {
      return res.status(500).json({ error: 'Failed to analyze bill', message: 'No content returned from Gemini API' });
    }
  } catch (err: any) {
    console.error('Error in /api/analyze-bill:', err);
    const errorMessage = err?.message || err?.statusText || 'Internal Server Error';
    res.status(500).json({ error: 'Failed to analyze bill', message: errorMessage });
  }
});

// Follow-up Q&A Endpoint ("Ask AI about this charge")
app.post('/api/ask-charge', async (req, res) => {
  try {
    const { chargeName, chargeAmount, chargeExplanation, fullBillContext, userQuestion, language = 'English' } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured on the server.' });
    }

    const languageDirective = language === 'Urdu'
      ? 'CRITICAL: Answer the user question strictly in URDU language (اردو script).'
      : 'Answer in simple, clear English.';

    const prompt = `SYSTEM: You are BillWise AI. Answer the user's question about a specific charge on their bill using the provided context. Be helpful, concise (2-4 sentences), and clear. Do NOT give legal or formal financial advice. ${languageDirective}

CHARGE CONTEXT:
Name: ${chargeName}
Amount: PKR ${chargeAmount}
Existing Explanation: ${chargeExplanation}
FULL BILL CONTEXT: ${JSON.stringify(fullBillContext || {})}

USER QUESTION: "${userQuestion}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    if (response.text) {
      return res.json({ answer: response.text.trim() });
    } else {
      return res.status(500).json({ error: 'Failed to answer question', message: 'No response generated from Gemini API' });
    }
  } catch (err: any) {
    console.error('Error in /api/ask-charge:', err);
    const errorMessage = err?.message || err?.statusText || 'Internal Server Error';
    res.status(500).json({ error: 'Failed to answer question', message: errorMessage });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`BillWise AI server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;