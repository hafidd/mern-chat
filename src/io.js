import socketio from "socket.io-client";
export let io = null;
export const connect = token => (io = socketio(`/?token=${token}`, { transports: ["websocket"] }));
export const disconnect = () => io.close();

