import React, { useContext } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";
import  "./YearView.css";

export default function YearView() {
  const { savedEvents } = useContext(GlobalContext);
  const currentYear = dayjs().year();

  const monthsOfYear = Array.from({ length: 12 }, (_, i) =>
    dayjs().year(currentYear).month(i).startOf("month")
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Year View - {currentYear}</h2>
      <div className="grid grid-cols-3 gap-4">
        {monthsOfYear.map((month) => (
          <div key={month.format("YYYY-MM")} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">{month.format("MMMM YYYY")}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: month.daysInMonth() }, (_, i) =>
                month.date(i + 1)
              ).map((day) => (
                <div key={day.format("YYYY-MM-DD")} className="border p-1 rounded text-center">
                  <span className="block font-medium">{day.format("D")}</span>
                  <ul className="list-none p-0">
                    {savedEvents
                      .filter((event) => dayjs(event.day).isSame(day, "day"))
                      .map((event) => (
                        <li key={event.id} className="mt-1">
                          <span className="text-white text-xs px-1 py-0.5 rounded bg-blue-500">
                            {event.title}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}