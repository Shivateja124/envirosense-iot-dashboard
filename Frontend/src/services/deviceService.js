import API from "./api";


export const getAllDevices  = ()           => API.get("/devices");
export const addDevice     = (data)        => API.post("/devices", data);
export const updateDevice  = (id, data)    => API.put(`/devices/${id}`, data);
export const deleteDevice  = (id)          => API.delete(`/devices/${id}`);