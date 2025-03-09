import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function DayView() {
  const { 
    daySelected, 
    savedEvents, 
    savedTasks, 
    setShowEventModal, 
    setDaySelected,
    setSelectedEvent,
    dispatchCalEvent 
  } = useContext(GlobalContext);
  
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [resizeType, setResizeType] = useState(null); // 'start' or 'end'

  // Filter tasks for current day
  const dayTasks = useMemo(() => 
    savedTasks.filter(task => 
      dayjs(task.dueDate).format('YYYY-MM-DD') === daySelected.format('YYYY-MM-DD')
    ),
    [savedTasks, daySelected]
  );

  // Handle time slot click
  const handleTimeSlotClick = useCallback((hour, minute = 0) => {
    const selectedDateTime = daySelected
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);
    setDaySelected(selectedDateTime);
    setShowEventModal(true);
  }, [daySelected, setDaySelected, setShowEventModal]);

  // Handle event click
  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, [setSelectedEvent, setShowEventModal]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hoursOfDay = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const quarterHours = useMemo(() => [0, 15, 30, 45], []);

  // Filter events for current day
  const dayEvents = useMemo(() => 
    savedEvents.filter(event => 
      dayjs(event.day).format('YYYY-MM-DD') === daySelected.format('YYYY-MM-DD')
    ),
    [savedEvents, daySelected]
  );

  // Calculate overlapping events
  const getOverlappingEvents = useCallback((event, events) => {
    return events.filter(evt => {
      if (evt.id === event.id) return false;
      const eventStart = dayjs(event.startTime || event.day);
      const eventEnd = dayjs(event.endTime || eventStart.add(1, 'hour'));
      const evtStart = dayjs(evt.startTime || evt.day);
      const evtEnd = dayjs(evt.endTime || evtStart.add(1, 'hour'));
      return (eventStart.isBefore(evtEnd) && eventEnd.isAfter(evtStart));
    });
  }, []);

  // Enhanced time position calculation
  const getTimePosition = useCallback((time) => {
    if (!time) return '0px';
    const minutes = time.hour() * 60 + time.minute();
    return `${minutes}px`;
  }, []);

  // Snap time to nearest 15 minutes
  const snapToGrid = useCallback((minutes) => {
    return Math.round(minutes / 15) * 15;
  }, []);

  // Enhanced event style calculation with overlap handling
  const getEventStyle = useCallback((event) => {
    const startTime = dayjs(event.startTime || event.day);
    const endTime = dayjs(event.endTime || startTime.add(1, 'hour'));
    const startMinutes = startTime.hour() * 60 + startTime.minute();
    const durationMinutes = endTime.diff(startTime, 'minute');
    
    const overlappingEvents = getOverlappingEvents(event, dayEvents);
    const position = overlappingEvents.length > 0 ? 
      (overlappingEvents.findIndex(evt => evt.id < event.id) + 1) : 0;
    const width = overlappingEvents.length > 0 ?
      `${95 / (overlappingEvents.length + 1)}%` : '95%';

    return {
      top: `${startMinutes}px`,
      height: `${Math.max(durationMinutes, 30)}px`,
      width,
      left: position ? `${(position * 95) / (overlappingEvents.length + 1)}%` : '2.5%',
      zIndex: draggedEvent?.id === event.id ? 30 : 20
    };
  }, [dayEvents, draggedEvent, getOverlappingEvents]);

  // Drag handlers
  const handleDragStart = useCallback((event, e) => {
    e.stopPropagation();
    setDraggedEvent(event);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset(e.clientY - rect.top);
  }, []);

  const handleDrag = useCallback((e) => {
    if (!draggedEvent) return;
    
    const gridRect = e.currentTarget.getBoundingClientRect();
    const y = Math.max(0, e.clientY - gridRect.top - dragOffset);
    const minutes = snapToGrid(Math.floor(y));
    
    const updatedEvent = {
      ...draggedEvent,
      startTime: daySelected
        .hour(Math.floor(minutes / 60))
        .minute(minutes % 60)
        .format('YYYY-MM-DD HH:mm'),
      endTime: daySelected
        .hour(Math.floor(minutes / 60))
        .minute(minutes % 60)
        .add(dayjs(draggedEvent.endTime).diff(draggedEvent.startTime, 'minute'), 'minute')
        .format('YYYY-MM-DD HH:mm')
    };
    
    setDraggedEvent(updatedEvent);
  }, [draggedEvent, dragOffset, daySelected, snapToGrid]);

  const handleDragEnd = useCallback(() => {
    if (draggedEvent) {
      dispatchCalEvent({ type: 'update', payload: draggedEvent });
      setDraggedEvent(null);
      setDragOffset(0);
    }
  }, [draggedEvent, dispatchCalEvent]);

  // Resize handlers
  const handleResizeStart = useCallback((event, type, e) => {
    e.stopPropagation();
    setResizingEvent(event);
    setResizeType(type);
  }, []);

  const handleResize = useCallback((e) => {
    if (!resizingEvent) return;
    
    const gridRect = e.currentTarget.getBoundingClientRect();
    const y = Math.max(0, e.clientY - gridRect.top);
    const minutes = snapToGrid(Math.floor(y));
    
    const updatedEvent = {
      ...resizingEvent,
      [resizeType === 'start' ? 'startTime' : 'endTime']: daySelected
        .hour(Math.floor(minutes / 60))
        .minute(minutes % 60)
        .format('YYYY-MM-DD HH:mm')
    };
    
    setResizingEvent(updatedEvent);
  }, [resizingEvent, resizeType, daySelected, snapToGrid]);

  const handleResizeEnd = useCallback(() => {
    if (resizingEvent) {
      dispatchCalEvent({ type: 'update', payload: resizingEvent });
      setResizingEvent(null);
      setResizeType(null);
    }
  }, [resizingEvent, dispatchCalEvent]);

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white">
      <header className="flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDaySelected(daySelected.subtract(1, "day"))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-icons-outlined">chevron_left</span>
          </button>
          <h2 className="text-xl font-semibold">
            {daySelected.format("dddd, MMMM D, YYYY")}
          </h2>
          <button 
            onClick={() => setDaySelected(daySelected.add(1, "day"))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Time labels */}
        <div className="w-20 border-r bg-white sticky left-0 z-20">
          {hoursOfDay.map(hour => (
            <div key={hour} className="h-[60px] border-t border-gray-200">
              <div className="text-xs text-gray-500 text-right pr-2 -mt-2.5">
                {dayjs().hour(hour).format("h A")}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div 
          className="flex-1 relative bg-gray-50"
          onMouseMove={(e) => {
            handleDrag(e);
            handleResize(e);
          }}
          onMouseUp={() => {
            handleDragEnd();
            handleResizeEnd();
          }}
          onMouseLeave={() => {
            handleDragEnd();
            handleResizeEnd();
          }}
        >
          {/* Hour blocks */}
          {hoursOfDay.map(hour => (
            <div key={hour} className="relative h-[60px]">
              {quarterHours.map(quarter => (
                <div
                  key={quarter}
                  onClick={() => handleTimeSlotClick(hour, quarter)}
                  className={`absolute w-full border-t ${
                    quarter === 0 ? 'border-gray-200' : 'border-gray-100'
                  } hover:bg-blue-50/30 cursor-pointer transition-colors`}
                  style={{ top: `${quarter}px` }}
                />
              ))}
            </div>
          ))}

          {/* Current time indicator */}
          {daySelected.isSame(dayjs(), 'day') && (
            <div 
              className="absolute w-full border-t-2 border-red-500 z-30 transition-all duration-500"
              style={{ top: getTimePosition(currentTime) }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full shadow-md" />
            </div>
          )}

          {/* Events */}
          {dayEvents.map(event => {
            const isBeingDragged = draggedEvent?.id === event.id;
            const isBeingResized = resizingEvent?.id === event.id;
            const eventToRender = isBeingDragged ? draggedEvent : 
                                isBeingResized ? resizingEvent : event;

            return (
              <div
                key={event.id}
                className={`absolute rounded-lg p-2 text-sm 
                  bg-${event.label}-100 border border-${event.label}-300 
                  ${isBeingDragged || isBeingResized ? 'shadow-lg opacity-90' : 'hover:shadow-md'}
                  transition-all cursor-move overflow-hidden`}
                style={getEventStyle(eventToRender)}
                onMouseDown={(e) => handleDragStart(event, e)}
                onClick={() => !draggedEvent && !resizingEvent && handleEventClick(event)}
              >
                {/* Resize handles */}
                <div 
                  className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-gray-200/50"
                  onMouseDown={(e) => handleResizeStart(event, 'start', e)}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-gray-200/50"
                  onMouseDown={(e) => handleResizeStart(event, 'end', e)}
                />
                
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-full absolute left-0 top-0 bg-gray-400 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-xs text-gray-600">
                      {dayjs(event.startTime || event.day).format("h:mm A")} - 
                      {dayjs(event.endTime || event.day).format("h:mm A")}
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-500 truncate mt-1">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Tasks */}
          {dayTasks.map(task => (
            <div
              key={task.id}
              className={`absolute left-[5px] right-[5px] h-6 rounded-lg p-1 
                text-sm bg-${task.label}-50 border border-${task.label}-200 
                hover:shadow-md transition-shadow cursor-pointer`}
              style={{
                top: getTimePosition(dayjs(task.dueDate)),
                zIndex: 25
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