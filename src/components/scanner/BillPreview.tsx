import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  FileText,
  Calendar,
  Coins,
  Wallet,
  Building,
} from 'lucide-react';
import { BillCategory, LineItem } from '../../types';
import { CATEGORY_CONFIG } from '../../lib/data';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '../../lib/currency';

interface BillPreviewProps {
  imageUrl?: string;
  initialData: {
    providerName: string;
    category: BillCategory;
    billDate: string;
    dueDate?: string;
    totalAmount: number;
    currency?: string;
    currencySymbol?: string;
    lineItems: LineItem[];
  };
  onConfirm: (confirmedData: {
    providerName: string;
    category: BillCategory;
    billDate: string;
    dueDate?: string;
    totalAmount: number;
    currency: string;
    currencySymbol?: string;
    lineItems: LineItem[];
    ocrRawText?: string;
  }) => void;
  onBack: () => void;
  isProcessing?: boolean;
}

export const BillPreview: React.FC<BillPreviewProps> = ({
  imageUrl,
  initialData,
  onConfirm,
  onBack,
  isProcessing = false,
}) => {
  const [providerName, setProviderName] = useState(initialData.providerName || '');
  const [category, setCategory] = useState<BillCategory>(initialData.category || 'electricity');
  const [billDate, setBillDate] = useState(initialData.billDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [totalAmount, setTotalAmount] = useState<number>(initialData.totalAmount || 0);
  const [currency, setCurrency] = useState<string>(initialData.currency || 'PKR');
  const [currencySymbol, setCurrencySymbol] = useState<string>(initialData.currencySymbol || 'Rs.');
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData.lineItems && initialData.lineItems.length > 0
      ? initialData.lineItems
      : [
          {
            id: 'li-new-1',
            name: 'Base Service Rate',
            amount: +(initialData.totalAmount * 0.75).toFixed(2),
            type: 'base_charge',
            explanation: 'Standard service fee extracted from bill document.',
            isAnomaly: false,
          },
          {
            id: 'li-new-2',
            name: 'Taxes & Regulatory Surcharges',
            amount: +(initialData.totalAmount * 0.25).toFixed(2),
            type: 'tax',
            explanation: 'Local government taxes and franchise fees.',
            isAnomaly: false,
          },
        ]
  );

  const categories: BillCategory[] = [
    'electricity',
    'water',
    'gas',
    'internet',
    'hospital',
    'retail',
    'insurance',
    'other',
  ];

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      name: 'New Itemized Charge',
      amount: 10.0,
      type: 'base_charge',
      explanation: 'User added line item',
      isAnomaly: false,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, val: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      providerName: providerName || 'Utility Provider',
      category,
      billDate,
      dueDate,
      totalAmount: Number(totalAmount) || 0,
      currency: currency || 'PKR',
      currencySymbol: currencySymbol || 'Rs.',
      lineItems,
      ocrRawText: `Extracted OCR for ${providerName}. Total: ${currencySymbol || 'Rs.'}${totalAmount}`,
    });
  };

  return (
    <div className="space-y-5 pb-24 pt-2 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scanner
        </button>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Step 2: Confirm OCR
        </span>
      </div>

      {/* Captured Image Preview Thumbnail */}
      {imageUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 max-h-48 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Bill Scan"
            className="w-full h-48 object-contain"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-semibold flex items-center gap-1">
            <Edit2 className="w-3 h-3" /> OCR Extracted
          </div>
        </div>
      )}

      {/* Confirmation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3.5">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Key Bill Metadata
          </h3>

          {/* Provider Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-500" /> Provider / Company Name
            </label>
            <input
              type="text"
              required
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g. Metro Electric Power"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" /> Bill Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BillCategory)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Bill Date
              </label>
              <input
                type="date"
                required
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Total Amount & Currency Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-500" /> Total Amount Due
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-extrabold text-sm text-indigo-600 dark:text-indigo-400 select-none">
                  {currencySymbol || getCurrencySymbol(currency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-lg font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrency(val);
                  const sym = getCurrencySymbol(val);
                  setCurrencySymbol(sym);
                }}
                className="w-full px-2 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Line Items Table Section */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Itemized Line Items ({lineItems.length})
            </h3>
            <button
              type="button"
              onClick={handleAddLineItem}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2"
              >
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateLineItem(item.id, 'name', e.target.value)}
                    placeholder="Charge name"
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none border-b border-transparent focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={item.type}
                      onChange={(e) => handleUpdateLineItem(item.id, 'type', e.target.value)}
                      className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-300"
                    >
                      <option value="base_charge">Base Charge</option>
                      <option value="fee">Fee / Surcharge</option>
                      <option value="tax">Tax</option>
                      <option value="discount">Discount</option>
                    </select>
                  </div>
                </div>

                <div className="w-20 shrink-0 flex items-center gap-1">
                  <span className="text-xs text-slate-400 font-bold">{currencySymbol || getCurrencySymbol(currency)}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) =>
                      handleUpdateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)
                    }
                    className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteLineItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Primary CTA */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Gemini AI Analysis...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Bill with Gemini AI &rarr;</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
