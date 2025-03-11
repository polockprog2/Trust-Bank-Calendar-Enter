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
      className={`calendar-event border-rounded-500 text-gray-200 bg-${event.label}-500 hover:bg-${event.label}-500 cursor-pointer`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <span style={{ fontWeight: "bold", color: "white" }}>{event.title}</span>
      <span>{event.startTime} - {event.endTime}</span>
    </div>
  );
}