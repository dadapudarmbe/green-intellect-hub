import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCcw, Loader2, CheckCircle2, Trash2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import MainLayout from '@/layout/MainLayout';

interface ClassificationResult {
  category: string;
  confidence: number;
  tips: string;
}

const MOCK_RESULTS: Record<string, ClassificationResult> = {
  plastic: {
    category: 'Plastic',
    confidence: 92,
    tips: 'Rinse and remove labels before recycling. Check for recycling code.'
  },
  paper: {
    category: 'Paper',
    confidence: 88,
    tips: 'Remove any non-paper materials like plastic windows or metal clips.'
  },
  glass: {
    category: 'Glass',
    confidence: 95,
    tips: 'Rinse thoroughly. Separate by color if required by your local facility.'
  },
  cardboard: {
    category: 'Cardboard',
    confidence: 91,
    tips: 'Break down boxes to save space. Remove any tape or labels.'
  },
  metal: {
    category: 'Metal',
    confidence: 87,
    tips: 'Rinse containers. Check if your facility accepts aerosol cans.'
  },
  organic: {
    category: 'Organic',
    confidence: 89,
    tips: 'Compost food scraps and yard waste to reduce landfill waste.'
  }
};

const simulateClassification = () => {
  const categories = Object.keys(MOCK_RESULTS);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return MOCK_RESULTS[randomCategory];
};

const WasteClassifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access or upload an image instead",
        variant: "destructive"
      });
    }
  };

  const classifyImage = async () => {
    if (!image) return;
    
    setIsClassifying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const classificationResult = simulateClassification();
      setResult(classificationResult);
      
      toast({
        title: "Classification complete",
        description: `Item identified as ${classificationResult.category} with ${classificationResult.confidence}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Classification failed",
        description: "Unable to classify image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const resetClassifier = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const resultVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4, type: "spring", stiffness: 120 } }
  };

  const buttonHoverVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <MainLayout>
      <motion.div 
        className="max-w-2xl mx-auto p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-8 text-center" variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Waste Classification</h2>
          <p className="text-muted-foreground">Upload or take a photo of your waste item to identify its type and get recycling guidance</p>
        </motion.div>
        
        <motion.div 
          className="glass-panel rounded-xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  key="upload-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <motion.div 
                    className="mb-6 text-muted-foreground"
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                  >
                    <Trash2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>No image selected</p>
                  </motion.div>
                  
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleCameraCapture}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      variants={buttonHoverVariants}
                    >
                      <Camera className="h-5 w-5" />
                      <span>Camera</span>
                    </motion.button>
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-accent rounded-lg text-accent-foreground hover:bg-accent/90 transition-colors"
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      variants={buttonHoverVariants}
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload</span>
                    </motion.button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="image-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
                    <motion.img 
                      src={image} 
                      alt="Waste item to classify" 
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <AnimatePresence>
                      {isClassifying && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex flex-col items-center">
                            <motion.div
                              animate={{ 
                                rotate: 360,
                                transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                              }}
                            >
                              <Loader2 className="h-10 w-10 text-primary mb-2" />
                            </motion.div>
                            <motion.p 
                              className="text-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Analyzing image...
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex gap-4 justify-center mb-6">
                    <AnimatePresence>
                      {!isClassifying && !result && (
                        <motion.button
                          onClick={classifyImage}
                          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <span>Classify</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                    
                    <motion.button
                      onClick={resetClassifier}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
                        "bg-muted text-muted-foreground hover:bg-muted/90"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isClassifying}
                    >
                      <motion.div
                        animate={isClassifying ? { rotate: 360 } : {}}
                        transition={{ duration: 2, repeat: isClassifying ? Infinity : 0, ease: "linear" }}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </motion.div>
                      <span>Reset</span>
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {result && (
                      <motion.div 
                        className="bg-card rounded-lg p-6 shadow-sm border"
                        variants={resultVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                      >
                        <div className="flex items-start">
                          <motion.div 
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { type: "spring", stiffness: 200, delay: 0.2 } }}
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ 
                                scale: 1,
                                transition: { 
                                  delay: 0.4,
                                  type: "spring",
                                  stiffness: 200
                                }
                              }}
                            >
                              <CheckCircle2 className="h-6 w-6" />
                            </motion.div>
                          </motion.div>
                          <div>
                            <motion.h3 
                              className="text-xl font-medium mb-1"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {result.category} 
                              <motion.span 
                                className="text-sm text-muted-foreground ml-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                ({result.confidence}% confidence)
                              </motion.span>
                            </motion.h3>
                            <motion.p 
                              className="text-muted-foreground mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {result.tips}
                            </motion.p>
                            
                            <motion.div 
                              className="mt-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <h4 className="text-sm font-medium mb-2">Disposal Instructions:</h4>
                              <ul className="text-sm space-y-1">
                                {[
                                  "Check local recycling guidelines for specific requirements",
                                  "Clean items before recycling to avoid contamination",
                                  "Find a nearby recycling center that accepts this material"
                                ].map((tip, index) => (
                                  <motion.li 
                                    key={index}
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (index * 0.1) }}
                                  >
                                    <motion.span 
                                      className="block w-1 h-1 rounded-full bg-primary mt-1.5"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.6 + (index * 0.1) }}
                                    />
                                    <span>{tip}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                            
                            <motion.button
                              className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg text-secondary-foreground hover:bg-secondary/90 transition-colors text-sm"
                              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                            >
                              <MapPin className="h-4 w-4" />
                              <span>Find Recycling Centers</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default WasteClassifier;
