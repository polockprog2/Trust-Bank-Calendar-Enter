import React, { useState, useReducer, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import GlobalContext from "./GlobalContext";

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

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // Add selectedTask state
  const [labels, setLabels] = useState([]);
  const [taskLabels, setTaskLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], initEvents);
  const [savedTasks, dispatchCalTask] = useReducer(savedTasksReducer, [], initTasks);
  const [viewMode, setViewMode] = useState("month");
  const [multiDaySelection, setMultiDaySelection] = useState([]);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  const filteredTasks = useMemo(() => {
    return savedTasks.filter((task) =>
      taskLabels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(task.label)
    );
  }, [savedTasks, taskLabels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  }, [savedTasks]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    setTaskLabels((prevLabels) => {
      return [...new Set(savedTasks.map((task) => task.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedTasks]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  useEffect(() => {
    if (!showTaskModal) {
      setSelectedTask(null);
    }
  }, [showTaskModal]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  function updateTaskLabel(label) {
    setTaskLabels(taskLabels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        showTaskModal,
        setShowTaskModal,
        setShowEventModal,
        dispatchCalEvent,
        dispatchCalTask,
        selectedEvent,
        setSelectedEvent,
        selectedTask, // Provide selectedTask
        setSelectedTask, // Provide setSelectedTask
        savedEvents,
        savedTasks,
        setLabels,
        labels,
        taskLabels,
        updateLabel,
        updateTaskLabel,
        filteredEvents,
        filteredTasks,
        viewMode,
        setViewMode,
        multiDaySelection,
        setMultiDaySelection,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}