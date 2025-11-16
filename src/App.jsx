import { useState } from "react";
import { bookings } from "./bookings";
import { addMinutes, isBefore } from "date-fns";

const TIMESLOTS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00"
];

export default function App() {
  const [company, setCompany] = useState("");
  const [reference, setReference] = useState("");
  const [slot, setSlot] = useState("");

  function isSlotAvailable(startTime) {
    const newStart = new Date(`2023-01-01T${startTime}:00`);
    const newEnd = addMinutes(newStart, 30);
    const bufferStart = addMinutes(newStart, -15);
    const bufferEnd = addMinutes(newEnd, 15);

    return !bookings.some((b) => {
      const bStart = new Date(`2023-01-01T${b.slot}:00`);
      const bEnd = addMinutes(bStart, 30);
      return !(isBefore(bufferEnd, bStart) || isBefore(bEnd, bufferStart));
    });
  }

  function book() {
    if (!company || !reference || !slot) return;

    if (!isSlotAvailable(slot)) {
      alert("Timeslot not available.");
      return;
    }

    bookings.push({ company, reference, slot });
    alert("Booking submitted!");
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Warehouse Booking</h1>

      <input
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Pickup reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <br /><br />

      <select value={slot} onChange={(e) => setSlot(e.target.value)}>
        <option>Choose a time</option>
        {TIMESLOTS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={book}>Book Timeslot</button>
    </div>
  );
}
