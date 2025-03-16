
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, CalendarRange, Clock, Phone, ArrowRight, Building, CircleCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  materials: string[];
  hours: string;
  phone: string;
}

// Mock data for recycling centers
const MOCK_CENTERS: RecyclingCenter[] = [
  {
    id: "rc1",
    name: "GreenCycle Community Center",
    address: "123 Recycling Way, Ecoville",
    distance: 1.2,
    materials: ["Paper", "Plastic", "Glass", "Metal"],
    hours: "Mon-Sat: 8AM-6PM, Sun: 10AM-4PM",
    phone: "(555) 123-4567"
  },
  {
    id: "rc2",
    name: "EcoWaste Solutions",
    address: "456 Sustainability Ave, Greentown",
    distance: 2.7,
    materials: ["Paper", "Plastic", "Electronics", "Hazardous Waste"],
    hours: "Mon-Fri: 7AM-7PM, Sat: 9AM-5PM",
    phone: "(555) 234-5678"
  },
  {
    id: "rc3",
    name: "Urban Recyclers Co-op",
    address: "789 Environmental Blvd, Ecoville",
    distance: 3.5,
    materials: ["Paper", "Glass", "Metal", "Textiles"],
    hours: "Mon-Sun: 24 hours (Dropoff)",
    phone: "(555) 345-6789"
  },
  {
    id: "rc4",
    name: "Metro Waste Management",
    address: "101 Reclaim Street, Greentown",
    distance: 4.8,
    materials: ["All materials", "Construction Debris", "Large Items"],
    hours: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM",
    phone: "(555) 456-7890"
  },
  {
    id: "rc5",
    name: "Neighborhood Recycling Hub",
    address: "202 Conservation Lane, Ecoville",
    distance: 5.2,
    materials: ["Paper", "Plastic", "Glass", "Compost"],
    hours: "Mon-Sat: 10AM-6PM",
    phone: "(555) 567-8901"
  }
];

const RecyclingMap: React.FC = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPickupScheduled, setIsPickupScheduled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMaterial, setFilterMaterial] = useState<string>('All');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get recycling centers
    const fetchCenters = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCenters(MOCK_CENTERS);
      } catch (error) {
        toast({
          title: "Failed to load recycling centers",
          description: "There was an error loading the recycling centers data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCenters();
  }, [toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search with the query
    toast({
      title: "Location search",
      description: `Searching for recycling centers near "${searchQuery}"`,
    });
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

  const filteredCenters = centers.filter(center => {
    // Filter by search query (if any)
    const matchesSearch = 
      searchQuery === '' || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by material (if not "All")
    const matchesMaterial = 
      filterMaterial === 'All' || 
      center.materials.includes(filterMaterial);
    
    return matchesSearch && matchesMaterial;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Recycling Centers</h2>
        <p className="text-muted-foreground">Find nearby recycling centers and schedule pickups for your recyclables</p>
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
              <label htmlFor="location-search" className="block text-sm font-medium mb-2">Find Centers Near You</label>
              <div className="relative">
                <input
                  id="location-search"
                  type="text"
                  placeholder="Enter location or zip code"
                  className="w-full px-4 py-2 pr-10 rounded-lg border bg-card text-card-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            
            <div className="mb-6">
              <label htmlFor="material-filter" className="block text-sm font-medium mb-2">Filter by Material</label>
              <select
                id="material-filter"
                className="w-full px-4 py-2 rounded-lg border bg-card text-card-foreground"
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
              >
                <option value="All">All Materials</option>
                <option value="Paper">Paper</option>
                <option value="Plastic">Plastic</option>
                <option value="Glass">Glass</option>
                <option value="Metal">Metal</option>
                <option value="Electronics">Electronics</option>
                <option value="Hazardous Waste">Hazardous Waste</option>
                <option value="Textiles">Textiles</option>
                <option value="Compost">Compost</option>
              </select>
            </div>
            
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
                  
                  <button
                    onClick={handleSchedulePickup}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Schedule Pickup</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
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
            ) : filteredCenters.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No centers found</h4>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
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
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground mr-3 mt-1">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{center.name}</h4>
                            <p className="text-sm text-muted-foreground">{center.address}</p>
                          </div>
                          <span className="text-sm font-medium text-primary ml-2 whitespace-nowrap">
                            {center.distance} mi
                          </span>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {center.materials.slice(0, 3).map((material, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-0.5 rounded-full bg-muted"
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
                        
                        <div className="mt-3 flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="truncate">{center.hours}</span>
                        </div>
                        
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{center.phone}</span>
                        </div>
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
