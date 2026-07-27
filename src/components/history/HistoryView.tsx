import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  AlertTriangle,
  ChevronRight,
  Receipt,
  Plus,
  Trash2,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { Bill, BillCategory } from '../../types';
import { CATEGORY_CONFIG } from '../../lib/data';
import { formatCurrency } from '../../lib/currency';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useLanguage } from '../../lib/i18n';
import { matchesBillQuery } from '../../lib/search';

interface HistoryViewProps {
  bills: Bill[];
  onSelectBill: (bill: Bill) => void;
  onDeleteBill: (billId: string) => void;
  onOpenUpload: () => void;
  initialCategoryFilter?: BillCategory | 'all';
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  bills,
  onSelectBill,
  onDeleteBill,
  onOpenUpload,
  initialCategoryFilter = 'all',
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);

  const categories = [
    { id: 'all', label: t('allBills') },
    { id: 'electricity', label: t('electricity') },
    { id: 'gas', label: t('gas') },
    { id: 'internet', label: t('internet') },
    { id: 'water', label: t('water') },
    { id: 'retail', label: t('retail') },
    { id: 'hospital', label: t('hospital') },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtering and Sorting logic
  const filteredBills = useMemo(() => {
    return bills
      .filter((bill) => {
        const matchesSearch = matchesBillQuery(bill, searchQuery);
        const matchesCategory =
          selectedCategory === 'all' || bill.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return b.totalAmount - a.totalAmount;
        }
        return new Date(b.billDate).getTime() - new Date(a.billDate).getTime();
      });
  }, [bills, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-5 pb-24 pt-2 animate-fade-in">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t('historyTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {bills.length} {t('historySubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenUpload}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 text-white font-extrabold text-xs shadow-md hover:from-teal-600 hover:to-sky-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> {t('addBillNow')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills Carousel & Sort */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Filter className="w-3 h-3" /> {t('filterCategory')}
          </span>
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black shrink-0 flex items-center gap-1.5 cursor-pointer hover:bg-slate-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('sortBy')}: {sortBy === 'date' ? t('newestDate') : t('highestAmount')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-xs scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bill List Timeline */}
      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No matching bills found in archive
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or filter settings.
            </p>
          </div>
        ) : (
          filteredBills.map((bill) => {
            const catConfig = CATEGORY_CONFIG[bill.category] || CATEGORY_CONFIG.other;
            const isFav = !!favorites[bill.id];

            return (
              <div
                key={bill.id}
                className="group p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all flex items-center justify-between cursor-pointer"
                onClick={() => onSelectBill(bill)}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(bill.id, e)}
                    className="p-1 text-slate-300 hover:text-amber-400 dark:text-slate-700 dark:hover:text-amber-400 transition-colors"
                    title="Mark as favorite"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isFav ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${catConfig.bgLight} ${catConfig.color}`}
                  >
                    <Receipt className="w-5.5 h-5.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {bill.providerName}
                      </h4>
                      {bill.hasAnomaly && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Anomaly
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium mt-0.5 truncate">
                      {bill.billDate} • {catConfig.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white block">
                      {formatCurrency(bill.totalAmount, 'PKR')}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center justify-end gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Analyzed
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBillToDelete(bill);
                    }}
                    className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/70 border border-rose-200/60 dark:border-rose-800/60 rounded-xl transition-all cursor-pointer shadow-xs ml-1"
                    title="Delete Bill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!billToDelete}
        itemName={billToDelete?.providerName}
        onConfirm={() => {
          if (billToDelete && onDeleteBill) {
            onDeleteBill(billToDelete.id);
          }
        }}
        onClose={() => setBillToDelete(null)}
      />
    </div>
  );
};
