import type { Episode } from '../types/episode';
import { X, Trash2, History as HistoryIcon, Star, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: Episode[];
  onSelectEpisode: (ep: Episode) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEpisode,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Historial de la sesión
            </h3>
            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Aún no has tirado la ruleta.</p>
              <p className="text-xs text-slate-400 mt-1">
                Los capítulos que te salgan aparecerán aquí.
              </p>
            </div>
          ) : (
            history.map((ep, idx) => (
              <div
                key={`${ep.id}-${idx}`}
                onClick={() => {
                  onSelectEpisode(ep);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 bg-white transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    T{ep.season} • E{ep.episode}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{ep.imdbRating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="font-bold text-slate-900 text-sm group-hover:text-amber-900">
                  {ep.title}
                </div>
                <div className="text-xs text-slate-500 italic mb-1.5">
                  "{ep.titleEn}"
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {ep.synopsis}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end text-[11px] font-semibold text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver de nuevo</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {history.length} capítulos registrados
            </span>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar historial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
