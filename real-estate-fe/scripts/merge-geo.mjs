import { readFileSync, writeFileSync } from 'fs';
import { union, featureCollection } from '@turf/turf';

function run() {
  const geojson = JSON.parse(readFileSync('public/geo/danang-wards.json', 'utf8'));
  let merged = null;
  
  console.log("Merging " + geojson.features.length + " features...");
  
  for (const feature of geojson.features) {
    if (merged === null) {
      merged = feature;
    } else {
      try {
        merged = union(featureCollection([merged, feature]));
      } catch (e) {
        console.error("Error merging feature:", e.message);
      }
    }
  }
  
  if (merged) {
    writeFileSync('public/geo/danang-outline.json', JSON.stringify(merged));
    console.log("Successfully created public/geo/danang-outline.json");
  }
}

run();
