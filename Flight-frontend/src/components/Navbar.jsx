import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>✈️ AirBooking</h2>
      <div>
        <Link to="/dashboard">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/my-trips">My Trips</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
