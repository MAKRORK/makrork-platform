// Prepared for the future collaborative editor. No connection is opened yet.
export function connectToRoom(roomId: string): WebSocket {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = new URL(`/ws/rooms/${encodeURIComponent(roomId)}`, `${protocol}//${window.location.host}`);
  return new WebSocket(url);
}
