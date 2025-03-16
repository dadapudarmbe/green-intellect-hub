
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Aperture } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraFeedProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        setError('Camera access denied or not available. Please check your permissions.');
        console.error('Camera error:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and send it to parent component
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-medium">Camera Feed</h3>
        <button 
          onClick={onClose}
          className="rounded-full p-2 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {error ? (
          <motion.div 
            className="text-center p-6 bg-destructive/10 rounded-lg max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <p className="text-destructive">{error}</p>
            <button 
              onClick={onClose} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Go Back
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="relative rounded-lg overflow-hidden shadow-lg bg-black max-w-xl w-full mx-auto mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className={cn(
                  "w-full h-auto",
                  !isStreaming && "invisible"
                )}
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <motion.button
              onClick={captureImage}
              className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              disabled={!isStreaming}
            >
              <Aperture className="h-5 w-5" />
              <span>Capture Image</span>
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CameraFeed;
