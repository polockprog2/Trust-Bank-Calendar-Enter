import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";
import CalendarEvent from "./CalendarEvent";

export default function WeekView() {
  const { savedEvents, setMultiDaySelection } = useContext(GlobalContext);
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf("week"));
  const [weekEvents, setWeekEvents] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  
  useEffect(() => {
    const events = savedEvents.filter(evt => {
      const eventDate = dayjs(evt.day);
      return eventDate.isSame(startOfWeek, "week");
    });
    setWeekEvents(events);
  }, [savedEvents, startOfWeek]);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  function handlePrevWeek() {
    setStartOfWeek(startOfWeek.subtract(1, "week"));
  }

  function handleNextWeek() {
    setStartOfWeek(startOfWeek.add(1, "week"));
  }

  function handleMouseDown(day) {
    setDragging(true);
    setSelectedDays([day]);
  }

  function handleMouseEnter(day) {
    if (dragging) {
      setSelectedDays(prevDays => [...prevDays, day]);
    }
  }

  function handleMouseUp() {
    setDragging(false);
    setMultiDaySelection(selectedDays);
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <button onClick={handlePrevWeek}>
          <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
            chevron_left
          </span>
        </button>
        <h3 className="text-xl font-semibold">
          {startOfWeek.format("MMMM YYYY")}
        </h3>
        <button onClick={handleNextWeek}>
          <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
            chevron_right
          </span>
        </button>
      </header>
      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div
            key={day.format("YYYY-MM-DD")}
            className={`border p-4 rounded-lg shadow-md ${selectedDays.includes(day) ? 'bg-blue-100' : ''}`}
            onMouseDown={() => handleMouseDown(day)}
            onMouseEnter={() => handleMouseEnter(day)}
            onMouseUp={handleMouseUp}
          >
            <h3 className="text-xl font-semibold mb-2">{day.format("dddd, MMM D")}</h3>
            <div className="grid grid-rows-24 gap-1">
              {hoursOfDay.map(hour => (
                <div key={hour} className="border-t border-gray-200 p-1">
                  <span className="text-xs text-gray-500">{dayjs().hour(hour).format("h A")}</span>
                  <ul className="list-disc pl-5">
                    {weekEvents
                      .filter(event => dayjs(event.day).isSame(day.hour(hour), "hour"))
                      .map(event => (
                        <li key={event.id} className="mb-2">
                          <CalendarEvent event={event} />
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}