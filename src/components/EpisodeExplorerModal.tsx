import { useState, useMemo } from 'react';
import type { Episode } from '../types/episode';
import { X, Search, Star, Filter } from 'lucide-react';

interface EpisodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  onSelectEpisode: (ep: Episode) => void;
}

export const EpisodeExplorerModal: React.FC<EpisodeExplorerModalProps> = ({
  isOpen,
  onClose,
  episodes,
  onSelectEpisode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<number | 'all'>('all');

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      if (selectedSeason !== 'all' && ep.season !== selectedSeason) {
        return false;
      }
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      return (
        ep.title.toLowerCase().includes(term) ||
        ep.titleEn.toLowerCase().includes(term) ||
        ep.synopsis.toLowerCase().includes(term) ||
        ep.iconicQuote.toLowerCase().includes(term) ||
        ep.quoteCharacter.toLowerCase().includes(term) ||
        ep.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [episodes, searchTerm, selectedSeason]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-500" />
              <span>Explorador de Episodios de The Office</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Busca por título en español o inglés, frase, o personaje
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Season filters */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej. Dinner Party, Michael, Pretzel, Boda, Jim..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
              autoFocus
            />
          </div>

          {/* Season pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Temporada:
            </span>
            <button
              onClick={() => setSelectedSeason('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedSeason === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSeason === s
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                T{s}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-500 px-1">
            Encontrados: {filteredEpisodes.length} capítulos
          </div>

          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No se encontraron episodios con esa búsqueda.</p>
            </div>
          ) : (
            filteredEpisodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => {
                  onSelectEpisode(ep);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      T{ep.season} • E{ep.episode}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {ep.title}
                    </span>
                    <span className="text-xs text-slate-400 italic hidden md:inline">
                      ({ep.titleEn})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {ep.synopsis}
                  </p>
                  <p className="text-[11px] text-amber-800/80 italic mt-0.5 truncate">
                    💬 "{ep.iconicQuote}"
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{ep.imdbRating.toFixed(1)}</span>
                  </div>
                  <button className="text-xs font-bold text-white bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 px-3 py-1 rounded-lg transition-colors">
                    Seleccionar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
