import React, { useState } from "react";
import Day from "./Day";

export default function Month({ month }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [dragging, setDragging] = useState(false);

  function handleMouseDown(day) {
    setDragging(true);
    setSelectedDays([day]);
  }

  function handleMouseEnter(day) {
    if (dragging) {
      setSelectedDays((prevDays) => {
        if (!prevDays.includes(day)) {
          return [...prevDays, day];
        }
        return prevDays;
      });
    }
  }

  function handleMouseUp() {
    setDragging(false);
  }

  return (
    <div
      className="flex-1 grid grid-cols-7 grid-rows-5 border-rounded-md shadow-md"
      onMouseUp={handleMouseUp}
    >
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day
              day={day}
              key={idx}
              rowIdx={i}
              onMouseDown={() => handleMouseDown(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              isSelected={selectedDays.includes(day)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}