export interface Episode {
  id: string;
  season: number;
  episode: number;
  overallEpisode: number;
  title: string;
  titleEn: string;
  imdbRating: number;
  synopsis: string;
  iconicQuote: string;
  quoteCharacter: string;
  tags: string[];
  durationMinutes?: number;
  writer?: string;
  director?: string;
}

export type EraFilter = 'all' | 'michael' | 'post-michael' | 'custom';

export interface FilterOptions {
  era: EraFilter;
  seasons: number[]; // 1 to 9
  minRating: number; // 0, 8.0, 8.5, 9.0
  selectedTag: string | null;
  excludeHistory: boolean;
}

export interface TagInfo {
  id: string;
  label: string;
  emoji: string;
}
