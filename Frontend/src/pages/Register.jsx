import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);


  const navigate = useNavigate();
  const validate = () => {

    if (!/^[A-Za-z0-9._]{3,}$/.test(username)) {
      return "Username must be at least 3 characters";
    }

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return "Enter a valid email address";
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Enter a valid 10-digit phone number";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      return "Password must be at least 8 characters";
    }

    if (password !== confirm) {
      return "Passwords do not match";
    }

    return null;
  };
  
  
  const handleRegister= async(e)=>{
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError=validate();
    if(validationError){
        setError(validationError);
        return ;
    }

    setLoading(true)
    try{
      const res=await register({username,email,phone,password,role:'ROLE_USER'});
      setSuccess(res.data);
      setTimeout(()=>navigate("/login"),1000);
    }
    catch(err){
      setError("Registration Failed. Please try again");
    }
    finally{
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Register for <strong>EnviroSense</strong></p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">

          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="3+ chars, letters/numbers"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 8 chars, 1 letter, 1 number, 1 special"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in here</span>
        </p>

      </div>
    </div>
  );
}

export default Register;
