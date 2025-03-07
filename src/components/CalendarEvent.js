import React, { useContext } from "react";
import dayjs from "dayjs";
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

  const startTime = dayjs(event.startTime).format("h:mm A");
  const endTime = dayjs(event.endTime).format("h:mm A");
  
  return (
    <div
      className={`calendar-event border-rounded-200 text-white-200 bg-${event.label}-200 hover:bg-${event.label}-500 cursor-pointer`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <span>{event.title}</span>
      <span>{event.startTime} - {event.endTime}</span>
    </div>
  );
}