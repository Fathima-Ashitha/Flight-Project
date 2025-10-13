import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/client";
import FlightCard from "../components/FlightCard";
import "./AdminDashboard.css";
import axios from "axios";

export default function AdminDashboard() {
  const [view, setView] = useState("home");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [detailedFlight, setDetailedFlight] = useState(null);

  const [flightForm, setFlightForm] = useState({
    flight_no: "",
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    total_seats: 0,
    price: 0,
    seats_available: 0,
  });

  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
    fetchFlights();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await API.get("/auth/admin/users/pending/");
      setPendingUsers(res.data);
    } catch (e) {
      console.error("Error fetching pending users", e);
    }
  };

  const approveUser = async (id) => {
    await API.post(`/auth/admin/users/${id}/approve/`);
    fetchPendingUsers();
  };

  const fetchFlights = async () => {
    try {
      const res = await API.get("/flights/");
      setFlights(res.data);
    } catch (e) {
      console.error("Error fetching flights", e);
    }
  };

  const fetchFlightDetails = async (flightNo) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/flights/${flightNo}/`
      );
      setDetailedFlight(response.data);
    } catch (error) {
      console.error("Failed to fetch flight details", error);
    }
  };

  const updateFlightStatus = async (flightNo, newStatus) => {
    try {
      const url = `http://localhost:8000/api/flights/${flightNo}/status/`;
      console.log("Final URL:", url);

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");
      const data = await res.json();
      console.log("Status updated:", data);

      fetchFlights();
      if (detailedFlight?.flight_no === flightNo) {
        fetchFlightDetails(flightNo);
      }

      alert(`Flight status updated to "${newStatus}" successfully!`); // Success popup
    } catch (err) {
      console.error("Failed to update flight status", err);
      alert("Could not update flight status.");
    }
  };

  const createFlight = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...flightForm,
        seats_available: flightForm.total_seats,
      };

      const res = await API.post("/flights/create/", payload);
      fetchFlights();

      alert(`Flight ${res.data.flight_no} added successfully!`);

      setFlightForm({
        flight_no: "",
        origin: "",
        destination: "",
        departure_time: "",
        arrival_time: "",
        total_seats: 0,
        price: 0,
        seats_available: 0,
      });

      setView("manage-flights");
    } catch (err) {
      const message =
        err.response?.data?.detail || "Failed to add flight. Please try again.";
      setError(message);
    }
  };

  const searchFlights = async (origin, destination) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (origin) params.append("origin", origin);
      if (destination) params.append("destination", destination);

      const res = await API.get(`/flights/search?${params.toString()}`);
      setFlights(res.data);
      setView("search-results");
    } catch (err) {
      setError("Failed to fetch flights. Please try again.");
      setFlights([]);
    }
    setLoading(false);
  };

  const handleSearch = (origin, destination) => {
    setSearchParams({ origin, destination });
    searchFlights(origin, destination);
  };

  const closeFlightDetails = () => {
    setDetailedFlight(null);
  };

  const renderView = () => {
    switch (view) {
      case "pending-users":
        return (
          <>
            <h3>Pending User Approvals</h3>
            {pendingUsers.length === 0 ? (
              <p>No pending users.</p>
            ) : (
              pendingUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    padding: "0.5rem 1rem",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    backgroundColor: "#f9f9f9",
                    maxWidth: 400,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>{u.username}</strong> ({u.email})
                  </p>
                  <button
                    onClick={() => approveUser(u.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
          </>
        );

      case "add-flight":
        return (
          <>
            <h3>Add New Flight</h3>
            <form onSubmit={createFlight}>
              <input
                placeholder="Flight Number"
                value={flightForm.flight_no}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, flight_no: e.target.value })
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
                  setFlightForm({
                    ...flightForm,
                    departure_time: e.target.value,
                  })
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
                value={flightForm.total_seats || ""}
                onChange={(e) =>
                  setFlightForm({
                    ...flightForm,
                    total_seats: parseInt(e.target.value) || 0,
                  })
                }
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
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </>
        );

      case "search-results":
        return (
          <>
            <h3>
              Search Results{" "}
              {searchParams.origin && `- Origin: ${searchParams.origin}`}{" "}
              {searchParams.destination &&
                `- Destination: ${searchParams.destination}`}
            </h3>
            {loading && <p>Loading flights...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && flights.length === 0 && <p>No flights found.</p>}
            {!loading &&
              flights.map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  isAdmin={true}
                  onUpdateStatus={updateFlightStatus}
                />
              ))}
          </>
        );

      default:
        return (
          <>
            <h3>Manage Flights</h3>
            {flights.length === 0 ? (
              <p>No flights available.</p>
            ) : (
              flights.map((f) => {
                const formattedDeparture = new Date(
                  f.departure_time
                ).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: true,
                });

                return (
                  <div
                    key={f.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      borderRadius: "4px",
                    }}
                  >
                    <p>
                      <strong>
                        {f.origin} → {f.destination}
                      </strong>
                    </p>
                    <p>Departure: {formattedDeparture}</p>
                    <button onClick={() => fetchFlightDetails(f.id)}>
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </>
        );
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="admin-dashboard" style={{ display: "flex" }}>
        <aside className="sidebar" style={{ width: "200px" }}>
          <h3>Admin Menu</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button onClick={() => setView("pending-users")}>
                Pending Approvals
              </button>
            </li>
            <li>
              <button onClick={() => setView("add-flight")}>Add Flight</button>
            </li>
            <li>
              <button onClick={() => setView("manage-flights")}>
                Manage Flights
              </button>
            </li>
          </ul>
        </aside>

        <main
          className="dashboard-content"
          style={{ flex: 1, padding: "1rem", position: "relative" }}
        >
          {renderView()}

          {detailedFlight && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "8px",
                  width: "600px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    padding: "1rem",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                >
                  <button
                    onClick={closeFlightDetails}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "transparent",
                      border: "none",
                      fontSize: 20,
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                  <h2>Flight Details</h2>
                  <FlightCard
                    flight={detailedFlight}
                    isAdmin={true}
                    onUpdateStatus={updateFlightStatus}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
