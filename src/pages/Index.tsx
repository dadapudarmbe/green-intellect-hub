
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Zap, MapPin } from 'lucide-react';
import MainLayout from '@/layout/MainLayout';
import FeatureCard from '@/components/FeatureCard';

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EcoSmartHub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              An AI-powered sustainability platform that makes eco-friendly living simple and efficient
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/waste-classifier"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Waste Classification
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Sustainable Living Made Easy
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover how our AI-powered tools can help you reduce waste, save energy, and make a positive impact on the environment
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Waste Classification"
              description="Identify recyclable materials with AI. Simply take a photo and our system will classify the waste and provide recycling guidance."
              icon={<Trash2 className="h-6 w-6" />}
              to="/waste-classifier"
              delay={1}
            />
            <FeatureCard
              title="Energy Consumption Tracker"
              description="Monitor and predict your energy usage with smart analytics. Get personalized tips to reduce consumption and save money."
              icon={<Zap className="h-6 w-6" />}
              to="/energy-tracker"
              delay={2}
            />
            <FeatureCard
              title="Recycling Centers Map"
              description="Find nearby recycling centers and schedule pickups for your recyclable materials, making proper disposal easy and convenient."
              icon={<MapPin className="h-6 w-6" />}
              to="/recycling-map"
              delay={3}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="glass-panel rounded-xl p-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Making a Difference Together</h2>
              <p className="text-muted-foreground">Join thousands of eco-conscious individuals using EcoSmartHub</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-4xl font-bold text-primary mb-2">2,500+</p>
                <p className="text-muted-foreground">Tons of Waste Recycled</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-4xl font-bold text-primary mb-2">15,000+</p>
                <p className="text-muted-foreground">Active Users</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-4xl font-bold text-primary mb-2">30%</p>
                <p className="text-muted-foreground">Average Energy Savings</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Sustainability Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community and make a positive impact on the environment with EcoSmartHub's intelligent tools
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              Get Started Now
            </Link>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
