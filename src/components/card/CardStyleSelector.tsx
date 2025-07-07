import React from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, Heart, Flower2, Sparkles, Crown } from 'lucide-react';
import type { CardStyle } from '../MothersDayCardCreator';

interface CardStyleSelectorProps {
  styles: CardStyle[];
  selectedStyle: CardStyle;
  onStyleSelect: (style: CardStyle) => void;
}

const themeIcons = {
  floral: Flower2,
  elegant: Crown,
  cute: Heart,
  modern: Sparkles
};

const CardStyleSelector: React.FC<CardStyleSelectorProps> = ({ 
  styles, 
  selectedStyle, 
  onStyleSelect 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Card Style</h2>
        <p className="text-gray-600">Select a beautiful theme for your Mother's Day card</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {styles.map((style) => {
          const IconComponent = themeIcons[style.theme];
          const isSelected = selectedStyle.id === style.id;
          
          return (
            <motion.div
              key={style.id}
              className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all ${
                isSelected 
                  ? 'border-pink-500 ring-2 ring-pink-200' 
                  : 'border-gray-200 hover:border-pink-300'
              }`}
              style={{ 
                background: style.background,
                minHeight: '120px'
              }}
              onClick={() => onStyleSelect(style)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}

              {/* Style Preview */}
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center space-x-2 mb-3">
                  <IconComponent 
                    className="w-5 h-5"
                    style={{ color: style.textColor }}
                  />
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: style.textColor }}
                  >
                    {style.name}
                  </h3>
                </div>

                {/* Sample Content */}
                <div className="space-y-2">
                  <div 
                    className="text-center font-serif text-sm"
                    style={{ color: style.textColor }}
                  >
                    Happy Mother's Day
                  </div>
                  <div 
                    className="text-center text-xs opacity-80"
                    style={{ color: style.textColor }}
                  >
                    With love and gratitude 💖
                  </div>
                </div>

                {/* Theme Badge */}
                <div className="mt-3">
                  <span 
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm"
                    style={{ color: style.textColor }}
                  >
                    {style.theme.charAt(0).toUpperCase() + style.theme.slice(1)}
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div 
                className="absolute top-3 left-3 text-lg opacity-60"
                style={{ color: style.textColor }}
              >
                🌸
              </div>
              <div 
                className="absolute bottom-3 right-3 text-lg opacity-60"
                style={{ color: style.textColor }}
              >
                💕
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Customization Note */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Palette className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-800 mb-1">Style Preview</h4>
            <p className="text-sm text-purple-700">
              Each style includes matching colors, fonts, and decorative elements. 
              Your selected style will be applied to the entire card layout.
            </p>
          </div>
        </div>
      </div>

      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-green-700 font-semibold">
            ✓ "{selectedStyle.name}" style selected!
          </p>
          <p className="text-sm text-green-600 mt-1">
            Ready to add your personal message
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CardStyleSelector;