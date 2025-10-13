import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/client";
import FlightCard from "../components/FlightCard";
import "./AdminDashboard.css";

export default function Dashboard() {
  const [view, setView] = useState("all-flights");

  // Separate loading & error states for flights and bookings
  const [flights, setFlights] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [flightsError, setFlightsError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
  });

  // Fetch flights on mount
  useEffect(() => {
    fetchFlights();
    fetchBookings();
  }, []);

  // Fetch all flights
  const fetchFlights = async () => {
    setFlightsLoading(true);
    setFlightsError("");
    try {
      const res = await API.get("/flights/");
      setFlights(res.data);
    } catch (err) {
      setFlightsError("Failed to fetch flights.");
      setFlights([]);
    }
    setFlightsLoading(false);
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError("");
    try {
      const res = await API.get("/bookings/bookings/");
      setBookings(res.data);
      console.log("Bookings data:", res.data);
    } catch (err) {
      setBookingsError("Failed to fetch bookings.");
      setBookings([]);
    }
    setBookingsLoading(false);
  };

  // Search flights by origin/destination
  const searchFlights = async (origin, destination) => {
    setFlightsLoading(true);
    setFlightsError("");
    try {
      const params = new URLSearchParams();
      if (origin) params.append("origin", origin);
      if (destination) params.append("destination", destination);

      const res = await API.get(`/flights/search?${params.toString()}`);
      setFlights(res.data);
      setView("all-flights");
      setSearchParams({ origin, destination });
    } catch (err) {
      setFlightsError("Failed to fetch flights.");
      setFlights([]);
    }
    setFlightsLoading(false);
  };

  const handleSearch = (origin, destination) => {
    searchFlights(origin, destination);
  };

  // Book a flight with seat selection prompt
  const bookFlight = async (flight) => {
    if (flight.seats_available <= 0) {
      alert("No seats available for this flight.");
      return;
    }

    let seatsStr = prompt(
      `Enter number of seats to book (Available: ${flight.seats_available}):`,
      "1"
    );
    if (seatsStr === null) return; // user cancelled

    const seats = parseInt(seatsStr, 10);
    if (isNaN(seats) || seats < 1 || seats > flight.seats_available) {
      alert("Invalid number of seats.");
      return;
    }

    try {
      await API.post(`/bookings/create/`, {
        flight: flight.id,
        seats_booked: seats,
      });
      alert("Flight booked successfully!");
      fetchBookings();
      fetchFlights(); // update available seats
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "Failed to book flight: " + (err.response?.data?.detail || err.message)
      );
    }
  };

  // Find flight details by ID
  const getFlightById = (id) => flights.find((f) => f.id === id);

  // Render flights list
  const renderFlights = () => {
    if (flightsLoading) return <p>Loading flights...</p>;
    if (flightsError) return <p style={{ color: "red" }}>{flightsError}</p>;
    if (flights.length === 0) return <p>No flights found.</p>;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            isAdmin={false}
            onBook={() => bookFlight(flight)}
            disabled={flight.seats_available <= 0}
          />
        ))}
      </div>
    );
  };

  // Render bookings list
  const renderBookings = () => {
    if (bookingsLoading) return <p>Loading bookings...</p>;
    if (bookingsError) return <p style={{ color: "red" }}>{bookingsError}</p>;
    if (bookings.length === 0) return <p>You have no bookings.</p>;

    return bookings.map((booking) => {
      const flight = getFlightById(booking.flight);
      return (
        <div
          key={booking.id}
          className="booking-card"
          style={{
            marginBottom: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          {flight ? (
            <>
              <p>
                <strong>Flight:</strong> {flight.flight_number} ({flight.origin}{" "}
                → {flight.destination})
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(flight.departure_time).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {flight.status}
              </p>
            </>
          ) : (
            <p>Loading flight details...</p>
          )}
          <p>
            <strong>Booking Ref:</strong> {booking.booking_ref}
          </p>
          <p>
            <strong>Seats Booked:</strong> {booking.seats_booked}
          </p>
          <p>
            <strong>Payment Status:</strong> {booking.payment_status}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <div
        className="user-dashboard"
        style={{ display: "flex", minHeight: "80vh" }}
      >
        <aside
          className="sidebar"
          style={{
            width: "220px",
            borderRight: "1px solid #ddd",
            padding: "1rem",
          }}
        >
          <h3>User Menu</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button
                onClick={() => {
                  setView("all-flights");
                  fetchFlights();
                }}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              >
                All Flights
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setView("my-bookings");
                  fetchBookings();
                }}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              >
                My Bookings
              </button>
            </li>
          </ul>
        </aside>

        <main
          className="dashboard-content"
          style={{ flex: 1, padding: "1rem" }}
        >
          {view === "all-flights" && (
            <>
              <h3>
                All Flights
                {(searchParams.origin || searchParams.destination) && (
                  <span>
                    {" "}
                    - Search:{" "}
                    {searchParams.origin && `Origin: ${searchParams.origin} `}
                    {searchParams.destination &&
                      `Destination: ${searchParams.destination}`}
                  </span>
                )}
              </h3>
              {renderFlights()}
            </>
          )}

          {view === "my-bookings" && (
            <>
              <h3>My Bookings</h3>
              {renderBookings()}
            </>
          )}

          {view === "book-new" && (
            <>
              <h3>Book New Flight</h3>
              <p>Use the search bar above to find flights and book them.</p>
            </>
          )}
        </main>
      </div>
    </>
  );
}
