import axios from "axios";

const BASE = "http://localhost:9090/auth";

export const login    = (username, password) => axios.post(`${BASE}/login`, { username, password });
export const register = (data)               => axios.post(`${BASE}/register`, data);