export interface DailyPlan {
  id: string;
  date: string;
  prompt: string;
  schedule: ScheduleItem[];
  goals: string[];
  journalPrompt: string;
  journalEntry: string;
  createdAt: string;
}

export interface ScheduleItem {
  time: string;
  task: string;
  priority: 'critical' | 'high' | 'standard';
}

export interface GeneratedContent {
  schedule: ScheduleItem[];
  goals: string[];
  journalPrompt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'critical' | 'high' | 'standard';
  createdAt: string;
  isGenerated?: boolean;
}