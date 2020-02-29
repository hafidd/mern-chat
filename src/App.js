import React, { useEffect } from "react";
import io from "socket.io-client";

let socket;

function App() {
  useEffect(()=>{
    // socketio connect
    socket = io("http://192.168.43.65:5001");
  },[]);

  return <h1>Hey</h1>;
}

export default App;
