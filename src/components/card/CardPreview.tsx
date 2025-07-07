import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Share2 } from 'lucide-react';
import type { CardData } from '../MothersDayCardCreator';

interface CardPreviewProps {
  cardData: CardData;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData }) => {
  const { image, style, wishText, authorName } = cardData;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Eye className="w-5 h-5 mr-2 text-pink-500" />
          Card Preview
        </h3>
        <p className="text-gray-600 text-sm">See how your card will look</p>
      </div>

      <motion.div
        className="mx-auto max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card Container */}
        <div
          className="relative w-full aspect-[4/5] rounded-xl shadow-lg overflow-hidden"
          style={{
            background: style.background,
            border: style.border
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner decorations */}
            <div 
              className="absolute top-4 left-4 text-2xl opacity-70"
              style={{ color: style.textColor }}
            >
              💖
            </div>
            <div 
              className="absolute top-4 right-4 text-2xl opacity-70"
              style={{ color: style.textColor }}
            >
              🌸
            </div>
            <div 
              className="absolute bottom-4 left-4 text-2xl opacity-70"
              style={{ color: style.textColor }}
            >
              💐
            </div>
            <div 
              className="absolute bottom-4 right-4 text-2xl opacity-70"
              style={{ color: style.textColor }}
            >
              🌹
            </div>
          </div>

          {/* Card Content */}
          <div className="relative h-full flex flex-col p-6">
            {/* Title */}
            <div className="text-center mb-4">
              <h1 
                className="text-2xl font-bold font-serif"
                style={{ color: style.textColor }}
              >
                Happy Mother's Day
              </h1>
            </div>

            {/* User Image */}
            {image && (
              <div className="flex-shrink-0 mb-4">
                <div className="w-full h-32 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img
                    src={image}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Message Text */}
            <div className="flex-1 flex flex-col justify-center">
              <div 
                className="text-center text-sm leading-relaxed font-serif mb-4"
                style={{ color: style.textColor }}
              >
                {wishText || "Your heartfelt message will appear here..."}
              </div>

              {/* Author */}
              {authorName && (
                <div 
                  className="text-center text-sm italic"
                  style={{ color: style.textColor }}
                >
                  - {authorName}
                </div>
              )}
            </div>

            {/* Bottom decoration */}
            <div className="text-center">
              <div 
                className="inline-block text-lg"
                style={{ color: style.textColor }}
              >
                ✨ With Love ✨
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Info */}
      <div className="text-center space-y-2">
        <div className="flex justify-center space-x-4 text-xs text-gray-500">
          <span>Style: {style.name}</span>
          <span>•</span>
          <span>Theme: {style.theme}</span>
        </div>
        
        {!image && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
            Upload a photo to see it in your card preview
          </div>
        )}
      </div>

      {/* Mobile Preview Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Share2 className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-800 mb-1">Ready to Share?</p>
            <p className="text-blue-700">
              Your card will look great when shared on social media and messaging apps!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;