import React, { useState, useReducer, useEffect, createContext } from "react";
import dayjs from "dayjs";

const GlobalContext = createContext({
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
  dispatchCalTask: () => {},
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
    case "delete":
      return {
        ...state,
        savedEvents: state.savedEvents.filter(
          (event) => event.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

function savedTasksReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((task) => (task.id === payload.id ? payload : task));
    case "delete":
      return state.filter((task) => task.id !== payload.id);
    default:
      throw new Error();
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

function initTasks() {
  const storageTasks = localStorage.getItem("savedTasks");
  const parsedTasks = storageTasks ? JSON.parse(storageTasks) : [];
  return parsedTasks;
}

export function GlobalProvider({ children }) {
  const [savedTasks, dispatchCalTask] = useReducer(savedTasksReducer, [], initTasks);
  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], initEvents);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [viewMode, setViewMode] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [daySelected, setDaySelected] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [multiDaySelection, setMultiDaySelection] = useState([]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  }, [savedTasks]);

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth: 0,
        setSmallCalendarMonth: () => {},
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        showTaskModal,
        setShowTaskModal,
        dispatchCalEvent,
        dispatchCalTask,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
        setLabels,
        labels,
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