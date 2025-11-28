
export type LifeCycleStage = 'KITTEN' | 'ADULT' | 'SENIOR';

export interface Profile {
  id: string;
  email: string;
  subscription_tier: 'FREE' | 'PRO' | 'BETA';
  is_admin?: boolean;
}

export interface Cat {
  id: string;
  user_id: string;
  name: string;
  birth_date: string; // ISO Date string
  breed_code?: string;
  gender: 'M' | 'F';
  is_neutered: boolean;
  image_url?: string;
  weight_kg: number;
  bcs?: number; // Body Condition Score (1-9)
  created_at?: string;
}

export interface HealthLog {
  id: string;
  cat_id: string;
  log_type: 'WEIGHT' | 'HOSPITAL' | 'SYMPTOM' | 'WATER' | 'STOOL' | 'ACTIVITY';
  visit_date: string;
  value?: string | number; // Flexible value based on type
  note?: string;
  image_url?: string;
}

export interface Todo {
  id: string;
  cat_id: string;
  content: string;
  is_completed: boolean;
  due_date: string;
  created_at: string;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface HomeCheck {
  id: string;
  cat_id: string;
  check_type: 'URINE' | 'DENTAL';
  result: 'NORMAL' | 'WARNING' | 'DANGER';
  check_date: string;
  note?: string;
  image_url?: string;
}

export interface HealthTip {
  id: string;
  title: string;
  thumbnail_url?: string;
  video_url?: string; // YouTube embed support
  content: string; // Markdown supported
  category: 'HEALTH' | 'BEHAVIOR' | 'FOOD';
  created_at: string;
  is_published: boolean;
}

export interface Appointment {
  id: string;
  cat_id: string;
  title: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  time: string; // HH:mm
  hospital_name: string;
  notes?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  cat_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
}
