import React, { useState } from "react";
import { format, addMinutes, isBefore, isEqual } from "date-fns";

export default function WarehouseTimeslotApp() {
  const [bookings, setBookings] = useState([]);
  const [company, setCompany] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);

  const timesOverlap = (startA, endA, startB, endB) => {
    return (isBefore(startA, endB) || isEqual(startA, endB)) &&
           (isBefore(startB, endA) || isEqual(startB, endA));
  };

  const handleBooking = () => {
    if (!company || !reference || !date || !startTime) return;

    const start = new Date(`${date}T${startTime}:00`);
    const end = addMinutes(start, duration);
    const gapEnd = addMinutes(start, -15);
    const gapStart = addMinutes(end, 15);

    for (const b of bookings) {
      const bStart = new Date(b.start);
      const bEnd = new Date(b.end);

      if (timesOverlap(gapEnd, gapStart, bStart, bEnd)) {
        alert("Booking conflicts with an existing slot including the 15 min buffer.");
        return;
      }
    }

    setBookings([...bookings, { company, reference, start, end }]);
    setCompany("");
    setReference("");
  };

  const sorted = [...bookings].sort((a, b) => new Date(a.start) - new Date(b.start));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Warehouse Timeslot Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-2xl shadow">
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded-xl"
            placeholder="Company Name"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded-xl"
            placeholder="Pickup Reference"
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-2 border rounded-xl"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <input
            type="time"
            className="w-full p-2 border rounded-xl"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded-xl"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1 hour 30 minutes</option>
          </select>

          <button
            className="p-2 bg-blue-600 text-white rounded-xl shadow"
            onClick={handleBooking}
          >
            Book Slot
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Calendar View</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sorted.map((b, i) => (
              <div key={i} className="p-3 border rounded-xl shadow-sm">
                <div className="font-bold">{b.company}</div>
                <div>Ref: {b.reference}</div>
                <div>
                  {format(new Date(b.start), "dd MMM yyyy HH:mm")} - {format(new Date(b.end), "HH:mm")}
                </div>
              </div>
            ))}
            {sorted.length === 0 && <div className="text-gray-500">No bookings yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
