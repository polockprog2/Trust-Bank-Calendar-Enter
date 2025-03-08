import React, { useContext } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function DayView() {
  const { daySelected, savedEvents, savedTasks, dispatchCalEvent, dispatchCalTask } = useContext(GlobalContext);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  const eventsForDay = savedEvents.filter(event =>
    dayjs(event.day).isSame(daySelected, "day")
  );

  const tasksForDay = savedTasks.filter(task =>
    dayjs(task.dueDate).isSame(daySelected, "day")
  );

  function handleDrop(e, hour) {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (eventData.type === "event") {
      eventData.day = daySelected.hour(hour).valueOf();
      dispatchCalEvent({ type: "update", payload: eventData });
    } else if (eventData.type === "task") {
      eventData.dueDate = daySelected.hour(hour).valueOf();
      dispatchCalTask({ type: "update", payload: eventData });
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="p-4 h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Day View</h2>
      <div className="border p-4 rounded-lg shadow-md h-full w-full">
        <h3 className="text-xl font-semibold mb-2">
          {daySelected ? daySelected.format("dddd, MMM D") : "No day selected"}
        </h3>
        <div className="grid grid-rows-24 gap-1 h-full w-full">
          {hoursOfDay.map(hour => (
            <div
              key={hour}
              className="border-t border-gray-200 p-1 flex flex-col justify-between"
              onDrop={(e) => handleDrop(e, hour)}
              onDragOver={handleDragOver}
            >
              <span className="text-xs text-gray-500">{dayjs().hour(hour).format("h A")}</span>
              <ul className="list-disc pl-5">
                {eventsForDay
                  .filter(event => dayjs(event.day).hour() === hour)
                  .map(event => (
                    <li key={event.id} className="mb-2">
                      <div
                        className={`bg-${event.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", JSON.stringify({ ...event, type: "event" }));
                        }}
                      >
                        {event.title}
                      </div>
                    </li>
                  ))}
                {tasksForDay
                  .filter(task => dayjs(task.dueDate).hour() === hour)
                  .map(task => (
                    <li key={task.id} className="mb-2">
                      <div
                        className={`bg-${task.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", JSON.stringify({ ...task, type: "task" }));
                        }}
                      >
                        {task.title}
                      </div>
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