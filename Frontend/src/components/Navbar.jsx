import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import "../styles/navbar.css";
import logo from './../assets/logo.png';

function Navbar() {

  const { room, setRoom } = useContext(RoomContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  
  return (
    <div className="navbar">

      <div className="nav-left">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <span className="title">EnviroSense</span>
      </div>

      <div className="nav-right">

        <div className="dropdown">
          <span>Room:</span>
          <select value={room} onChange={(e) => setRoom(e.target.value)} >
            <option>Meeting Room 1</option>
            <option>Meeting Room 2</option>
            <option>Server Room</option>
            <option>Gym Room</option>
            <option>Cafeteria</option>
          </select>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;