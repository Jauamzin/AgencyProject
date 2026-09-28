export type CitySlug = 'vancouver' | 'toronto' | 'ottawa';

export interface MonthWeather {
  month: string;
  high: number;
  low: number;
  /** Days with precipitation */
  wetDays: number;
}

export interface CostItem {
  label: string;
  icon: string;
  /** Monthly CAD, low–high range */
  min: number;
  max: number;
}

export interface Salary {
  role: string;
  hourly: number;
  note: string;
}

export interface Accommodation {
  type: string;
  monthly: [number, number];
  image: string;
  vibe: string;
  perks: string[];
}

export interface TransitLine {
  name: string;
  detail: string;
}

export interface Institution {
  name: string;
  kind: 'University' | 'College' | 'Language school';
  highlight: string;
}

export interface City {
  slug: CitySlug;
  name: string;
  province: string;
  tagline: string;
  nickname: string;
  intro: string;
  color: string;
  images: [string, string, string];
  stats: { label: string; value: string }[];
  weather: MonthWeather[];
  weatherNote: string;
  costs: CostItem[];
  minimumWage: number;
  salaries: Salary[];
  accommodation: Accommodation[];
  transport: { card: string; monthly: number; studentPass: string; lines: TransitLine[]; image: string };
  culture: string[];
  institutions: Institution[];
  neighborhoods: { name: string; why: string }[];
}

export interface Program {
  id: string;
  title: string;
  category: 'University' | 'Exchange' | 'College' | 'Language' | 'Work & Travel';
  cities: CitySlug[];
  duration: string;
  fromPrice: number;
  intake: string;
  image: string;
  summary: string;
  includes: string[];
  workRights: string;
}

export interface Visa {
  code: string;
  name: string;
  forWho: string;
  duration: string;
  work: string;
  keyDocs: string[];
  fee: string;
  accent: string;
}

export interface Testimonial {
  name: string;
  from: string;
  program: string;
  city: CitySlug;
  quote: string;
  initials: string;
}
