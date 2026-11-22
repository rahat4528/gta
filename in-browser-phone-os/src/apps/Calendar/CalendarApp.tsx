import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function CalendarApp() {
  const { events, selectedCalendarDate, setSelectedCalendarDate, addCalendarEvent } =
    useOSStore();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newLocation, setNewLocation] = useState('Apple Park');
  const [newColor, setNewColor] = useState('#007AFF');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCreateEvent = () => {
    if (!newTitle.trim()) return;
    addCalendarEvent({
      title: newTitle,
      date: selectedCalendarDate,
      time: newTime,
      color: newColor,
      location: newLocation,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  const selectedDateEvents = events.filter((e) => e.date === selectedCalendarDate);

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-white select-none overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 ml-2 rounded-full bg-ios-red text-white hover:bg-red-600 transition-colors"
            title="Add Event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-neutral-500 mb-2 uppercase">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
        {/* Empty slots for previous month overflow */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${currentYear}-${(currentMonth + 1)
            .toString()
            .padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
          const isSelected = dateStr === selectedCalendarDate;
          const isToday =
            dateStr === new Date().toISOString().split('T')[0];
          const hasEvents = events.some((e) => e.date === dateStr);

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedCalendarDate(dateStr)}
              className={`relative h-8 rounded-full flex flex-col items-center justify-center font-medium transition-all ${
                isSelected
                  ? 'bg-ios-red text-white font-bold shadow'
                  : isToday
                  ? 'text-ios-red font-bold'
                  : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <span>{dayNum}</span>
              {hasEvents && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-ios-blue absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day's Events List */}
      <div className="flex-1 flex flex-col border-t border-neutral-800 pt-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Events ({selectedCalendarDate})
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {selectedDateEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
              No Events Scheduled
            </div>
          ) : (
            selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="bg-neutral-900 rounded-2xl p-3 border-l-4 shadow-sm"
                style={{ borderColor: event.color }}
              >
                <h4 className="text-xs font-bold text-white">{event.title}</h4>
                <div className="flex items-center space-x-3 text-[11px] text-neutral-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{event.time}</span>
                  </span>
                  {event.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{event.location}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Add New Event</h3>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Event Title"
              className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />

            <div className="flex space-x-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Location"
                className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Color picker */}
            <div className="flex space-x-2 pt-1">
              {['#007AFF', '#FF3B30', '#FF9500', '#34C759', '#AF52DE'].map((color) => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    newColor === color ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-1.5 rounded-lg text-xs bg-ios-red text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
