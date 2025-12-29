// ==========================================
// Our Universe - TypeScript Types
// ==========================================

// Meta information about the relationship
export interface MetaInfo {
  appName: string;
  relationshipStartDate: string; // ISO date string
  people: {
    me: string;
    you: string;
  };
}

// Journal Entry
export interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number; // 1-10
  tags: string[];
  photos: string[];
}

// Moment (for Museum exhibits)
export interface Moment {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'firsts' | 'trips' | 'inside_jokes';
  isTopMoment?: boolean;
  score?: number;
  photos: string[];
  image?: string; // Legacy or alternative for single photo
  tags?: string[];
  relatedEntryIds?: string[];
}

// Photo
export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  month: number;
  tags: string[];
}

// Note
export interface Note {
  id: string;
  date: string;
  content: string;
  type: 'love' | 'gratitude' | 'memory' | 'wish';
}

// Year Recap
export interface YearRecap {
  lessonsLearned: string[];
  bestMoments: string[];
  gratitude: string[];
  nextYearIntentions: string[];
}

// Chat Message
export interface ChatMessage {
  from: 'me' | 'you';
  text: string;
  time: string;
  photo?: string;
}

// Chat Episode
export interface ChatEpisode {
  id: string;
  title: string;
  date: string;
  description?: string;
  messages: ChatMessage[];
}

// Quest
export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'todo' | 'doing' | 'done';
  tags: string[];
  reward?: string;
  completedDate?: string;
}

// Place (for Map)
export interface Place {
  id: string;
  name: string;
  type: 'cafe' | 'restaurant' | 'park' | 'beach' | 'home' | 'travel' | 'other';
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  description: string;
  photo?: string;
  relatedMomentIds: string[];
}

// Badge/Achievement
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: {
    type: 'quest_count' | 'quest_tag' | 'first_quest';
    count?: number;
    tag?: string;
  };
}

// Visited Province (for Thailand Map)
export interface VisitedProvince {
  provinceId: string;
  visitDate: string;
  note?: string;
  photos?: string[];
  relatedMomentIds?: string[];
}

// Visited District (for deep map recording)
export interface VisitedDistrict {
  id: string; // format: provinceId-districtName
  districtName: string;
  provinceId: string;
  visitDate: string;
  note?: string;
  photos?: string[];
}

// Milestone (special dates/achievements)
export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  type: 'anniversary' | 'first' | 'achievement' | 'special';
}

// Countdown Event
export interface CountdownEvent {
  id: string;
  title: string;
  date: string;
  icon: string;
  description?: string;
}

// Year Data
export interface YearData {
  entries: Entry[];
  moments: Moment[];
  photos: Photo[];
  notes: Note[];
  yearRecap: YearRecap;
  chatEpisodes: ChatEpisode[];
  quests: Quest[];
  places: Place[];
  visitedProvinces: VisitedProvince[];
  visitedDistricts?: VisitedDistrict[];
  milestones?: Milestone[];
}

// Main Universe Data structure
export interface UniverseData {
  meta: MetaInfo;
  years: Record<string, YearData>;
  badges: Badge[];
  countdowns?: CountdownEvent[];
  wishlistProvinces?: string[]; // Provinces we want to visit together
}

// Random Memory Item (union type for random feature)
export type RandomMemoryItem =
  | { type: 'entry'; data: Entry; route: string }
  | { type: 'moment'; data: Moment; route: string }
  | { type: 'photo'; data: Photo; route: string }
  | { type: 'note'; data: Note; route: string };

// Theme type
export type Theme = 'cozy' | 'midnight';

// Monthly Highlights
export interface MonthlyHighlight {
  month: number;
  year: string;
  entries: Entry[];
  moments: Moment[];
  photos: Photo[];
}
