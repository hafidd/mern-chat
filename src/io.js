import socketio from "socket.io-client";
export let io = null;
export function connect(token) {
  console.log(`connecting socket`);
  io = socketio.connect(`/?token=${token}`);
}
export function disconnect() {
  console.log(`close socket`);
  io.close();
}


