import { useState } from "react";
import API from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Best for Vite/ESM

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login/", form);
      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const decoded = jwtDecode(access); // ✅ changed line
      console.log("Decoded JWT:", decoded);

      const role = decoded.is_superuser ? "admin" : "user";
      localStorage.setItem("user_role", role);

      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(
        err.response?.data?.detail || "Invalid credentials or not approved yet."
      );
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="error">{error}</p>
      <Link to="/register">No account? Register</Link>
    </div>
  );
}
