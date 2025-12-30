function toRad(value) {
  return (value * Math.PI) / 180;
}

// Fórmula de Haversine
export function calculateDistanceKm(points = []) {
  if (points.length < 2) return 0;

  let distance = 0;
  const R = 6371; // raio da Terra em km

  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];

    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lon - p1.lon);

    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    distance += R * c;
  }

  return distance;
}
