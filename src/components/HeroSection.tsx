
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, BarChart3, Map, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-accent/20 pb-16 pt-24 md:pt-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>
      
      {/* Animated eco elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 text-primary/5"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
              scale: 0.5 + Math.random() * 1.5
            }}
            animate={{ 
              y: [0, -100, 0], 
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10 + Math.random() * 20,
              ease: "linear"
            }}
          >
            <Leaf className="w-full h-full" />
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
              <Leaf className="mr-1 h-4 w-4" />
              AI-Powered Sustainability
            </span>
          </motion.div>
          
          <motion.h1 
            className="font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Intelligent solutions for a 
            <span className="text-primary"> greener future</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            EcoSmartHub combines AI-powered waste classification, energy consumption tracking, and smart waste management to help you make more sustainable choices every day.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/classify"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Find Recycling Centers
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Waste Classification</h3>
            <p className="text-muted-foreground">Use AI to identify and properly dispose of different types of waste</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Energy Tracking</h3>
            <p className="text-muted-foreground">Monitor and optimize your energy consumption with predictive insights</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/30 text-accent-foreground mb-4">
              <Map className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">Recycling Centers</h3>
            <p className="text-muted-foreground">Locate nearby recycling centers and schedule pickups for your recyclables</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
