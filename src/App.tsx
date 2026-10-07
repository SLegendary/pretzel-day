import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { EPISODES_DATA } from './data/episodes';
import type { Episode, FilterOptions } from './types/episode';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { RouletteHero } from './components/RouletteHero';
import { EpisodeCard } from './components/EpisodeCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EpisodeExplorerModal } from './components/EpisodeExplorerModal';
import { playCelebrationSound, playStampSound, playTickSound } from './utils/audio';
import { Award, Flame, Coffee, Film } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'the_office_randomizer_history';
const STORAGE_KEY_SOUND = 'the_office_randomizer_sound';

export function App() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingTitle, setRollingTitle] = useState('');
  const [rollingSeasonText, setRollingSeasonText] = useState('');

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // History state
  const [history, setHistory] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    era: 'all',
    seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    minRating: 0,
    selectedTag: null,
    excludeHistory: true,
  });

  // Save history and sound preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Filtered eligible episodes pool
  const eligibleEpisodes = useMemo(() => {
    return EPISODES_DATA.filter((ep) => {
      // Season filter
      if (!filters.seasons.includes(ep.season)) return false;

      // Rating filter
      if (filters.minRating > 0 && ep.imdbRating < filters.minRating) return false;

      // Tag filter
      if (filters.selectedTag && !ep.tags.includes(filters.selectedTag)) return false;

      return true;
    });
  }, [filters]);

  // Filtered pool taking history into account
  const candidateEpisodes = useMemo(() => {
    if (!filters.excludeHistory || history.length === 0) {
      return eligibleEpisodes;
    }

    const historyIds = new Set(history.map((h) => h.id));
    const nonSeen = eligibleEpisodes.filter((ep) => !historyIds.has(ep.id));

    // If all eligible episodes have been seen in this session, fallback to all eligible
    return nonSeen.length > 0 ? nonSeen : eligibleEpisodes;
  }, [eligibleEpisodes, filters.excludeHistory, history]);

  // Trigger Confetti effect
  const launchConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ec4899'],
      });
    } catch {
      // fallback if canvas-confetti is not loaded
    }
  }, []);

  // Main randomize function
  const rollEpisode = useCallback(() => {
    if (isRolling || candidateEpisodes.length === 0) return;

    setIsRolling(true);

    const spinDuration = 1200; // ms
    const tickIntervalMs = 70;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const randomIdx = Math.floor(Math.random() * candidateEpisodes.length);
      const tempEp = candidateEpisodes[randomIdx];

      setRollingTitle(`"${tempEp.title}"`);
      setRollingSeasonText(`Temporada ${tempEp.season} • Episodio ${tempEp.episode}`);
      playTickSound(soundEnabled);

      if (elapsed >= spinDuration) {
        clearInterval(interval);

        // Pick final episode (different from current if possible)
        let finalEp: Episode;
        if (candidateEpisodes.length > 1 && currentEpisode) {
          const others = candidateEpisodes.filter((ep) => ep.id !== currentEpisode.id);
          finalEp = others[Math.floor(Math.random() * others.length)];
        } else {
          finalEp = candidateEpisodes[Math.floor(Math.random() * candidateEpisodes.length)];
        }

        setCurrentEpisode(finalEp);
        setIsRolling(false);
        setRollingTitle('');
        setRollingSeasonText('');

        // Add to history
        setHistory((prev) => [finalEp, ...prev.filter((p) => p.id !== finalEp.id)]);

        // Sound & celebratory confetti
        if (finalEp.imdbRating >= 9.0 || finalEp.tags.includes('The Dundies')) {
          playCelebrationSound(soundEnabled);
          launchConfetti();
        } else {
          playStampSound(soundEnabled);
        }
      }
    }, tickIntervalMs);
  }, [isRolling, candidateEpisodes, currentEpisode, soundEnabled, launchConfetti]);

  // Keyboard shortcut listener (Spacebar or 'R')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (isHistoryOpen || isExplorerOpen) return;

      if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        rollEpisode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollEpisode, isHistoryOpen, isExplorerOpen]);

  // Initial random pick on first load if none selected
  useEffect(() => {
    if (!currentEpisode && EPISODES_DATA.length > 0) {
      // Pick a universally loved classic as initial welcome episode (e.g. Dinner Party or Stress Relief)
      const initialClassic =
        EPISODES_DATA.find((e) => e.id === 's04e09') || EPISODES_DATA[0];
      setCurrentEpisode(initialClassic);
    }
  }, [currentEpisode]);

  const handleClearHistory = () => {
    if (window.confirm('¿Seguro que deseas borrar el historial de capítulos vistos?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExplorer={() => setIsExplorerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col gap-6">
        {/* Banner with subtitle */}
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ¿Qué capítulo de <span className="text-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">The Office</span> vemos hoy?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            Deja de buscar por horas en el menú de streaming. Ajusta tus filtros o presiona el botón y deja que el destino decida tu dosis de humor.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChangeFilters={setFilters}
          eligibleCount={candidateEpisodes.length}
          totalCount={EPISODES_DATA.length}
        />

        {/* Randomize Hero Button */}
        <RouletteHero
          onRoll={rollEpisode}
          isRolling={isRolling}
          rollingTitle={rollingTitle}
          rollingSeasonText={rollingSeasonText}
          hasCurrentEpisode={currentEpisode !== null}
          eligibleCount={candidateEpisodes.length}
        />

        {/* Episode Card */}
        {currentEpisode && (
          <EpisodeCard
            episode={currentEpisode}
            onRollAgain={rollEpisode}
            isRolling={isRolling}
          />
        )}

        {/* Fun Footer Feature Quick Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div
            onClick={() => setFilters({ ...filters, selectedTag: 'The Dundies' })}
            className="p-3 bg-white/80 hover:bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 transition-all shadow-2xs group"
          >
            <Award className="w-5 h-5 mx-auto text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-800">Premios Dundie</div>
            <div className="text-[10px] text-slate-400">Ver especiales</div>
          </div>

          <div
            onClick={() => setFilters({ ...filters, minRating: 9.0 })}
            className="p-3 bg-white/80 hover:bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 transition-all shadow-2xs group"
          >
            <Flame className="w-5 h-5 mx-auto text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-800">Top Calificados</div>
            <div className="text-[10px] text-slate-400">IMDb 9.0+</div>
          </div>

          <div
            onClick={() => setFilters({ ...filters, selectedTag: 'Bromas de Jim' })}
            className="p-3 bg-white/80 hover:bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 transition-all shadow-2xs group"
          >
            <Coffee className="w-5 h-5 mx-auto text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-800">Bromas de Jim</div>
            <div className="text-[10px] text-slate-400">Dwight en gelatina</div>
          </div>

          <div
            onClick={() => setFilters({ ...filters, selectedTag: 'Navidad' })}
            className="p-3 bg-white/80 hover:bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 transition-all shadow-2xs group"
          >
            <Film className="w-5 h-5 mx-auto text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-800">Navideños</div>
            <div className="text-[10px] text-slate-400">Fiestas de oficina</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white/60 text-center text-xs text-slate-500 space-y-1">
        <p className="font-mono">
          Creado para fans de <strong>The Office (US)</strong> • Dunder Mifflin Paper Co.
        </p>
        <p className="text-[11px] text-slate-400">
          "Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way." — Michael Scott
        </p>
      </footer>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEpisode={(ep) => setCurrentEpisode(ep)}
        onClearHistory={handleClearHistory}
      />

      {/* Full Catalog Explorer Modal */}
      <EpisodeExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        episodes={EPISODES_DATA}
        onSelectEpisode={(ep) => setCurrentEpisode(ep)}
      />
    </div>
  );
}
export default App;
