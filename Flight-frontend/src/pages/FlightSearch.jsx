import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/client"; // Adjust path if needed
import FlightCard from "../components/FlightCard"; // Reuse your flight card component

export default function FlightSearch() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const origin = queryParams.get("origin") || "";
  const destination = queryParams.get("destination") || "";

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (origin) params.origin = origin;
        if (destination) params.destination = destination;

        const res = await API.get("/flights/search/", { params });
        setFlights(res.data);
      } catch (err) {
        setError("Failed to fetch flights.");
      } finally {
        setLoading(false);
      }
    }

    if (origin || destination) {
      fetchFlights();
    } else {
      // Clear flights if no params
      setFlights([]);
    }
  }, [origin, destination]);

  return (
    <div>
      <h2>Search Flights</h2>
      <p>
        Searching by{" "}
        {origin && <strong>Origin: {origin}</strong>}
        {origin && destination && " and "}
        {destination && <strong>Destination: {destination}</strong>}
        {!origin && !destination && "No search criteria provided."}
      </p>

      {loading && <p>Loading flights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && flights.length === 0 && (
        <p>No flights found matching your criteria.</p>
      )}

      <div>
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}
