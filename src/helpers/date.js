export function formatDate(date) {
  const d = new Date(date);
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(date) {
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes()}`;
}
