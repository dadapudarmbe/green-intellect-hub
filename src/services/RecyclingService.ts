
/**
 * Service for handling recycling location searches using OpenStreetMap APIs
 */

// Interface for geocoded location results
export interface GeocodedLocation {
  lat: number;
  lon: number;
  displayName: string;
}

// Interface for recycling center results
export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  lat: number;
  lon: number;
  materials?: string[];
  hours?: string;
  phone?: string;
}

/**
 * Convert a location name to latitude and longitude using Nominatim API
 */
export const geocodeLocation = async (locationName: string): Promise<GeocodedLocation | null> => {
  try {
    const encodedLocation = encodeURIComponent(locationName);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'EcoSmartHub/1.0',
        },
      }
    );

    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw new Error('Failed to geocode location');
  }
};

/**
 * Find recycling centers using Overpass API (OpenStreetMap)
 */
export const findRecyclingCenters = async (lat: number, lon: number, radius: number = 10000): Promise<RecyclingCenter[]> => {
  try {
    // Overpass query to find recycling centers, facilities, and containers
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="recycling"](around:${radius},${lat},${lon});
        way["amenity"="recycling"](around:${radius},${lat},${lon});
        relation["amenity"="recycling"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'EcoSmartHub/1.0',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const data = await response.json();
    
    // Process and transform the OSM data
    if (data && data.elements) {
      return data.elements
        .filter((element: any) => element.type === 'node' || element.type === 'way')
        .map((element: any) => {
          // Calculate distance (simple haversine)
          const centerLat = element.lat || (element.center && element.center.lat);
          const centerLon = element.lon || (element.center && element.center.lon);
          
          const distance = centerLat && centerLon 
            ? calculateDistance(lat, lon, centerLat, centerLon) 
            : 999;
            
          // Extract the address
          const tags = element.tags || {};
          const address = [
            tags.housenumber,
            tags.street,
            tags.city,
            tags.postcode,
          ].filter(Boolean).join(', ');
          
          // Extract materials accepted if available
          const materials: string[] = [];
          Object.entries(tags).forEach(([key, value]) => {
            if (key.startsWith('recycling:') && value === 'yes') {
              materials.push(key.replace('recycling:', ''));
            }
          });
          
          return {
            id: element.id.toString(),
            name: tags.name || 'Unnamed Recycling Center',
            address: address || 'Address unavailable',
            distance: parseFloat(distance.toFixed(1)),
            lat: centerLat,
            lon: centerLon,
            materials: materials.length > 0 ? materials.map(formatMaterialName) : undefined,
            hours: tags.opening_hours,
            phone: tags.phone,
          };
        })
        .sort((a: RecyclingCenter, b: RecyclingCenter) => a.distance - b.distance)
        .slice(0, 15); // Limit to 15 results
    }
    
    return [];
  } catch (error) {
    console.error('Error finding recycling centers:', error);
    throw new Error('Failed to find recycling centers');
  }
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

function formatMaterialName(material: string): string {
  return material
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
