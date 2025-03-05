import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import CalendarEvent from "./CalendarEvent";
import dayjs from "dayjs";

export default function DayView() {
  const { daySelected, setDaySelected, savedEvents } = useContext(GlobalContext);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    const events = savedEvents.filter(evt => {
      const eventDate = dayjs(evt.day);
      return eventDate.isSame(daySelected, "day");
    });
    setDayEvents(events);
  }, [savedEvents, daySelected]);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  function handlePrevDay() {
    setDaySelected(daySelected.subtract(1, "day"));
  }

  function handleNextDay() {
    setDaySelected(daySelected.add(1, "day"));
  }

  return (
    <div className="p-4 h-full w-full">
      <div className="border p-4 rounded-lg shadow-md h-full w-full">
        <header className="flex justify-between items-left mb-4">
          <button onClick={handlePrevDay}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_left
            </span>
          </button>
          <h3 className="text-xl font-semibold">
            {daySelected ? daySelected.format("dddd, MMM D") : "No day selected"}
          </h3>
          <button onClick={handleNextDay}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_right
            </span>
          </button>
        </header>
        <div className="grid grid-rows-24 gap-1 h-full w-full">
          {hoursOfDay.map(hour => (
            <div key={hour} className="border-t border-gray-200 p-1 flex flex-col justify-between">
              <span className="text-xs text-gray-500">{dayjs().hour(hour).format("h A")}</span>
              <ul className="list-disc pl-5">
                {dayEvents
                  .filter(event => dayjs(event.day).hour() === hour)
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
    </div>
  );
}