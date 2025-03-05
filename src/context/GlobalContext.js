import React, { useState, useReducer, useEffect, useMemo,createContext } from "react";
import dayjs from "dayjs";


const GlobalContext = React.createContext({
  monthIndex: 0,
  savedEvents: [],
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: null,
  setDaySelected: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  showTaskModal: false,
  setShowTaskModal: () => {},
  dispatchCalEvent: () => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
  viewMode: "month",
  setViewMode: () => {},
  multiDaySelection: [], 
  setMultiDaySelection: () => {}, 
});

function globalReducer(state, action) {
  switch (action.type) {
    case "update":
      return {
        ...state,
        savedEvents: state.savedEvents.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    // other cases...
    default:
      return state;
  }
}
function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}
export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);
}
export function ContextWrapper({ children }) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [viewMode, setViewMode] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], initEvents);
  const [multiDaySelection, setMultiDaySelection] = useState([]); 
  
  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        dispatchCalEvent,
        dispatch,
        monthIndex,
        setMonthIndex,
        smallCalendarMonth: 0,
        setSmallCalendarMonth: () => {},
        daySelected: null,
        setDaySelected: () => {},
        showEventModal,
        setShowEventModal,
        showTaskModal,
        setShowTaskModal,
        dispatchCalEvent,
        savedEvents,
        dispatchCalEvent,
        selectedEvent: null,
        setSelectedEvent: () => {},
        setLabels: () => {},
        labels: [],
        updateLabel: () => {},
        filteredEvents: [],
        viewMode,
        setViewMode,
        multiDaySelection, 
        setMultiDaySelection, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;