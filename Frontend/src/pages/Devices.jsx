import { useEffect, useState } from "react";
import { getAllDevices, addDevice, updateDevice, deleteDevice } from "../services/deviceService";
import "../styles/devices.css";

const EMPTY_FORM = { deviceId: "", name: "", type: "", location: "", status: "ACTIVE", registeredAt: "" };


function Devices() {
  const [devices, setDevices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const fetchDevices = () => {
    getAllDevices()
      .then((res) => setDevices(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => { 
    fetchDevices(); 
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await addDevice(formData);
      setSuccess("Device added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setShowForm(false); setFormData(EMPTY_FORM); fetchDevices();
    } catch (err) {
      setError("Failed to add device. Check all fields.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await updateDevice(editingId, formData);
      setSuccess("Device updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); fetchDevices();
    } catch (err) {
      setError("Failed to update device.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm(`Are you sure you want to remove ${deviceId}?`)) return;
    try {
      await deleteDevice(deviceId);
      setSuccess("Device removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchDevices();
    } catch (err) {
      setError("Failed to remove device.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openEditForm = (device) => {
    setFormData({ deviceId: device.deviceId, name: device.name, type: device.type, location: device.location, status: device.status, registeredAt: device.registeredAt || "" });
    setEditingId(device.deviceId); setShowForm(true); setError(""); setSuccess("");
  };

  const openAddForm = () => {
    setFormData(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(""); setSuccess("");
  };

  return (
    <div className="devices-container">
      <div className="devices-top">
        <h2>EnviroSense Devices</h2>
        <button className="add-btn" onClick={openAddForm}>+ Add Device</button>
      </div>

      {success && <div className="dev-success">{success}</div>}
      {error && <div className="dev-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editingId ? "Update Device" : "Add New Device"}</h3>
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="device-form">
              <div className="form-row">
                <label>Device ID</label>
                <input name="deviceId" value={formData.deviceId} onChange={handleChange} placeholder="e.g. DEVICE_020" disabled={!!editingId} required />
              </div>
              <div className="form-row">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Temperature Sensor MR1" required />
              </div>
              <div className="form-row">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">-- Select Type --</option>
                  <option value="temperature_sensor">Temperature Sensor</option>
                  <option value="humidity_sensor">Humidity Sensor</option>
                  <option value="co2_sensor">CO₂ Sensor</option>
                  <option value="light_sensor">Light Sensor</option>
                  <option value="multi_sensor">Multi Sensor</option>
                </select>
              </div>
              <div className="form-row">
                <label>Location</label>
                <select name="location" value={formData.location} onChange={handleChange} required>
                  <option value="">-- Select Room --</option>
                  <option value="Meeting Room 1">Meeting Room 1</option>
                  <option value="Meeting Room 2">Meeting Room 2</option>
                  <option value="Server Room">Server Room</option>
                  <option value="Gym Room">Gym Room</option>
                  <option value="Cafeteria">Cafeteria</option>
                </select>
              </div>
              <div className="form-row">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-btn">{editingId ? "Update" : "Add Device"}</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="devices-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>


        

        <tbody>
          {devices.length===0 ? (
            <tr><td colSpan="7" className="devices-empty">No device Found</td></tr>
          ):(
            devices.map((device)=>(
              <tr key={device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.location}</td>
                <td> <span className={`status-pill ${device.status?.toLowerCase()}`}>{device.status}</span></td>
                <td> <button className="update-button"  onClick={()=>openEditForm(device)}>Update</button></td>
                <td> <button className="remove-button"  onClick={()=>handleDelete(device.deviceId)}>Remove</button></td>
              </tr>
            ))
          ) }
        </tbody>
      </table>
    </div>
  );
}

export default Devices;
