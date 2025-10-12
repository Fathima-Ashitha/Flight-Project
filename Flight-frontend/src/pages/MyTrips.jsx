import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/client";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await API.get("/bookings/bookings/");
      setTrips(res.data);
    };
    fetchTrips();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>My Trips</h2>
        {trips.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          trips.map((b) => (
            <div key={b.id} className="flight-card">
              <h3>{b.flight_detail?.flight_number}</h3>
              <p>Seats: {b.seats_booked}</p>
              <p>Status: {b.payment_status}</p>
              <p>Reference: {b.booking_reference}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
