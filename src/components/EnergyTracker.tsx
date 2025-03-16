
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Generate mock data for energy consumption
const generateMockData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random consumption with a slight upward trend and some daily variations
    const baseConsumption = 20 + i * 0.5; // Slight increase over time
    const dailyVariation = Math.sin(i * 0.4) * 8; // Sinusoidal variation
    const randomNoise = Math.random() * 10 - 5; // Random noise
    
    let consumption = baseConsumption + dailyVariation + randomNoise;
    consumption = Math.max(consumption, 5); // Ensure positive values
    
    data.push({
      date: date.toISOString().split('T')[0],
      consumption: Math.round(consumption * 10) / 10,
    });
  }
  
  return data;
};

// Generate mock predictions
const generatePredictions = (data: any[]) => {
  const lastValue = data[data.length - 1].consumption;
  const predictions = [];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Generate prediction with slight randomness
    const prediction = lastValue + (Math.random() * 8 - 4) + (i * 0.3);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      prediction: Math.round(prediction * 10) / 10,
    });
  }
  
  return predictions;
};

// Energy-saving tips
const ENERGY_TIPS = [
  {
    tip: "Switch to LED bulbs",
    impact: "High",
    description: "LED bulbs use up to 75% less energy than traditional incandescent bulbs and last 25 times longer."
  },
  {
    tip: "Unplug unused electronics",
    impact: "Medium",
    description: "Even when turned off, many electronics continue to draw power. Unplug them or use power strips."
  },
  {
    tip: "Optimize thermostat settings",
    impact: "High",
    description: "Lower your thermostat by 1°C in winter or raise it by 1°C in summer to save up to 10% on heating/cooling costs."
  },
  {
    tip: "Use smart power strips",
    impact: "Medium",
    description: "Smart power strips can detect when devices are in standby mode and cut power to prevent vampire energy usage."
  },
  {
    tip: "Install a programmable thermostat",
    impact: "High",
    description: "Automatically adjust temperature settings when you're asleep or away to reduce energy consumption."
  }
];

const EnergyTracker: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');
  const [goal, setGoal] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call to get energy data
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const mockData = generateMockData();
        const mockPredictions = generatePredictions(mockData);
        
        setHistoricalData(mockData);
        setPredictions(mockPredictions);
      } catch (error) {
        toast({
          title: "Failed to load energy data",
          description: "There was an error loading your energy consumption data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const getTimeframeData = () => {
    if (selectedTimeframe === 'week') {
      return historicalData.slice(-7);
    }
    return historicalData;
  };
  
  const calculateAverageConsumption = () => {
    const data = getTimeframeData();
    if (data.length === 0) return 0;
    
    const sum = data.reduce((total, entry) => total + entry.consumption, 0);
    return Math.round((sum / data.length) * 10) / 10;
  };
  
  const calculateTrend = () => {
    if (historicalData.length < 14) return 0;
    
    const recentWeek = historicalData.slice(-7);
    const previousWeek = historicalData.slice(-14, -7);
    
    const recentAvg = recentWeek.reduce((sum, entry) => sum + entry.consumption, 0) / 7;
    const previousAvg = previousWeek.reduce((sum, entry) => sum + entry.consumption, 0) / 7;
    
    return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  };
  
  const handleSetGoal = () => {
    const average = calculateAverageConsumption();
    // Set goal to be 10% less than current average
    const newGoal = Math.round(average * 0.9 * 10) / 10;
    setGoal(newGoal);
    
    toast({
      title: "Energy goal set",
      description: `Your new goal is to use less than ${newGoal} kWh per day`
    });
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const avgConsumption = calculateAverageConsumption();
  const trend = calculateTrend();
  
  const getRandomTips = (count: number) => {
    const shuffled = [...ENERGY_TIPS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Energy Consumption Tracker</h2>
        <p className="text-muted-foreground">Monitor your energy usage and get personalized recommendations</p>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your energy data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mr-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium">Average Usage</h3>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{avgConsumption}</span>
                <span className="text-muted-foreground ml-2">kWh/day</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Based on your {selectedTimeframe === 'week' ? 'past week' : 'past month'}
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary mr-3">
                  {trend < 0 ? 
                    <TrendingDown className="h-5 w-5" /> : 
                    <TrendingUp className="h-5 w-5" />
                  }
                </div>
                <h3 className="text-lg font-medium">Trend</h3>
              </div>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${trend < 0 ? 'text-green-500' : 'text-amber-500'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Compared to previous week
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/30 text-accent-foreground mr-3">
                  {goal ? <Lightbulb className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-medium">Energy Goal</h3>
              </div>
              {goal ? (
                <>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{goal}</span>
                    <span className="text-muted-foreground ml-2">kWh/day</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-muted rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${avgConsumption <= goal ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, (avgConsumption / goal) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {avgConsumption <= goal ? 
                        `${Math.round((1 - avgConsumption / goal) * 100)}% below goal` : 
                        `${Math.round((avgConsumption / goal - 1) * 100)}% above goal`
                      }
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">No energy goal set</p>
                  <button
                    onClick={handleSetGoal}
                    className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Set Goal
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Energy Consumption</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTimeframe('week')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedTimeframe === 'week' ? 
                    'bg-primary text-primary-foreground' : 
                    'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedTimeframe('month')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedTimeframe === 'month' ? 
                    'bg-primary text-primary-foreground' : 
                    'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[...getTimeframeData(), ...predictions]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <YAxis 
                    unit=" kWh"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} kWh`, 'Consumption']}
                    labelFormatter={(label) => formatDate(label)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '0.5rem',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorConsumption)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 1 }}
                    activeDot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 0 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="prediction" 
                    stroke="hsl(var(--secondary))" 
                    fillOpacity={1}
                    fill="url(#colorPrediction)" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: 'hsl(var(--secondary))', r: 1 }}
                    activeDot={{ fill: 'hsl(var(--secondary))', r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center mt-4 justify-end">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                <span className="text-xs text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                <span className="text-xs text-muted-foreground">Predicted</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-medium mb-6">Energy-Saving Recommendations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getRandomTips(4).map((tip, index) => (
                <div key={index} className="bg-card rounded-lg p-4 shadow-sm border">
                  <div className="flex items-start">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 ${
                      tip.impact === 'High' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{tip.tip}</h4>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          tip.impact === 'High' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {tip.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnergyTracker;
