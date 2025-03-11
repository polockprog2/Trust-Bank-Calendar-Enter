import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function WeekView() {
  const { 
    savedEvents, 
    savedTasks, 
    setShowEventModal, 
    setDaySelected,
    setSelectedEvent,
    setSelectedTask
  } = useContext(GlobalContext);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf("week"));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const currentTimePosition = `${(currentTime.hour() + currentTime.minute() / 60) * 50}px`;

  function handlePrevWeek() {
    setStartOfWeek(startOfWeek.subtract(1, "week"));
  }

  function handleNextWeek() {
    setStartOfWeek(startOfWeek.add(1, "week"));
  }

  function handleTimeSlotClick(day, hour, minute = 0) {
    setDaySelected(day.hour(hour).minute(minute));
    setSelectedEvent(null); // Clear any selected event
    setSelectedTask(null); // Clear any selected task
    setShowEventModal(true);
  }

  function handleEventClick(event) {
    setSelectedEvent(event);
    setShowEventModal(true);
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
    setShowEventModal(true);
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-icons-outlined">chevron_left</span>
          </button>
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-icons-outlined">chevron_right</span>
          </button>
          <h2 className="text-xl font-semibold">
            {startOfWeek.format("MMMM YYYY")}
          </h2>
        </div>
        <button 
          onClick={() => setStartOfWeek(dayjs().startOf("week"))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Today
        </button>
      </header>

      {/* Week days header */}
      <div className="flex border-b sticky top-16 bg-white z-10">
        <div className="w-20" /> {/* Time gutter */}
        {daysOfWeek.map(day => (
          <div key={day.format("YYYY-MM-DD")} className="flex-1 text-center py-2">
            <div className="text-sm font-medium">{day.format("ddd")}</div>
            <div className={`text-2xl font-bold ${
              day.isSame(dayjs(), 'day') ? 'text-blue-600' : ''
            }`}>
              {day.format("D")}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="flex flex-1">
        {/* Time labels */}
        <div className="w-20 border-r sticky left-0 bg-white z-0">
          {hoursOfDay.map(hour => (
            <div key={hour} className="h-[50px] text-right pr-2 -mt-3">
              <span className="text-xs text-gray-500">
                {dayjs().hour(hour).format("h A")}
              </span>
            </div>
          ))}
        </div>

        {/* Events grid */}
         <div className="flex flex-1 relative z-0">
          {daysOfWeek.map(day => (
            <div key={day.format("YYYY-MM-DD")} className="flex-1 relative">
              {/* Current time indicator */}
              {day.isSame(dayjs(), 'day') && (
                <div 
                  className="absolute w-full border-t-2 border-red-500 z-10"
                  style={{ top: currentTimePosition }}
                >
                  <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full" />
                </div>
              )}

              {/* Time slots */}
              {hoursOfDay.map(hour => (
                <div 
                  key={hour}
                  className="h-[50px] border-t border-l border-gray-200 relative group"
                  onClick={() => handleTimeSlotClick(day, hour)}
                >
                  {/* 30-minute divider */}
                  <div className="absolute w-full h-[1px] top-1/2 bg-gray-100" />

                  {/* Events */}
                  {savedEvents
                    .filter(evt => 
                      dayjs(evt.day).isSame(day, 'day') && 
                      dayjs(evt.day).hour() === hour
                    )
                    .map(event => (
                      <div
                        key={event.id}
                        className={`absolute left-0 right-0 mx-1 p-1 rounded text-sm bg-${event.label}-200 border border-${event.label}-300 cursor-pointer`}
                        style={{
                          top: `${(dayjs(event.day).minute() / 60) * 100}%`,
                          height: `${(dayjs(event.endTime || event.day).diff(dayjs(event.day), 'minute') / 60) * 100}%`
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs">
                          {dayjs(event.day).format("h:mm A")}
                        </div>
                      </div>
                    ))}

                  {/* Tasks */}
                  {savedTasks
                    .filter(task => 
                      dayjs(task.dueDate).isSame(day, 'day') && 
                      dayjs(task.dueDate).hour() === hour
                    )
                    .map(task => (
                      <div
                        key={task.id}
                        className={`absolute left-0 right-0 mx-1 p-1 rounded text-sm bg-${task.label}-100 border border-${task.label}-200 cursor-pointer`}
                        style={{
                          top: `${(dayjs(task.dueDate).minute() / 60) * 100}%`,
                          height: "25px"
                        }}
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="font-semibold truncate">{task.title}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}