import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function DayView() {
  const { 
    daySelected, 
    savedEvents, 
    savedTasks, 
    setShowEventModal, 
    setDaySelected 
  } = useContext(GlobalContext);
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const quarterHours = [0, 15, 30, 45];
  
  // Calculate pixel position for time
  const getTimePosition = (time) => {
    if (!time) return '0px';
    const minutes = time.hour() * 60 + time.minute();
    return `${(minutes / 60) * 60}px`;
  };


  // Calculate event position and height
  const getEventStyle = (event) => {
    const startTime = dayjs(event.startTime || event.day);
    const endTime = dayjs(event.endTime || startTime.add(1, 'hour'));
    const duration = endTime.diff(startTime, 'minute');
    
    // Calculate minutes from start of day
    const startMinutes = startTime.hour() * 60 + startTime.minute();
    const durationMinutes = endTime.diff(startTime, 'minute');

    return {
      top: `${(startMinutes / 60) * 60}px`,
      height: `${Math.max((durationMinutes / 60) * 60, 30)}px`, // Minimum height of 30px
      zIndex: 20
    };
  };
// time slot click handler
  const handleTimeSlotClick = (hour, minute = 0) => {
    const selectedDateTime = daySelected
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);
    setDaySelected(selectedDateTime);
    setShowEventModal(true);
  };
   // Quarter hour click handler
   const handleQuarterHourClick = (hour, quarter) => {
    handleTimeSlotClick(hour, quarter);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto">
      <header className="flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-white z-50">
        <div className="flex items-center space-x-4">
          <button onClick={() => setDaySelected(daySelected.subtract(1, "day"))} 
                  className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-icons-outlined">chevron_left</span>
          </button>
          <h2 className="text-xl font-semibold">
            {daySelected.format("dddd, MMMM D, YYYY")}
          </h2>
          <button onClick={() => setDaySelected(daySelected.add(1, "day"))} 
                  className="p-2 hover:bg-gray-100 rounded-full">
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Time labels */}
        <div className="w-20 border-r bg-white sticky left-0">
          {hoursOfDay.map(hour => (
            <div key={hour} className="h-[60px] border-t border-gray-200">
              <div className="text-xs text-gray-500 text-right pr-2 -mt-2.5">
                {dayjs().hour(hour).format("h A")}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex-1 relative">
          {/* Hour blocks */}
          {hoursOfDay.map(hour => (
            <div key={hour} className="relative h-[60px]">
              {/* Quarter hour markers */}
              {quarterHours.map(quarter => (
                <div
                  key={quarter}
                  className={`absolute w-full border-t border-gray-100 ${
                    quarter === 0 ? 'border-gray-200' : ''
                  }`}
                  style={{ top: `${quarter * 15}px` }}
                />
              ))}
              
              {/* Click target */}
              <div
                className="absolute inset-0 group hover:bg-blue-50/30 cursor-pointer"
                onClick={() => handleTimeSlotClick(hour)}
              />
            </div>
          ))}

          {/* Current time indicator */}
          {daySelected.isSame(dayjs(), 'day') && (
            <div 
              className="absolute w-full border-t-2 border-red-500 z-30"
              style={{ top: getTimePosition(currentTime) }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full" />
            </div>
          )}

          {/* Events */}
          {savedEvents.map(event => (
            <div
              key={event.id}
              className={`absolute left-[5px] right-[5px] rounded-lg p-2 text-sm bg-${event.label}-100 border border-${event.label}-300 overflow-hidden`}
              style={getEventStyle(event)}
            >
              <div className="font-semibold truncate">{event.title}</div>
              <div className="text-xs">
                {dayjs(event.startTime || event.day).format("h:mm A")} - 
                {dayjs(event.endTime || event.day).format("h:mm A")}
              </div>
            </div>
          ))}

          {/* Tasks */}
          {savedTasks.map(task => (
            <div
              key={task.id}
              className={`absolute left-[5px] right-[5px] h-6 rounded-lg p-1 text-sm bg-${task.label}-50 border border-${task.label}-200`}
              style={{
                top: getTimePosition(dayjs(task.dueDate))
              }}
            >
              <div className="font-semibold truncate">{task.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}