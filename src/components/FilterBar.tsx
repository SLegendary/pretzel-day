import { useState } from 'react';
import type { FilterOptions, EraFilter } from '../types/episode';
import { POPULAR_TAGS } from '../data/tags';
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  eligibleCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  eligibleCount,
  totalCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const setEra = (era: EraFilter) => {
    let seasons: number[] = [];
    if (era === 'all') seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    else if (era === 'michael') seasons = [1, 2, 3, 4, 5, 6, 7];
    else if (era === 'post-michael') seasons = [8, 9];
    else seasons = filters.seasons;

    onChangeFilters({
      ...filters,
      era,
      seasons,
    });
  };

  const toggleSeason = (s: number) => {
    let nextSeasons: number[];
    if (filters.seasons.includes(s)) {
      if (filters.seasons.length === 1) return; // Keep at least one
      nextSeasons = filters.seasons.filter((item) => item !== s);
    } else {
      nextSeasons = [...filters.seasons, s].sort((a, b) => a - b);
    }

    let detectedEra: EraFilter = 'custom';
    if (nextSeasons.length === 9) detectedEra = 'all';
    else if (nextSeasons.length === 7 && nextSeasons.every((val, i) => val === i + 1)) detectedEra = 'michael';
    else if (nextSeasons.length === 2 && nextSeasons.includes(8) && nextSeasons.includes(9)) detectedEra = 'post-michael';

    onChangeFilters({
      ...filters,
      era: detectedEra,
      seasons: nextSeasons,
    });
  };

  const setRating = (minRating: number) => {
    onChangeFilters({ ...filters, minRating });
  };

  const setTag = (tagId: string | null) => {
    onChangeFilters({
      ...filters,
      selectedTag: filters.selectedTag === tagId ? null : tagId,
    });
  };

  const resetFilters = () => {
    onChangeFilters({
      era: 'all',
      seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      minRating: 0,
      selectedTag: null,
      excludeHistory: true,
    });
  };

  const isFiltered =
    filters.era !== 'all' ||
    filters.minRating > 0 ||
    filters.selectedTag !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 transition-all">
      {/* Top row: Quick eras & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Era selector tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
          <button
            onClick={() => setEra('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.era === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📺 Todas (T1-T9)
          </button>
          <button
            onClick={() => setEra('michael')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.era === 'michael'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👔 Era Michael Scott (T1-T7)
          </button>
          <button
            onClick={() => setEra('post-michael')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.era === 'post-michael'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Era Post-Michael (T8-T9)
          </button>
        </div>

        {/* Status indicator and toggle advanced */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium border ${
              eligibleCount > 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {eligibleCount} / {totalCount} caps
          </span>

          {isFiltered && (
            <button
              onClick={resetFilters}
              title="Restablecer filtros"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Popular tags row (always visible for quick picks) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 text-[11px] font-medium mr-1 whitespace-nowrap">
          Temas:
        </span>
        {POPULAR_TAGS.map((tag) => {
          const isSelected = filters.selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setTag(tag.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 border ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced filters drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          {/* Specific seasons checkboxes */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Selección manual de temporadas:</span>
              <span className="text-[11px] font-normal text-slate-400">
                Seleccionadas: {filters.seasons.join(', ')}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => {
                const active = filters.seasons.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSeason(s)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    T{s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* IMDb Rating filter */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Calificación mínima de IMDb:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 0, label: 'Cualquiera' },
                { val: 8.0, label: '⭐ 8.0+ Bueno' },
                { val: 8.5, label: '🔥 8.5+ Muy bueno' },
                { val: 9.0, label: '🏆 9.0+ Obra Maestra' },
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => setRating(r.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    filters.minRating === r.val
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session settings */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.excludeHistory}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    excludeHistory: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>No repetir capítulos que ya me salieron en esta sesión</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
