import React, { useState } from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    //will implement search functionality here
  }

  return (
    <aside className="border-rounded p-6 w-80">
      <CreateEventButton />
      <SmallCalendar />
      <input
        type="text"
        className="border-rounded p-1 w-full mb-4"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Labels />
    </aside>
  );
}