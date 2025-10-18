import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ onSearch}) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("origin"); // select box state
  const [searchValue, setSearchValue] = useState("");      // text input state

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

const handleSearch = () => {
  const query = new URLSearchParams();
  if (searchValue.trim()) {
    query.append(searchType, searchValue.trim());
    navigate(`?${query.toString()}`);  // <-- change here
  }
};



  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>✈️ AirBooking</h2>
      </div>

      <div className="nav-center">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-input small"
        >
          <option value="origin">Origin</option>
          <option value="destination">Destination</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="search-input small"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="nav-right">
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
