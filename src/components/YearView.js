import React from "react";
import dayjs from "dayjs";
import Month from "./Month";

import "../components/YearView.css";

export default function YearView({ year }) {
  const months = Array.from({ length: 12 }, (_, i) => dayjs(new Date(year, i, 1)));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Year View</h2>
      <h2 className="text-2xl font-bold mb-4">{year}</h2>
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, idx) => (
          <div key={idx} className="border rounded-lg p-2">
            <h3 className="text-xl font-semibold mb-2">{month.format("MMMM")}</h3>
            <Month month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}