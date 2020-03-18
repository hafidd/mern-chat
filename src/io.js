import socketio from "socket.io-client";
export let io = null;
export const connect = token => (io = socketio.connect(`/?token=${token}`));
export const disconnect = () => io.close();

