import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MapPin, Search, CalendarRange, Clock, Phone, ArrowRight, Building, CircleCheck, Map, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { geocodeLocation, findRecyclingCenters, findRecyclingCentersByMaterial, type RecyclingCenter } from '@/services/RecyclingService';

interface LocationState {
  searchLocation?: string;
  wasteType?: string;
}

const RecyclingMap: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPickupScheduled, setIsPickupScheduled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMaterial, setFilterMaterial] = useState<string>('All');
  const [locationName, setLocationName] = useState<string>(state?.searchLocation || '');
  const [wasteType, setWasteType] = useState<string>(state?.wasteType || '');
  const [geocodedLocation, setGeocodedLocation] = useState<{ lat: number; lon: number; displayName: string } | null>(null);
  const { toast } = useToast();

  // Auto-search if location and waste type are provided via state
  useEffect(() => {
    if (state?.searchLocation) {
      handleSearch({
        preventDefault: () => {},
      } as React.FormEvent);
    }
  }, [state?.searchLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationName.trim()) {
      toast({
        title: "Please enter a location",
        description: "Enter a city or place name to find recycling centers",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setGeocodedLocation(null);
    setCenters([]);
    
    try {
      // Step 1: Convert location name to coordinates
      const location = await geocodeLocation(locationName);
      
      if (!location) {
        toast({
          title: "Location not found",
          description: "We couldn't find that location. Please try a different search term.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      setGeocodedLocation(location);
      
      // Step 2: Find recycling centers near these coordinates
      // If waste type is provided, filter centers that accept this type
      let recyclingCenters;
      
      if (wasteType) {
        recyclingCenters = await findRecyclingCentersByMaterial(location.lat, location.lon, wasteType);
        setFilterMaterial(wasteType);
      } else {
        recyclingCenters = await findRecyclingCenters(location.lat, location.lon);
      }
      
      if (recyclingCenters.length === 0) {
        toast({
          title: "No recycling centers found",
          description: wasteType 
            ? `We couldn't find any recycling centers near ${location.displayName} that accept ${wasteType}`
            : `We couldn't find any recycling centers near ${location.displayName}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Recycling centers found",
          description: wasteType
            ? `Found ${recyclingCenters.length} recycling centers near ${location.displayName} that may accept ${wasteType}`
            : `Found ${recyclingCenters.length} recycling centers near ${location.displayName}`,
        });
        setCenters(recyclingCenters);
      }
    } catch (error) {
      console.error("Error searching for recycling centers:", error);
      toast({
        title: "Search failed",
        description: "There was an error searching for recycling centers. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedulePickup = () => {
    if (!selectedCenter) return;
    
    // Simulate scheduling a pickup
    setIsPickupScheduled(true);
    
    toast({
      title: "Pickup Scheduled",
      description: `Your pickup has been scheduled with ${selectedCenter.name}`,
    });
  };

  const handleViewOnMap = (center: RecyclingCenter) => {
    const mapUrl = `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lon}#map=17/${center.lat}/${center.lon}`;
    window.open(mapUrl, '_blank');
  };

  const filteredCenters = centers.filter(center => {
    // Filter by search query (if any)
    const matchesSearch = 
      searchQuery === '' || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (center.address && center.address.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by material (if not "All")
    const matchesMaterial = 
      filterMaterial === 'All' || 
      (center.materials && center.materials.some(m => 
        m.toLowerCase().includes(filterMaterial.toLowerCase())
      ));
    
    return matchesSearch && matchesMaterial;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Recycling Centers</h2>
        <p className="text-muted-foreground">
          {wasteType ? `Find nearby recycling centers accepting ${wasteType} waste` : 'Find nearby recycling centers and schedule pickups for your recyclables'}
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <Label htmlFor="location-search" className="block text-sm font-medium mb-2">Find Centers Near You</Label>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id="location-search"
                    type="text"
                    placeholder="Enter city or place name"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pr-10"
                  />
                </div>
                
                {wasteType && (
                  <div className="mb-4">
                    <Label htmlFor="waste-type" className="block text-sm font-medium mb-2">Material Type</Label>
                    <div className="px-3 py-2 bg-primary/10 rounded-lg text-sm font-medium">
                      {wasteType}
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Searching</span>
                      <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      <span>Find Recycling Centers</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            {geocodedLocation && (
              <motion.div 
                className="mb-6 p-3 bg-muted rounded-lg text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-medium mb-1">Search Location:</p>
                <p className="text-muted-foreground">{geocodedLocation.displayName}</p>
              </motion.div>
            )}
            
            {centers.length > 0 && (
              <div className="mb-6">
                <label htmlFor="center-search" className="block text-sm font-medium mb-2">Filter Results</label>
                <div className="relative">
                  <Input
                    id="center-search"
                    type="text"
                    placeholder="Search by name or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground mb-2">Tips for Recycling:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="block min-w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                  <span>Always clean items before recycling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="block min-w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                  <span>Remove lids and caps from containers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="block min-w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                  <span>Flatten cardboard boxes to save space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="block min-w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                  <span>Check local guidelines for accepted materials</span>
                </li>
              </ul>
            </div>
          </div>
          
          {selectedCenter && (
            <motion.div 
              className="glass-panel rounded-xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Schedule a Pickup</h3>
              
              {isPickupScheduled ? (
                <div className="text-center py-4">
                  <CircleCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-medium text-lg mb-2">Pickup Scheduled!</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your pickup has been scheduled with {selectedCenter.name}
                  </p>
                  <button
                    onClick={() => setIsPickupScheduled(false)}
                    className="text-sm px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    Schedule Another
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Selected Center</label>
                    <div className="px-3 py-2 bg-muted rounded-lg text-sm">
                      {selectedCenter.name}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="pickup-date" className="block text-sm font-medium mb-2">Pickup Date</label>
                    <div className="relative">
                      <input
                        id="pickup-date"
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border bg-card text-card-foreground"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <CalendarRange className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="pickup-time" className="block text-sm font-medium mb-2">Preferred Time</label>
                    <div className="relative">
                      <select
                        id="pickup-time"
                        className="w-full px-4 py-2 rounded-lg border bg-card text-card-foreground appearance-none"
                      >
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 8PM)</option>
                      </select>
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSchedulePickup}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <span>Schedule Pickup</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-panel rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Nearby Recycling Centers</h3>
              <span className="text-sm text-muted-foreground">
                {filteredCenters.length} centers found
              </span>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Searching for recycling centers...</p>
                </div>
              </div>
            ) : geocodedLocation && filteredCenters.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No centers found</h4>
                  <p className="text-muted-foreground">Try searching for a different location or adjusting your filters</p>
                </div>
              </div>
            ) : !geocodedLocation ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <Map className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Find Recycling Centers</h4>
                  <p className="text-muted-foreground">Enter a city or place name to search for nearby recycling centers</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 scrollbar-none">
                {filteredCenters.map((center, index) => (
                  <motion.div
                    key={center.id}
                    className={`bg-card rounded-lg p-4 border cursor-pointer transition-all ${
                      selectedCenter?.id === center.id ? 'ring-2 ring-primary' : 'hover:bg-card/80'
                    }`}
                    onClick={() => setSelectedCenter(center)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground mr-3 mt-1 shrink-0">
                          <Building className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h4 className="font-medium truncate">{center.name}</h4>
                              <p className="text-sm text-muted-foreground truncate">{center.address}</p>
                            </div>
                          </div>
                          
                          {center.materials && center.materials.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {center.materials.slice(0, 3).map((material, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    wasteType && material.toLowerCase().includes(wasteType.toLowerCase())
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : 'bg-muted'
                                  }`}
                                >
                                  {material}
                                </span>
                              ))}
                              {center.materials.length > 3 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                  +{center.materials.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {center.hours && (
                            <div className="mt-3 flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1 shrink-0" />
                              <span className="truncate">{center.hours}</span>
                            </div>
                          )}
                          
                          {center.phone && (
                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1 shrink-0" />
                              <span>{center.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end ml-3 shrink-0">
                        <span className="text-sm font-medium text-primary whitespace-nowrap mb-2">
                          {center.distance} km
                        </span>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOnMap(center);
                          }}
                        >
                          <Map className="h-3 w-3" />
                          <span>View on Map</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecyclingMap;
