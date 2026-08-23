import { readFileSync, writeFileSync } from 'fs';
import { dissolve, flatten, buffer, area } from '@turf/turf';

function run() {
  const geojson = JSON.parse(readFileSync('public/geo/danang-wards.json', 'utf8'));
  
  console.log("Flattening...");
  const flattened = flatten(geojson);
  
  console.log("Buffering outward to close gaps...");
  // 50 meters buffer (0.05 km)
  const bufferedOut = buffer(flattened, 0.05, { units: 'kilometers' });
  
  console.log("Dissolving into single shape...");
  let dissolved = dissolve(bufferedOut);
  
  // Filter out tiny sliver holes that might have survived or tiny disconnected islands (keep only the biggest one)
  dissolved = flatten(dissolved);
  
  // Find the largest polygon by area (or just keep the first one if it's the main city)
  let maxArea = 0;
  let mainFeature = null;
  const turfArea = area;
  for (const feat of dissolved.features) {
    const a = turfArea(feat);
    if (a > maxArea) {
      maxArea = a;
      mainFeature = feat;
    }
  }
  
  console.log("Buffering inward to restore original size...");
  // -50 meters buffer
  const finalPoly = buffer(mainFeature, -0.05, { units: 'kilometers' });
  
  const result = {
    type: "FeatureCollection",
    features: [finalPoly]
  };
  
  writeFileSync('public/geo/danang-outline.json', JSON.stringify(result));
  console.log("Successfully created clean public/geo/danang-outline.json");
}

run();
