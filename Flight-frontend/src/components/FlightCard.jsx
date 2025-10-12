import React from "react";

const FlightCard = ({ flight, onBook, isAdmin, onUpdateStatus }) => {
  return (
    <div className="flight-card">
      <h3>{flight.flight_number}</h3>
      <p>
        {flight.origin} → {flight.destination}
      </p>
      <p>
        <strong>Departure:</strong>{" "}
        {new Date(flight.departure_time).toLocaleString()}
      </p>
      <p>
        <strong>Arrival:</strong>{" "}
        {new Date(flight.arrival_time).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> ₹{flight.price}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color:
              flight.status === "Delayed"
                ? "orange"
                : flight.status === "Cancelled"
                ? "red"
                : "green",
          }}
        >
          {flight.status}
        </span>
      </p>

      {onBook && (
        <button onClick={() => onBook(flight.id)}>Book Flight</button>
      )}

      {isAdmin && (
        <div>
          <button onClick={() => onUpdateStatus(flight.flight_number, "On-time")}>
            Mark On-time
          </button>
          <button onClick={() => onUpdateStatus(flight.flight_number, "Delayed")}>
            Mark Delayed
          </button>
          <button onClick={() => onUpdateStatus(flight.flight_number, "Cancelled")}>
            Mark Cancelled
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
