import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Target, Clock, Flame, Skull, Eye } from 'lucide-react';
import { DailyPlan, CalendarEvent } from '../types';
import { getPlans, getCalendarEvents, saveCalendarEvent, deleteCalendarEvent } from '../utils/storage';
import DarthVader from './icons/DarthVader';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: DailyPlan | null;
}

export function Calendar({ isOpen, onClose, currentPlan }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    priority: 'standard' as 'critical' | 'high' | 'standard',
    time: '09:00'
  });
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    setEvents(getCalendarEvents());
    setPlans(getPlans());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return events.filter(event => new Date(event.date).toDateString() === dateStr);
  };

  const getPlanForDate = (date: Date) => {
    const dateStr = date.toLocaleDateString();
    return plans.find(plan => plan.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate.toISOString(),
      time: newEvent.time,
      priority: newEvent.priority,
      createdAt: new Date().toISOString()
    };

    saveCalendarEvent(event);
    setEvents(prev => [...prev, event]);
    setShowEventModal(false);
    setNewEvent({ title: '', description: '', priority: 'standard', time: '09:00' });
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteCalendarEvent(eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const generateEventsFromPlan = () => {
    if (!currentPlan || !selectedDate) return;

    currentPlan.schedule.forEach((scheduleItem, index) => {
      const event: CalendarEvent = {
        id: `${currentPlan.id}-${index}`,
        title: scheduleItem.task,
        description: `Generated from Force Forecast plan: ${currentPlan.prompt}`,
        date: selectedDate.toISOString(),
        time: scheduleItem.time,
        priority: scheduleItem.priority,
        createdAt: new Date().toISOString(),
        isGenerated: true
      };

      // Check if event already exists
      const exists = events.some(e => e.id === event.id);
      if (!exists) {
        saveCalendarEvent(event);
        setEvents(prev => [...prev, event]);
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Flame className="w-3 h-3" />;
      case 'high': return <Target className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  if (!isOpen) return null;

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDatePlan = selectedDate ? getPlanForDate(selectedDate) : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 via-black to-red-950/20 border border-red-900/50 rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-400 tracking-wide">TACTICAL CALENDAR</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
              className="bg-red-950/30 hover:bg-red-950/50 border border-red-800/30 text-red-300 px-3 py-1 rounded-md text-sm transition-all duration-200"
            >
              {viewMode === 'month' ? 'WEEK' : 'MONTH'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
            >
              <Eye className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Calendar Grid */}
          <div className="flex-1 p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-red-400" />
              </button>
              
              <h3 className="text-2xl font-bold text-red-400 tracking-wider">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-red-900/30 rounded-md transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-red-300 font-bold text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 h-[calc(100%-120px)]">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2"></div>;
                }

                const dayEvents = getEventsForDate(day);
                const dayPlan = getPlanForDate(day);
                const isSelected = selectedDate?.toDateString() === day.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 border border-gray-700/30 rounded-md cursor-pointer transition-all duration-200 hover:bg-red-950/30 ${
                      isSelected ? 'bg-red-950/50 border-red-500/50' : ''
                    } ${isToday ? 'ring-1 ring-red-500/50' : ''}`}
                  >
                    <div className="text-sm font-bold text-gray-300 mb-1">
                      {day.getDate()}
                    </div>
                    
                    {/* Plan indicator */}
                    {dayPlan && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full mb-1"></div>
                    )}
                    
                    {/* Event indicators */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`w-full h-1 rounded-full ${getPriorityColor(event.priority)}`}
                        ></div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-400">+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-red-900/50 p-6 overflow-y-auto">
            {selectedDate ? (
              <div className="space-y-6">
                {/* Selected Date Header */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-red-400">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>

                {/* Add Event Button */}
                <button
                  onClick={() => setShowEventModal(true)}
                  className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  ADD MISSION
                </button>

                {/* Generate from Current Plan */}
                {currentPlan && (
                  <button
                    onClick={generateEventsFromPlan}
                    className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    DEPLOY CURRENT PLAN
                  </button>
                )}

                {/* Plan for Selected Date */}
                {selectedDatePlan && (
                  <div className="bg-purple-950/30 border border-purple-700/30 rounded-md p-4">
                    <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                      <DarthVader className="w-4 h-4" />
                      FORCE FORECAST PLAN
                    </h4>
                    <p className="text-gray-300 text-sm mb-2">{selectedDatePlan.prompt}</p>
                    <p className="text-purple-300 text-xs">{selectedDatePlan.schedule.length} tactical objectives</p>
                  </div>
                )}

                {/* Events for Selected Date */}
                <div className="space-y-3">
                  <h4 className="text-red-400 font-bold">ACTIVE MISSIONS</h4>
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No missions scheduled. The Force awaits your command.</p>
                  ) : (
                    selectedDateEvents.map(event => (
                      <div
                        key={event.id}
                        className={`bg-black/50 border ${
                          event.priority === 'critical' ? 'border-red-500/50' :
                          event.priority === 'high' ? 'border-orange-500/50' : 'border-gray-600/50'
                        } rounded-md p-3`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(event.priority)}
                            <span className="text-red-300 font-mono text-sm">{event.time}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                        <h5 className="text-gray-100 font-medium mb-1">{event.title}</h5>
                        {event.description && (
                          <p className="text-gray-400 text-sm">{event.description}</p>
                        )}
                        {event.isGenerated && (
                          <div className="mt-2 text-xs text-purple-400">⚡ Auto-generated</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-red-500/50 mx-auto mb-4" />
                <p className="text-red-300 text-lg font-medium mb-2">
                  Select a date to command your destiny.
                </p>
                <p className="text-gray-400">
                  Click on any day to view or schedule your tactical missions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Event Creation Modal */}
        {showEventModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-gray-900 to-black border border-red-900/50 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-red-400 mb-4">CREATE NEW MISSION</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-red-300 text-sm font-bold mb-2">
                    MISSION TITLE
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-900/50 border border-red-800/30 rounded-md px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter mission objective..."
                  />
                </div>

                <div>
                  <label className="block text-red-300 text-sm font-bold mb-2">
                    TACTICAL DETAILS
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 bg-gray-900/50 border border-red-800/30 rounded-md px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Mission briefing..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-red-300 text-sm font-bold mb-2">
                      TIME
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full bg-gray-900/50 border border-red-800/30 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-red-300 text-sm font-bold mb-2">
                      PRIORITY
                    </label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-gray-900/50 border border-red-800/30 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title.trim()}
                  className="flex-1 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  EXECUTE
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  ABORT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}