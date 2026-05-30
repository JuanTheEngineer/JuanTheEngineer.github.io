// Core data types for the Action App

export interface Demo {
  type: 'cloudinary' | 'youtube' | 'tiktok' | 'vimeo' | 'url' | 'local';
  mediaType?: 'image' | 'video';
  format?: string;
  url: string;
  startTime?: number;
  endTime?: number;
  isPrimary?: boolean;
  notes?: string;
  metadata?: {
    title?: string;
    channel?: string;
    duration?: number;
    views?: number;
    confidence?: number;
  };
}

export interface Exercise {
  id: string;
  name: string;
  aliases?: string[];
  demos: Demo[];
  recommendations?: {
    reps?: string;
    sets?: string;
    repUnits?: string;
    note?: string;
  };
  tags?: string[];
  equipment?: string[];
}

export interface ExercisesLibrary {
  version: string;
  lastUpdated: string;
  exercises: Exercise[];
}

export type GroupKind = 'superset' | 'compound' | 'circuit';
export type ItemTag = 'warmup' | 'stretch';

export interface ProgramSingleItem {
  exerciseId: string;
  reps?: string;
  sets?: string;
  repUnits?: string;
  note?: string;
  tags?: ItemTag[];
}

export interface ProgramGroupMember {
  exerciseId: string;
  reps?: string;
  sets?: string;
  repUnits?: string;
  note?: string;
}

export interface ProgramGroupItem {
  kind: GroupKind;
  note?: string;
  tags?: string[];
  exercises: ProgramGroupMember[];
}

export type ProgramItem = ProgramSingleItem | ProgramGroupItem;

export interface Program {
  id: string;
  title: string;
  requirements?: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  tags?: string[];
  items: ProgramItem[];
}

export interface WorkoutsFile {
  programs: Program[];
}

// Resolved types (after merging with exercises.json)

export interface ResolvedSingleItem {
  kind: 'single';
  exerciseId: string;
  exercise: Exercise | null;
  name: string;
  reps?: string;
  sets?: string;
  repUnits?: string;
  note?: string;
  tags: ItemTag[];
}

export interface ResolvedGroupMember {
  exerciseId: string;
  exercise: Exercise | null;
  name: string;
  reps?: string;
  sets?: string;
  repUnits?: string;
  note?: string;
}

export interface ResolvedGroupItem {
  kind: GroupKind;
  note?: string;
  tags: string[];
  exercises: ResolvedGroupMember[];
}

export type ResolvedItem = ResolvedSingleItem | ResolvedGroupItem;

export interface ResolvedProgram extends Program {
  resolvedItems: ResolvedItem[];
}

// Plans

export interface SubPlan {
  name: string;
  description?: string;
  programs: string[];
}

export interface Plan {
  name: string;
  description?: string;
  subPlans: SubPlan[];
}

export interface PlansFile {
  plans: Plan[];
}
