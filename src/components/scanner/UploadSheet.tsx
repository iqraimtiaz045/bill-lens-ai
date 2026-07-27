import React, { useRef } from 'react';
import { Camera, Image, FileText, X, Sparkles, AlertCircle } from 'lucide-react';
import { BillCategory } from '../../types';
import { SAMPLE_BILL_PRESETS } from '../../lib/data';

interface UploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCamera: () => void;
  onFileSelected: (file: File) => void;
  onSelectPreset: (preset: typeof SAMPLE_BILL_PRESETS[0]) => void;
}

export const UploadSheet: React.FC<UploadSheetProps> = ({
  isOpen,
  onClose,
  onStartCamera,
  onFileSelected,
  onSelectPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = '';
      onFileSelected(file);
      onClose();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xl animate-in slide-in-from-bottom duration-250">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Add a Bill for AI Analysis
              </h3>
              <p className="text-xs text-slate-500">Scan or select a photo of your bill</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="hidden"
        />

        <div className="space-y-3">
          {/* Camera Scan Button */}
          <button
            onClick={() => {
              onClose();
              onStartCamera();
            }}
            className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold">Scan with Camera</span>
              <span className="block text-xs text-indigo-100 font-normal">
                Capture live photo with auto document guidelines
              </span>
            </div>
          </button>

          {/* Upload from Gallery Button & Dropzone */}
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
              isDragging
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 border-dashed ring-2 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
              <Image className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold">
                {isDragging ? 'Drop Bill File Here' : 'Choose Photo or PDF'}
              </span>
              <span className="block text-xs text-slate-500 font-normal">
                {isDragging ? 'Release to upload document' : 'Upload JPG, PNG, or PDF bill document from device'}
              </span>
            </div>
          </button>

          {/* Try Sample Preset Section */}
          <div className="pt-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Or Try a Sample Bill (Instant Demo)
            </span>
            <div className="space-y-2">
              {SAMPLE_BILL_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {preset.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ${preset.totalAmount.toFixed(2)} • {preset.providerName}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    Try &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
