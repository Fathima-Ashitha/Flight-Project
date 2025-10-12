import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/client";
import FlightCard from "../components/FlightCard";

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [flightForm, setFlightForm] = useState({
    flight_number: "",
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    total_seats: "",
    price: "",
  });

  const fetchPendingUsers = async () => {
    const res = await API.get("/auth/admin/users/pending/");
    setPendingUsers(res.data);
  };

  const approveUser = async (id) => {
    await API.post(`/auth/admin/users/${id}/approve/`);
    fetchPendingUsers();
  };

  const fetchFlights = async () => {
    const res = await API.get("/flights/");
    setFlights(res.data);
  };

  const createFlight = async (e) => {
    e.preventDefault();
    await API.post("/flights/", flightForm);
    fetchFlights();
  };

  const updateFlightStatus = async (flight_no, newStatus) => {
    await API.put(`/flights/${flight_no}/status/`, { status: newStatus });
    fetchFlights();
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchFlights();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Admin Dashboard</h2>

        <section>
          <h3>Pending User Approvals</h3>
          {pendingUsers.length === 0 ? (
            <p>No pending users.</p>
          ) : (
            pendingUsers.map((u) => (
              <div key={u.id} className="flight-card">
                <p>
                  <strong>{u.username}</strong> ({u.email})
                </p>
                <button onClick={() => approveUser(u.id)}>Approve</button>
              </div>
            ))
          )}
        </section>

        <hr />

        <section>
          <h3>Add New Flight</h3>
          <form onSubmit={createFlight}>
            <input
              placeholder="Flight Number"
              value={flightForm.flight_number}
              onChange={(e) =>
                setFlightForm({ ...flightForm, flight_number: e.target.value })
              }
              required
            />
            <input
              placeholder="Origin"
              value={flightForm.origin}
              onChange={(e) =>
                setFlightForm({ ...flightForm, origin: e.target.value })
              }
              required
            />
            <input
              placeholder="Destination"
              value={flightForm.destination}
              onChange={(e) =>
                setFlightForm({ ...flightForm, destination: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={flightForm.departure_time}
              onChange={(e) =>
                setFlightForm({ ...flightForm, departure_time: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={flightForm.arrival_time}
              onChange={(e) =>
                setFlightForm({ ...flightForm, arrival_time: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Total Seats"
              value={flightForm.total_seats}
              onChange={(e) =>
                setFlightForm({ ...flightForm, total_seats: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={flightForm.price}
              onChange={(e) =>
                setFlightForm({ ...flightForm, price: e.target.value })
              }
              required
            />
            <button type="submit">Add Flight</button>
          </form>
        </section>

        <hr />

        <section>
          <h3>Manage Flights</h3>
          {flights.length === 0 ? (
            <p>No flights available.</p>
          ) : (
            flights.map((f) => (
              <FlightCard
                key={f.id}
                flight={f}
                isAdmin={true}
                onUpdateStatus={updateFlightStatus}
              />
            ))
          )}
        </section>
      </div>
    </>
  );
}
