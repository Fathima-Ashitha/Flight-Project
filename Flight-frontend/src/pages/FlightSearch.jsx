import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/client";
import FlightCard from "../components/FlightCard";

export default function FlightSearch() {
  const [query, setQuery] = useState({ origin: "", destination: "", date: "" });
  const [flights, setFlights] = useState([]);

  const handleChange = (e) =>
    setQuery({ ...query, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await API.get("/flights/search/", { params: query });
    setFlights(res.data);
  };

  const bookFlight = async (flightId) => {
    await API.post("/bookings/create/", { flight: flightId, seats_booked: 1 });
    alert("Flight booked!");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Search Flights</h2>
        <form onSubmit={handleSearch}>
          <input name="origin" placeholder="Origin" onChange={handleChange} />
          <input name="destination" placeholder="Destination" onChange={handleChange} />
          <input type="date" name="date" onChange={handleChange} />
          <button>Search</button>
        </form>

        <div>
          {flights.map((f) => (
            <FlightCard key={f.id} flight={f} onBook={bookFlight} />
          ))}
        </div>
      </div>
    </>
  );
}
