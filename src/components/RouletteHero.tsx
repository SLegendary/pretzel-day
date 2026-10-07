import React from 'react';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';

interface RouletteHeroProps {
  onRoll: () => void;
  isRolling: boolean;
  rollingTitle: string;
  rollingSeasonText: string;
  hasCurrentEpisode: boolean;
  eligibleCount: number;
}

export const RouletteHero: React.FC<RouletteHeroProps> = ({
  onRoll,
  isRolling,
  rollingTitle,
  rollingSeasonText,
  hasCurrentEpisode,
  eligibleCount,
}) => {
  return (
    <div className="text-center my-6">
      {/* Dynamic Shuffle Reveal when rolling */}
      {isRolling && (
        <div className="mb-4 inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-2xl shadow-lg border-2 border-amber-600 animate-pulse">
          <div className="text-xs uppercase tracking-widest text-slate-900 font-mono">
            {rollingSeasonText || 'Buscando en los archivos de Scranton...'}
          </div>
          <div className="text-lg sm:text-xl font-extrabold truncate max-w-sm sm:max-w-md">
            {rollingTitle || 'Barajando episodios...'}
          </div>
        </div>
      )}

      {/* Main trigger button */}
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          onClick={onRoll}
          disabled={isRolling || eligibleCount === 0}
          className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-black tracking-tight rounded-2xl transition-all duration-200 select-none shadow-md ${
            eligibleCount === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 hover:shadow-xl hover:shadow-amber-500/25 border-2 border-amber-600'
          }`}
        >
          <Dices
            className={`w-6 h-6 sm:w-7 sm:h-7 text-slate-950 transition-transform ${
              isRolling ? 'animate-spin' : 'group-hover:rotate-45'
            }`}
          />
          <span>
            {isRolling
              ? 'Eligiendo capítulo...'
              : hasCurrentEpisode
              ? '¡ELEGIR OTRO CAPÍTULO!'
              : '¡DAME UN CAPÍTULO AL AZAR!'}
          </span>
          <Sparkles className="w-5 h-5 text-slate-900 opacity-80" />
        </button>

        {/* Keyboard shortcut or warning */}
        {eligibleCount === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
            <AlertCircle className="w-4 h-4" />
            <span>
              Ningún episodio coincide con los filtros seleccionados. Intenta ampliar tus filtros.
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span>Tip: También puedes presionar la</span>
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white text-slate-700 border border-slate-300 rounded shadow-2xs">
              Barra Espaciadora
            </kbd>
          </p>
        )}
      </div>
    </div>
  );
};
