import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function CalendarEvent({ event }) {
  const { setSelectedEvent, setShowEventModal } = useContext(GlobalContext);

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", JSON.stringify(event));
  }

  function handleClick() {
    setSelectedEvent(event);
    setShowEventModal(true);
  }

  return (
    <div
      className={`calendar-event bg-${event.label}-200`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <span>{event.title}</span>
      <span>{event.startTime} - {event.endTime}</span>
    </div>
  );
}