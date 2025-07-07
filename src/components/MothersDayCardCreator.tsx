import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Share2, Heart, Flower2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import CardStyleSelector from './card/CardStyleSelector';
import ImageUploader from './card/ImageUploader';
import WishTextEditor from './card/WishTextEditor';
import CardPreview from './card/CardPreview';
import SocialSharing from './card/SocialSharing';

export interface CardStyle {
  id: string;
  name: string;
  background: string;
  border: string;
  textColor: string;
  theme: 'floral' | 'elegant' | 'cute' | 'modern';
}

export interface CardData {
  image: string | null;
  style: CardStyle;
  wishText: string;
  authorName: string;
}

const defaultStyles: CardStyle[] = [
  {
    id: 'floral-pink',
    name: 'Floral Pink',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
    border: '3px solid #ec4899',
    textColor: '#831843',
    theme: 'floral'
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #d8b4fe 100%)',
    border: '3px solid #a855f7',
    textColor: '#581c87',
    theme: 'elegant'
  },
  {
    id: 'cute-rose',
    name: 'Cute Rose',
    background: 'linear-gradient(135deg, #fff1f2 0%, #fecaca 50%, #fca5a5 100%)',
    border: '3px solid #ef4444',
    textColor: '#7f1d1d',
    theme: 'cute'
  },
  {
    id: 'modern-coral',
    name: 'Modern Coral',
    background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)',
    border: '3px solid #ea580c',
    textColor: '#9a3412',
    theme: 'modern'
  }
];

const MothersDayCardCreator: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    image: null,
    style: defaultStyles[0],
    wishText: 'Happy Mother\'s Day! Thank you for all your love and care. You are the best mom in the world! 💕',
    authorName: ''
  });
  
  const [currentStep, setCurrentStep] = useState<'upload' | 'style' | 'text' | 'preview'>('upload');
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((imageData: string) => {
    setCardData(prev => ({ ...prev, image: imageData }));
    setCurrentStep('style');
  }, []);

  const handleStyleSelect = useCallback((style: CardStyle) => {
    setCardData(prev => ({ ...prev, style }));
    setCurrentStep('text');
  }, []);

  const handleTextUpdate = useCallback((wishText: string, authorName: string) => {
    setCardData(prev => ({ ...prev, wishText, authorName }));
  }, []);

  const generateCardImage = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve('');

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (cardData.style.background.includes('gradient')) {
        gradient.addColorStop(0, '#fce7f3');
        gradient.addColorStop(0.5, '#fbcfe8');
        gradient.addColorStop(1, '#f9a8d4');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw border
      ctx.strokeStyle = cardData.style.border.split(' ')[2];
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Load and draw user image if available
      if (cardData.image) {
        const img = new Image();
        img.onload = () => {
          // Calculate aspect ratio and position
          const maxWidth = 300;
          const maxHeight = 200;
          const imgAspect = img.width / img.height;
          const maxAspect = maxWidth / maxHeight;
          
          let drawWidth, drawHeight;
          if (imgAspect > maxAspect) {
            drawWidth = maxWidth;
            drawHeight = maxWidth / imgAspect;
          } else {
            drawHeight = maxHeight;
            drawWidth = maxHeight * imgAspect;
          }
          
          const x = (canvas.width - drawWidth) / 2;
          const y = 50;
          
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          
          // Draw text
          drawText(ctx);
          resolve(canvas.toDataURL('image/png'));
        };
        img.src = cardData.image;
      } else {
        drawText(ctx);
        resolve(canvas.toDataURL('image/png'));
      }
    });
  }, [cardData]);

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = cardData.style.textColor;
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 32px serif';
    ctx.fillText('Happy Mother\'s Day', 400, 320);
    
    // Wish text
    ctx.font = '20px serif';
    const lines = wrapText(ctx, cardData.wishText, 600);
    lines.forEach((line, index) => {
      ctx.fillText(line, 400, 360 + (index * 30));
    });
    
    // Author
    if (cardData.authorName) {
      ctx.font = 'italic 18px serif';
      ctx.fillText(`- ${cardData.authorName}`, 400, 500);
    }
    
    // Decorative hearts
    ctx.font = '24px serif';
    ctx.fillText('💖', 100, 100);
    ctx.fillText('🌸', 700, 100);
    ctx.fillText('💐', 100, 500);
    ctx.fillText('🌹', 700, 500);
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const nextStep = () => {
    const steps: Array<'upload' | 'style' | 'text' | 'preview'> = ['upload', 'style', 'text', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Array<'upload' | 'style' | 'text' | 'preview'> = ['upload', 'style', 'text', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const stepTitles = {
    upload: 'Upload Photo',
    style: 'Choose Style',
    text: 'Add Your Wish',
    preview: 'Preview & Share'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Object.entries(stepTitles).map(([step, title], index) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === step
                    ? 'bg-pink-500 text-white'
                    : Object.keys(stepTitles).indexOf(currentStep) > index
                    ? 'bg-pink-200 text-pink-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === step ? 'text-pink-600' : 'text-gray-500'
              }`}>
                {title}
              </span>
              {index < Object.keys(stepTitles).length - 1 && (
                <div className={`w-16 h-1 mx-4 rounded ${
                  Object.keys(stepTitles).indexOf(currentStep) > index
                    ? 'bg-pink-300'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ImageUploader onImageUpload={handleImageUpload} />
              </motion.div>
            )}

            {currentStep === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CardStyleSelector
                  styles={defaultStyles}
                  selectedStyle={cardData.style}
                  onStyleSelect={handleStyleSelect}
                />
              </motion.div>
            )}

            {currentStep === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <WishTextEditor
                  wishText={cardData.wishText}
                  authorName={cardData.authorName}
                  onUpdate={handleTextUpdate}
                />
              </motion.div>
            )}

            {currentStep === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SocialSharing
                  cardData={cardData}
                  onGenerateImage={generateCardImage}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 'upload'}
              className="flex items-center space-x-2"
            >
              <span>← Previous</span>
            </Button>

            {currentStep !== 'preview' ? (
              <Button
                onClick={nextStep}
                disabled={currentStep === 'upload' && !cardData.image}
                className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600"
              >
                <span>Next →</span>
              </Button>
            ) : (
              <Button
                onClick={() => setIsSharing(true)}
                className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Card</span>
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:sticky lg:top-8">
          <CardPreview cardData={cardData} />
        </div>
      </div>

      {/* Hidden Canvas for Image Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default MothersDayCardCreator;