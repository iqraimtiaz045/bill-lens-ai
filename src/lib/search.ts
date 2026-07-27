import { Bill } from '../types';

/**
 * Smart bill search matcher that checks provider name, account number (masked and digits),
 * category keywords/aliases (English & Urdu), total amounts, line items, dates, and AI summaries.
 */
export function matchesBillQuery(bill: Bill, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const digitsOnlyQ = q.replace(/\D/g, '');

  // 1. Check provider name (e.g. "LESCO (Lahore Electric Supply)", "SNGPL", "PTCL Flash Fiber", "WASA Lahore")
  if (bill.providerName.toLowerCase().includes(q)) return true;

  // 2. Check category key (e.g. "electricity", "gas", "internet", "water")
  if (bill.category.toLowerCase().includes(q)) return true;

  // 3. Check category synonyms / translations / provider keywords
  const categoryAliases: Record<string, string[]> = {
    electricity: [
      'electricity', 'electric', 'power', 'bijli', 'lesco', 'ke', 'k-electric', 'fesco', 'iesco',
      'mepco', 'gepco', 'pesco', 'qesco', 'hesco', 'sepco', 'بجلی', 'الیکٹرک'
    ],
    gas: [
      'gas', 'sui gas', 'sngpl', 'ssgc', 'sui northern', 'sui southern', 'گیس', 'سوئی گیس'
    ],
    internet: [
      'internet', 'wifi', 'broadband', 'fiber', 'ptcl', 'flash fiber', 'stormfiber', 'nayatel', 'انٹرنیٹ', 'فائبر'
    ],
    water: [
      'water', 'wasa', 'kwsb', 'cda', 'sanitation', 'drainage', 'پانی', 'واسا'
    ],
    retail: [
      'mobile', 'postpaid', 'jazz', 'zong', 'telenor', 'ufone', 'موبائل', 'فون'
    ],
    hospital: [
      'hospital', 'medical', 'clinic', 'lab', 'doctor', 'chughtai', 'میڈیکل', 'لیب'
    ],
    insurance: [
      'insurance', 'tax', 'state life', 'efu', 'property tax', 'انشورنس'
    ],
  };

  const aliases = categoryAliases[bill.category] || [];
  if (aliases.some((alias) => alias.includes(q) || q.includes(alias))) return true;

  // 4. Check account number (both verbatim and digits-only match)
  if (bill.accountNumberMasked) {
    const accLower = bill.accountNumberMasked.toLowerCase();
    if (accLower.includes(q)) return true;
    const accDigits = accLower.replace(/\D/g, '');
    if (digitsOnlyQ && digitsOnlyQ.length >= 2 && accDigits && accDigits.includes(digitsOnlyQ)) return true;
  }

  // 5. Check ID
  if (bill.id.toLowerCase().includes(q)) return true;

  // 6. Check total amount (e.g., "28450", "28,450", "4820", "3750", "1850")
  const amtStr = bill.totalAmount.toString();
  const formattedAmt = bill.totalAmount.toLocaleString();
  if (amtStr.includes(q) || formattedAmt.includes(q) || (digitsOnlyQ && digitsOnlyQ.length >= 3 && amtStr.includes(digitsOnlyQ))) {
    return true;
  }

  // 7. Check bill/due dates
  if (bill.billDate && bill.billDate.includes(q)) return true;
  if (bill.dueDate && bill.dueDate.includes(q)) return true;

  // 8. Check OCR text or AI analysis text
  if (bill.ocrRawText && bill.ocrRawText.toLowerCase().includes(q)) return true;
  if (bill.aiAnalysis?.plainSummary && bill.aiAnalysis.plainSummary.toLowerCase().includes(q)) return true;

  // 9. Check line items
  if (
    bill.lineItems &&
    bill.lineItems.some(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.explanation && item.explanation.toLowerCase().includes(q))
    )
  ) {
    return true;
  }

  return false;
}
