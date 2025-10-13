import React from "react";

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 20,
    maxWidth: 320,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    margin: "1rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
  },
  flightNo: {
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: "1.3rem",
    color: "#222",
  },
  route: {
    fontSize: "1.1rem",
    marginBottom: 12,
    color: "#555",
  },
  label: {
    fontWeight: "600",
  },
  status: (status) => ({
    color: status === "Delayed" ? "orange" : status === "Cancelled" ? "red" : "green",
    fontWeight: "600",
  }),
  button: {
    padding: "8px 16px",
    margin: "5px 5px 0 0",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "background-color 0.3s ease",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
  bookBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  buttonContainer: {
    marginTop: 15,
  },
};

const FlightCard = ({ flight, onBook, isAdmin, onUpdateStatus }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.flightNo}>{flight.flight_no || flight.flight_number}</h3>
      <p style={styles.route}>
        {flight.origin} → {flight.destination}
      </p>
      <p>
        <span style={styles.label}>Departure: </span>
        {new Date(flight.departure_time).toLocaleString()}
      </p>
      <p>
        <span style={styles.label}>Arrival: </span>
        {new Date(flight.arrival_time).toLocaleString()}
      </p>
      <p>
        <span style={styles.label}>Price: </span>₹{flight.price}
      </p>
      <p>
        <span style={styles.label}>Status: </span>
        <span style={styles.status(flight.status)}>{flight.status}</span>
      </p>

      {onBook && (
        <button
          style={{ ...styles.button, ...styles.bookBtn }}
          onClick={() => onBook(flight.id)}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          Book Flight
        </button>
      )}

      {isAdmin && (
        <div style={styles.buttonContainer}>
          {["On-time", "Delayed", "Cancelled"].map((status) => (
            <button
              key={status}
              style={styles.button}
              onClick={() => onUpdateStatus(flight.flight_no, status)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ddd")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
            >
              Mark {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightCard;
