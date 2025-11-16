import { bookings } from "./bookings";

export default function Admin() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Admin – Booking Calendar</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      <ul>
        {bookings.map((b, i) => (
          <li key={i}>
            <strong>{b.slot}</strong> — {b.company} (Ref: {b.reference})
          </li>
        ))}
      </ul>
    </div>
  );
}
