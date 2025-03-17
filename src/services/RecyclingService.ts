
/**
 * Service for handling recycling location searches using OpenStreetMap APIs
 */

// Interface for geocoded location results
export interface GeocodedLocation {
  lat: number;
  lon: number;
  displayName: string;
  boundingBox?: [string, string, string, string];
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
 * Returns bounding box information for broader region searches
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
      const boundingBox = data[0].boundingbox as string[];
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        boundingBox: boundingBox || undefined,
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
 * Uses a broader search radius or bounding box for more comprehensive results
 */
export const findRecyclingCenters = async (
  lat: number, 
  lon: number, 
  radius: number = 10000,
  boundingBox?: [string, string, string, string]
): Promise<RecyclingCenter[]> => {
  try {
    // Create an Overpass query based on bounding box if available, otherwise use radius
    let overpassQuery;
    
    if (boundingBox) {
      // Use the bounding box for a broader search of the entire region
      const [south, north, west, east] = boundingBox;
      overpassQuery = `
        [out:json];
        (
          node["amenity"="recycling"](${south},${west},${north},${east});
          way["amenity"="recycling"](${south},${west},${north},${east});
          relation["amenity"="recycling"](${south},${west},${north},${east});
        );
        out body;
        >;
        out skel qt;
      `;
    } else {
      // Fallback to radius-based search with larger radius
      const searchRadius = radius * 2; // Double the radius for broader coverage
      overpassQuery = `
        [out:json];
        (
          node["amenity"="recycling"](around:${searchRadius},${lat},${lon});
          way["amenity"="recycling"](around:${searchRadius},${lat},${lon});
          relation["amenity"="recycling"](around:${searchRadius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;
    }

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
        .slice(0, 30); // Increased limit to 30 results for broader coverage
    }
    
    return [];
  } catch (error) {
    console.error('Error finding recycling centers:', error);
    throw new Error('Failed to find recycling centers');
  }
};

/**
 * Find recycling centers that accept a specific material
 * Uses broader region search with bounding box when available
 */
export const findRecyclingCentersByMaterial = async (
  lat: number, 
  lon: number, 
  materialType: string, 
  radius: number = 10000,
  boundingBox?: [string, string, string, string]
): Promise<RecyclingCenter[]> => {
  try {
    // First, normalize the material type to match OSM tags
    const normalizedMaterial = normalizeMaterialType(materialType);
    
    // Get all recycling centers with broader region search
    const allCenters = await findRecyclingCenters(lat, lon, radius, boundingBox);
    
    // Filter centers that accept the specified material
    if (normalizedMaterial === 'any') {
      return allCenters;
    }
    
    return allCenters.filter(center => {
      if (!center.materials || center.materials.length === 0) {
        // If no materials are specified, assume it accepts common materials
        return true;
      }
      
      return center.materials.some(material => 
        material.toLowerCase().includes(normalizedMaterial.toLowerCase())
      );
    });
  } catch (error) {
    console.error(`Error finding recycling centers for ${materialType}:`, error);
    throw new Error(`Failed to find recycling centers for ${materialType}`);
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

// Normalize waste category to OSM recycling tag
function normalizeMaterialType(category: string): string {
  // Convert waste category to OSM recycling tag
  const mappings: Record<string, string> = {
    'Plastic': 'plastic',
    'Paper': 'paper',
    'Glass': 'glass',
    'Cardboard': 'cardboard',
    'Metal': 'scrap_metal',
    'Organic': 'organic',
    'Battery': 'batteries',
    'Electronics': 'electronic',
    'Textile': 'clothes',
    'Wood': 'wood',
    // Add more mappings as needed
  };
  
  return mappings[category] || category.toLowerCase();
}
