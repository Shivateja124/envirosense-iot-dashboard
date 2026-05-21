import { createContext, useState } from "react";
export const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(localStorage.getItem("selectedRoom") || "Meeting Room 1");

  const handleSetRoom = (newRoom) => {
    localStorage.setItem("selectedRoom", newRoom);
    setRoom(newRoom);
  };

  
  return (
    <RoomContext.Provider value={{ room, setRoom:handleSetRoom }}>
      {children}
    </RoomContext.Provider>
  );
}