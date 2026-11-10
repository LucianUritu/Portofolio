// A small, connected transit graph for the portfolio playground, not live transit data.
export const routeStops = [
  ['A', 12, 20], ['B', 36, 20], ['C', 62, 20], ['D', 88, 20],
  ['E', 12, 50], ['F', 36, 50], ['G', 62, 50], ['H', 88, 50],
  ['I', 12, 80], ['J', 36, 80], ['K', 62, 80], ['L', 88, 80]
].map(([id, x, y]) => ({ id, x, y }));

export const routeConnections = [
  ['A','B'], ['B','C'], ['C','D'], ['E','F'], ['F','G'], ['G','H'],
  ['I','J'], ['J','K'], ['K','L'], ['A','E'], ['E','I'], ['B','F'],
  ['F','J'], ['C','G'], ['G','K'], ['D','H'], ['H','L'], ['E','J'], ['F','K']
];

export function findRoute(start, destination) {
  const stops = new Map(routeStops.map(stop => [stop.id, stop]));
  if (!stops.has(start) || !stops.has(destination)) return null;
  const distances = new Map(routeStops.map(stop => [stop.id, Infinity]));
  const previous = new Map();
  const pending = new Set(stops.keys());
  distances.set(start, 0);
  while (pending.size) {
    const current = [...pending].reduce((best, id) => distances.get(id) < distances.get(best) ? id : best);
    if (!Number.isFinite(distances.get(current))) return null;
    pending.delete(current);
    if (current === destination) break;
    for (const [a, b] of routeConnections) {
      const neighbor = a === current ? b : b === current ? a : null;
      if (!neighbor || !pending.has(neighbor)) continue;
      const from = stops.get(current);
      const to = stops.get(neighbor);
      const distance = distances.get(current) + Math.hypot(to.x - from.x, to.y - from.y);
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previous.set(neighbor, current);
      }
    }
  }
  const path = [destination];
  while (path[0] !== start) path.unshift(previous.get(path[0]));
  return { stops: path.map(id => stops.get(id)), distance: distances.get(destination) };
}
