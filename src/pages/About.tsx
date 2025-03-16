
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layout/MainLayout';
import { Leaf, BarChart3, MapPin, Recycle, Globe, Users } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.section 
          className="py-16 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.5 }}
            >
              <Leaf className="mr-1 h-4 w-4" />
              Our Mission
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EcoSmartHub</h1>
            <p className="text-xl text-muted-foreground">
              Empowering individuals to make sustainable choices through innovative technology
            </p>
          </motion.div>
          
          <motion.div
            className="prose prose-lg dark:prose-invert mx-auto mb-16"
            variants={itemVariants}
          >
            <p>
              EcoSmartHub was founded with a simple yet powerful vision: to make sustainability accessible, 
              measurable, and actionable for everyone. We believe that small, individual actions, when multiplied 
              across communities, can create meaningful environmental impact.
            </p>
            
            <p>
              Our platform combines cutting-edge AI technology with practical sustainability solutions to help 
              users reduce waste, conserve energy, and make more environmentally friendly choices in their daily lives.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={itemVariants}
          >
            {[
              {
                icon: <Recycle className="h-10 w-10" />,
                title: "Smart Waste Classification",
                description: "Our AI-powered waste classification system helps users properly sort and dispose of recyclables, reducing landfill waste."
              },
              {
                icon: <BarChart3 className="h-10 w-10" />,
                title: "Energy Consumption Insights",
                description: "Track and optimize your energy usage with predictive analytics that help you reduce your carbon footprint and save on utility bills."
              },
              {
                icon: <MapPin className="h-10 w-10" />,
                title: "Local Recycling Network",
                description: "Connect with local recycling centers and schedule convenient pickups for your recyclable materials."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="glass-panel rounded-xl p-6 text-center"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <motion.div 
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-xl p-8 mb-16"
            variants={itemVariants}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
              <p className="text-muted-foreground">Together with our community, we're making a difference</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Recycle />, 
                  value: "2,500+", 
                  label: "Tons of Waste Recycled",
                  color: "text-green-500" 
                },
                { 
                  icon: <Users />, 
                  value: "15,000+", 
                  label: "Active Users",
                  color: "text-blue-500" 
                },
                { 
                  icon: <Globe />, 
                  value: "30%", 
                  label: "Average Carbon Footprint Reduction",
                  color: "text-amber-500" 
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.p 
                    className={`text-4xl font-bold ${stat.color} mb-2`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to be part of the solution? Start your sustainability journey today and see how small changes 
              can make a big difference for our planet.
            </p>
            <motion.a
              href="/register"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </motion.div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default About;
