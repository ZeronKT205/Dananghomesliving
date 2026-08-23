import { writeFileSync } from 'fs';

async function run() {
  console.log("Fetching Da Nang boundary from Nominatim...");
  // Use user-agent as required by Nominatim
  const response = await fetch('https://nominatim.openstreetmap.org/search.php?q=Đà+Nẵng+Vietnam&polygon_geojson=1&format=json', {
    headers: {
      'User-Agent': 'RealEstateApp/1.0 (test@example.com)'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  
  const data = await response.json();
  if (data && data.length > 0 && data[0].geojson) {
    writeFileSync('public/geo/danang-outline.json', JSON.stringify(data[0].geojson));
    console.log("Saved Da Nang boundary to public/geo/danang-outline.json");
  } else {
    console.log("No geojson found in response.");
  }
}

run().catch(console.error);
