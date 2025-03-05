import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/trust.png";
import GlobalContext from "../context/GlobalContext";
import ViewSwitcherDropdown from "./ViewSwitcherDrodown";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex, viewMode } = useContext(GlobalContext);

  function handlePrev() {
    if (viewMode === "month") {
      setMonthIndex(monthIndex - 1);
    }
  }

  function handleNext() {
    if (viewMode === "month") {
      setMonthIndex(monthIndex + 1);
    }
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month()
    );
  }

  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 font-bold">Calendar</h1>
      
      <button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      
      <button onClick={handlePrev}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNext}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
      
      <div className="ml-auto flex space-x-2">
        <ViewSwitcherDropdown />
      </div>
    </header>
  );
}