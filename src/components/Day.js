import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import CalendarEvent from "./CalendarEvent";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    multiDaySelection,
    setMultiDaySelection,
    dispatchCalEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  function handleDayClick() {
    setDaySelected(day);
    setShowEventModal(true);
  }

  function handleEventClick(event) {
    setSelectedEvent(event);
    setShowEventModal(true);
  }

  function handleDayMouseDown() {
    setMultiDaySelection([day]);
  }

  function handleDayMouseUp() {
    if (multiDaySelection.length > 1) {
      setShowEventModal(true);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
    eventData.day = day.valueOf(); // Update the day of the event
    dispatchCalEvent({ type: "update", payload: eventData });
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div
      className="border border-gray-200 flex flex-col"
      onMouseDown={handleDayMouseDown}
      onMouseUp={handleDayMouseUp}
      onClick={handleDayClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div className="flex-1 cursor-pointer">
        {dayEvents.map((evt, idx) => (
          <CalendarEvent key={idx} event={evt} />
        ))}
      </div>
    </div>
  );
}