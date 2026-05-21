import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/login.css";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.data);
      window.location.href = "/";
    }
    catch (err) {
      setError("Invalid Username or Password");
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to <strong>EnviroSense</strong></p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">

          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>

      </div>
    </div>
  );
}

export default Login;
