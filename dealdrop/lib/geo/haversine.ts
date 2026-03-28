export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) { return deg * (Math.PI / 180); }

export function walkTimeMins(distanceKm: number): number {
  // Average walking speed: 5 km/h
  return Math.round((distanceKm / 5) * 60);
}

export function driveTimeMins(distanceKm: number): number {
  // Average city driving: 20 km/h
  return Math.round((distanceKm / 20) * 60);
}
