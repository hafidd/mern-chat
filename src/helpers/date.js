export function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString("default", { month: "short" }).toUpperCase()}`;
}

export function formatTime(date) {
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes()}`;
}
