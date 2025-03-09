import React, { useContext, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

export default function DayView() {
  const { daySelected, savedEvents, savedTasks, dispatchCalEvent, dispatchCalTask } = useContext(GlobalContext);
  const [startOfDay, setStartOfDay] = useState(dayjs().startOf("day"));
  const [selectedHours, setSelectedHours] = useState([]);
  const [dragging, setDragging] = useState(false);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  const eventsForDay = savedEvents.filter(event =>
    dayjs(event.day).isSame(daySelected, "day")
  );

  const tasksForDay = savedTasks.filter(task =>
    dayjs(task.dueDate).isSame(daySelected, "day")
  );

  function handlePrevDay() {
    setStartOfDay(startOfDay.subtract(1, "day"));
  }

  function handleNextDay() {
    setStartOfDay(startOfDay.add(1, "day"));
  }

  function handleDrop(e, hour) {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (eventData.type === "event") {
      eventData.day = startOfDay.hour(hour).valueOf();
      dispatchCalEvent({ type: "update", payload: eventData });
    } else if (eventData.type === "task") {
      eventData.dueDate = startOfDay.hour(hour).valueOf();
      dispatchCalTask({ type: "update", payload: eventData });
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleMouseDown(hour) {
    setDragging(true);
    setSelectedHours([hour]);
  }

  function handleMouseEnter(hour) {
    if (dragging) {
      setSelectedHours(prevHours => {
        if (!prevHours.includes(hour)) {
          return [...prevHours, hour];
        }
        return prevHours;
      });
    }
  }

  function handleMouseUp() {
    setDragging(false);
    // Here you can handle the creation of events or tasks with the selectedHours
    console.log("Selected Hours:", selectedHours);
  }

  return (
    <div className="p-4 h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Day View</h2>
      <div className="border p-4 rounded-lg shadow-md h-full w-full">
        <header className="flex justify-between items-center mb-4">
          <button onClick={handlePrevDay}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_left
            </span>
          </button>
          <h3 className="text-xl font-semibold">
            {startOfDay.format("dddd, MMM D")}
          </h3>
          <button onClick={handleNextDay}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_right
            </span>
          </button>
        </header>
        <div className="grid grid-rows-24 gap-1 h-full w-full" onMouseUp={handleMouseUp}>
          {hoursOfDay.map(hour => (
            <div
              key={hour}
              className={`border-t border justify-between ${selectedHours.includes(hour) ? 'bg-blue-200' : ''}`}
              onDrop={(e) => handleDrop(e, hour)}
              onDragOver={handleDragOver}
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
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