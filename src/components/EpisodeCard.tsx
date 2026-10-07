import { useState } from 'react';
import type { Episode } from '../types/episode';
import { Star, Quote, ExternalLink, Copy, Check, Tv, Shuffle } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  onRollAgain: () => void;
  isRolling: boolean;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onRollAgain,
  isRolling,
}) => {
  const [copied, setCopied] = useState(false);

  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 9.2) return 'bg-amber-500 text-white border-amber-600 shadow-sm';
    if (rating >= 8.5) return 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
    if (rating >= 8.0) return 'bg-blue-600 text-white border-blue-700';
    return 'bg-slate-700 text-white border-slate-800';
  };

  const handleCopy = () => {
    const text = `📄 The Office (US) - S${String(episode.season).padStart(2, '0')}E${String(episode.episode).padStart(2, '0')}: "${episode.title}" (${episode.titleEn})
⭐ IMDb: ${episode.imdbRating}/10
💬 "${episode.iconicQuote}" — ${episode.quoteCharacter}
📝 ${episode.synopsis}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const imdbSearchUrl = `https://www.imdb.com/find/?q=The+Office+${encodeURIComponent(episode.titleEn)}`;
  const streamSearchUrl = `https://www.google.com/search?q=ver+The+Office+temporada+${episode.season}+episodio+${episode.episode}+${encodeURIComponent(episode.titleEn)}+online`;

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      {/* Paper Clip Visual Element */}
      <div className="absolute -top-3 left-10 w-6 h-12 border-4 border-slate-400 rounded-full z-20 pointer-events-none opacity-80" />

      {/* Main Memo Card */}
      <div
        className={`paper-texture rounded-2xl border-2 border-slate-300 postit-shadow p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
          isRolling ? 'opacity-40 scale-98 blur-[1px]' : 'opacity-100 scale-100'
        }`}
      >
        {/* Top Watermark / Office memo header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="font-dunder text-slate-700 text-sm tracking-wider uppercase">
              DUNDER MIFFLIN MEMORANDUM
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
              T{episode.season} • EP {episode.episode}
            </span>
          </div>

          {/* Rating Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRatingBadgeClass(
              episode.imdbRating
            )}`}
            title={`Calificación de IMDb: ${episode.imdbRating}/10`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{episode.imdbRating.toFixed(1)} IMDb</span>
            {episode.imdbRating >= 9.2 && (
              <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-1 rounded ml-0.5">
                OBRA MAESTRA
              </span>
            )}
          </div>
        </div>

        {/* Title and English subtitle */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {episode.title}
          </h2>
          <div className="text-sm font-medium text-slate-500 italic mt-0.5">
            Título original: "{episode.titleEn}"
          </div>
        </div>

        {/* Iconic Quote Post-it Callout */}
        <div className="my-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 relative shadow-2xs">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 opacity-80" />
            <div className="space-y-1">
              <p className="font-serif italic text-sm sm:text-base leading-relaxed text-amber-950">
                "{episode.iconicQuote}"
              </p>
              <p className="text-xs font-bold text-amber-800 tracking-wide">
                — {episode.quoteCharacter}
              </p>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-1">
            Resumen del Episodio:
          </span>
          <p>{episode.synopsis}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {episode.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-0.8 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Roll again button */}
            <button
              onClick={onRollAgain}
              disabled={isRolling}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Ver otro capítulo</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Stream search */}
            <a
              href={streamSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200 rounded-xl transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-slate-500" />
              <span>Dónde ver</span>
            </a>

            {/* IMDb Link */}
            <a
              href={imdbSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>IMDb</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
