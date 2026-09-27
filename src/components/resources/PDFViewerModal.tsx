import React, { useState } from 'react';
import { AcademicResourceItem } from '../../types/notesAndResources';
import { Button } from '../ui/Button';
import {
  X,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Share2,
  Printer,
  Check,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface PDFViewerModalProps {
  isOpen: boolean;
  resource: AcademicResourceItem | null;
  onClose: () => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  resource,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !resource) return null;

  const handleDownload = () => {
    setIsDownloaded(true);
    showToast({
      type: 'success',
      title: 'PDF Downloaded',
      message: `Downloaded "${resource.title}".`,
    });
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate max-w-md font-display">
                {resource.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {resource.subject} · {resource.fileSizeOrFormat || 'PDF Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 text-xs h-8 gap-1.5 cursor-pointer"
            >
              {isDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isDownloaded ? 'Saved' : 'Download'}</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewing Area */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-8 overflow-y-auto flex items-center justify-center">
          <div
            className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 space-y-6 transition-transform select-none min-h-[500px]"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Mock PDF Document Page */}
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Study Zone Academic Archive
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  {resource.title}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Subject: {resource.subject} · Document ID: {resource.id} · Page {currentPage} of {totalPages}
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono">
                Official Examination Copy
              </div>
            </div>

            {/* Document Body Sample */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {resource.previewContent ? (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs whitespace-pre-wrap">
                  {resource.previewContent}
                </div>
              ) : (
                <p>
                  This official academic syllabus reference document provides full examination derivations,
                  problem statements, and verified marking rubrics.
                </p>
              )}

              <p>
                <strong>Section {currentPage}.1: Analytical Principles & Foundational Invariants</strong>
              </p>
              <p>
                All physical and mathematical derivations contained within this section must strictly adhere to SI
                dimensional units. In problems involving vector transformations, verify orthogonality and check
                boundary conditions before formulating the final characteristic polynomial.
              </p>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs font-mono text-emerald-950">
                {'Formula Block: f(x) = ∑ [f^(k)(a) / k!] * (x - a)^k (Taylor Series Expansion)'}
              </div>

              <p className="text-slate-500 text-xs italic">
                [Study Zone Authenticated PDF Reader · Clean High-Fidelity Rendering Preview]
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Zoom Controls */}
        <div className="px-5 py-3 bg-slate-800/90 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
