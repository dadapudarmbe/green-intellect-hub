
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, RefreshCcw, Loader2, CheckCircle2, Trash2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// We'll simulate classification with a predefined set of results for now
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

    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
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
      // In a real app, we would set up a video stream and capture from it
      // For this demo, we'll just simulate a camera capture with an upload prompt
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      // Make sure to stop the stream
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
    
    // Simulate API call to classify image
    try {
      // Artificial delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get mock classification result
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Waste Classification</h2>
        <p className="text-muted-foreground">Upload or take a photo of your waste item to identify its type and get recycling guidance</p>
      </div>
      
      <motion.div 
        className="glass-panel rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          {!image ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 text-muted-foreground">
                <Trash2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No image selected</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCameraCapture}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Camera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-accent rounded-lg text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload</span>
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
                <img 
                  src={image} 
                  alt="Waste item to classify" 
                  className="w-full h-full object-cover"
                />
                
                {isClassifying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                      <p className="text-sm">Analyzing image...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 justify-center mb-6">
                {!isClassifying && !result && (
                  <button
                    onClick={classifyImage}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Classify</span>
                  </button>
                )}
                
                <button
                  onClick={resetClassifier}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-muted/90 transition-colors"
                  disabled={isClassifying}
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              {result && (
                <motion.div 
                  className="bg-card rounded-lg p-6 shadow-sm border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">
                        {result.category} <span className="text-sm text-muted-foreground ml-2">({result.confidence}% confidence)</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">{result.tips}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Disposal Instructions:</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start gap-2">
                            <span className="block w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                            <span>Check local recycling guidelines for specific requirements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="block w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                            <span>Clean items before recycling to avoid contamination</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="block w-1 h-1 rounded-full bg-primary mt-1.5"></span>
                            <span>Find a nearby recycling center that accepts this material</span>
                          </li>
                        </ul>
                      </div>
                      
                      <button
                        className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg text-secondary-foreground hover:bg-secondary/90 transition-colors text-sm"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Find Recycling Centers</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WasteClassifier;
