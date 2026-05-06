import { createContext, useState } from "react";
export const RoomContext = createContext();



export function RoomProvider({ children }) {
  const [room, setRoom] = useState("Meeting Room 1");
  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
}