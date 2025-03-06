import React, { useContext } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function DayView() {
  const { daySelected, savedEvents } = useContext(GlobalContext);

  // Generate an array of hours for a day
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  // Filter events for the selected day
  const eventsForDay = savedEvents.filter(event =>
    dayjs(event.date).isSame(daySelected, "day")
  );

  return (
    <div className="p-4 h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Day View</h2>
      <div className="border p-4 rounded-lg shadow-md h-full w-full">
        <h3 className="text-xl font-semibold mb-2">
          {daySelected ? daySelected.format("dddd, MMM D") : "No day selected"}
        </h3>
        <div className="grid grid-rows-24 gap-1 h-full w-full">
          {hoursOfDay.map(hour => (
            <div key={hour} className="border-t border-gray-200 p-1 flex flex-col justify-between">
              <span className="text-xs text-gray-500">{dayjs().hour(hour).format("h A")}</span>
              <ul className="list-disc pl-5">
                {eventsForDay
                  .filter(event => dayjs(event.date).hour() === hour)
                  .map(event => (
                    <li key={event.id} className="mb-2">
                      <span className="font-medium">{event.title}</span>
                      <p className="text-gray-600">{event.description}</p>
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