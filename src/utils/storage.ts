import { DailyPlan, CalendarEvent } from '../types';

const STORAGE_KEY = 'force-forecast-plans';
const CALENDAR_STORAGE_KEY = 'force-forecast-calendar';

export function savePlan(plan: DailyPlan): void {
  const plans = getPlans();
  const existingIndex = plans.findIndex(p => p.id === plan.id);
  
  if (existingIndex >= 0) {
    plans[existingIndex] = plan;
  } else {
    plans.push(plan);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function getPlans(): DailyPlan[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deletePlan(id: string): void {
  const plans = getPlans().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function exportPlans(): string {
  const plans = getPlans();
  return JSON.stringify(plans, null, 2);
}

export function exportPlanAsText(plan: DailyPlan): string {
  const content = `
FORCE FORECAST - DAILY COMMAND BRIEF
Date: ${plan.date}
Mission Directive: ${plan.prompt}

=== TACTICAL SCHEDULE ===
${plan.schedule.map(item => `${item.time} - ${item.task}`).join('\n')}

=== STRATEGIC OBJECTIVES ===
${plan.goals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

=== MINDSET CONDITIONING ===
Prompt: ${plan.journalPrompt}
Response: ${plan.journalEntry || 'No entry recorded'}

=== MISSION NOTES ===
Generated: ${plan.createdAt}
Plan ID: ${plan.id}

The Force is strong with this one.
`;
  
  return content.trim();
}

// Calendar Event Functions
export function saveCalendarEvent(event: CalendarEvent): void {
  const events = getCalendarEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
}

export function getCalendarEvents(): CalendarEvent[] {
  const stored = localStorage.getItem(CALENDAR_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteCalendarEvent(id: string): void {
  const events = getCalendarEvents().filter(e => e.id !== id);
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
}

export function getEventsForDate(date: Date): CalendarEvent[] {
  const events = getCalendarEvents();
  const dateStr = date.toDateString();
  return events.filter(event => new Date(event.date).toDateString() === dateStr);
}