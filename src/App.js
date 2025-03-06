import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
import YearView from "./components/YearView";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";



function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal, viewMode, } = useContext(GlobalContext);
  
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      
      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          {viewMode === "month" && <Month month={currentMonth} />}
          {viewMode === "week" && <WeekView />}
          {viewMode === "day" && <DayView />}
          {viewMode === "Year" && <YearView />}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;