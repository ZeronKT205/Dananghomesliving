import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = process.argv[2];
const OUT = process.argv[3];
const PRECISION = 5; // ~1.1 m — thừa đủ cho ranh giới phường trên bản đồ
const TOLERANCE = Number(process.argv[4] ?? 0.0001); // độ; 0.0001 ~ 11 m

// Douglas-Peucker: bỏ các điểm nằm gần như trên đoạn thẳng nối 2 đầu.
function simplify(points, tol) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const denom = dx * dx + dy * dy;

  let maxDist = -1;
  let idx = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    // Khoảng cách vuông góc từ điểm tới đoạn AB (denom === 0 => A trùng B).
    const dist =
      denom === 0
        ? Math.hypot(px - ax, py - ay)
        : Math.abs(dy * px - dx * py + bx * ay - by * ax) / Math.sqrt(denom);
    if (dist > maxDist) {
      maxDist = dist;
      idx = i;
    }
  }

  if (maxDist <= tol) return [points[0], points[points.length - 1]];
  return [
    ...simplify(points.slice(0, idx + 1), tol).slice(0, -1),
    ...simplify(points.slice(idx), tol),
  ];
}

const raw = readFileSync(SRC, 'utf8');
const geo = JSON.parse(raw);

const round = (n) => Number(n.toFixed(PRECISION));

// Bỏ các điểm trùng nhau sau khi làm tròn (đoạn dài 0), nhưng giữ ring khép kín
// và tối thiểu 4 điểm để polygon vẫn hợp lệ.
function slimRing(rawRing) {
  const ring = simplify(rawRing, TOLERANCE);
  const out = [];
  for (const pt of ring) {
    const p = [round(pt[0]), round(pt[1])];
    const prev = out[out.length - 1];
    if (!prev || prev[0] !== p[0] || prev[1] !== p[1]) out.push(p);
  }
  const first = out[0];
  const last = out[out.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) out.push([...first]);
  return out.length >= 4 ? out : ring.map((pt) => [round(pt[0]), round(pt[1])]);
}

const slimPolygon = (poly) => poly.map(slimRing);

function slimGeometry(g) {
  if (g.type === 'MultiPolygon') return { type: g.type, coordinates: g.coordinates.map(slimPolygon) };
  if (g.type === 'Polygon') return { type: g.type, coordinates: slimPolygon(g.coordinates) };
  return g;
}

const slim = {
  type: 'FeatureCollection',
  features: geo.features.map((f) => ({
    type: 'Feature',
    // admin-map.tsx chỉ đọc `ten_xa`; 11 trường còn lại là dead weight.
    properties: { ten_xa: f.properties?.ten_xa ?? '' },
    geometry: slimGeometry(f.geometry),
  })),
};

mkdirSync(dirname(OUT), { recursive: true });
const outStr = JSON.stringify(slim);
writeFileSync(OUT, outStr);

const countPts = (o) =>
  o.features.reduce((n, f) => {
    const c = f.geometry.coordinates;
    const walk = (a) => (typeof a[0] === 'number' ? 1 : a.reduce((s, x) => s + walk(x), 0));
    return n + walk(c);
  }, 0);

console.log(`features : ${geo.features.length} -> ${slim.features.length}`);
console.log(`points   : ${countPts(geo)} -> ${countPts(slim)}`);
console.log(`size     : ${(raw.length / 1024 / 1024).toFixed(2)} MB -> ${(outStr.length / 1024 / 1024).toFixed(2)} MB`);
