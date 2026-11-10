import test from 'node:test';
import assert from 'node:assert/strict';
import { routeStops, routeConnections, findRoute } from '../scripts/utils/routePlanner.js';

test('unknown stops return no route', () => {
  assert.equal(findRoute('unknown', 'A'), null);
  assert.equal(findRoute('A', 'unknown'), null);
});

test('a stop to itself needs no connections', () => {
  const route = findRoute('F', 'F');
  assert.deepEqual(route.stops.map(stop => stop.id), ['F']);
  assert.equal(route.distance, 0);
});

test('every pair has a valid shortest route, independently verified with Floyd–Warshall', () => {
  const ids = routeStops.map(stop => stop.id);
  const distances = routeStops.map((_, i) => routeStops.map((_, j) => i === j ? 0 : Infinity));
  for (const [a, b] of routeConnections) {
    const i = ids.indexOf(a), j = ids.indexOf(b);
    const length = Math.hypot(routeStops[i].x - routeStops[j].x, routeStops[i].y - routeStops[j].y);
    distances[i][j] = distances[j][i] = length;
  }
  for (let k=0; k<ids.length; k++) for (let i=0; i<ids.length; i++) for (let j=0; j<ids.length; j++) {
    distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j]);
  }
  for (let i=0; i<ids.length; i++) for (let j=0; j<ids.length; j++) {
    const route = findRoute(ids[i], ids[j]);
    assert.equal(route.stops[0].id, ids[i]);
    assert.equal(route.stops.at(-1).id, ids[j]);
    assert.ok(Math.abs(route.distance - distances[i][j]) < 1e-8);
    for (let n=1; n<route.stops.length; n++) {
      assert.ok(routeConnections.some(([a,b]) => a === route.stops[n-1].id && b === route.stops[n].id || b === route.stops[n-1].id && a === route.stops[n].id));
    }
  }
});
