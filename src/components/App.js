import React, { useState } from "react";
import moment from "moment";
import Popup from "react-popup";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-popup/style.css";
import "../styles/App.css"

const localizer = BigCalendar.momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: "Create Event",
      content: (
        <div>
          <input placeholder="Event Title" id="title" style={{ width: "100%", marginBottom: "8px" }} />
          <input placeholder="Event Location" id="location" style={{ width: "100%", marginBottom: "8px" }} />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => {
              const title = document.getElementById("title").value;
              const location = document.getElementById("location").value;
              if (!title) return;

              setEvents((prev) => [
                ...prev,
                { id: Date.now(), title: `${title} (${location})`, start, end: start },
              ]);
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const handleSelectEvent = (event) => {
    Popup.create({
      title: "Edit/Delete Event",
      content: (
        <div>
          <input id="editTitle" defaultValue={event.title} style={{ width: "100%", marginBottom: "8px" }} />
        </div>
      ),
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn--danger",
            action: () => {
              setEvents(events.filter((e) => e.id !== event.id));
              Popup.close();
            },
          },
        ],
        right: [
          {
            text: "Save",
            className: "mm-popup__btn--info",
            action: () => {
              const updatedTitle = document.getElementById("editTitle").value;
              setEvents(events.map((e) => (e.id === event.id ? { ...e, title: updatedTitle } : e)));
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    if (filter === "past") return new Date(event.start) < now;
    if (filter === "upcoming") return new Date(event.start) >= now;
    return true;
  });

  const eventStyleGetter = (event) => {
    const now = new Date();
    const backgroundColor =
      new Date(event.start) < now ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)";
    return { style: { backgroundColor } };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Tracker Calendar</h2>
      <div style={{ marginBottom: "10px" }}>
        <button className="btn" onClick={() => setFilter("all")}>All</button>
        <button className="btn" onClick={() => setFilter("past")}>Past</button>
        <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button>
      </div>
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

export default App;
