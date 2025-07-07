import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, User, Heart, Sparkles, Quote } from 'lucide-react';
import { Button } from '../ui/button';

interface WishTextEditorProps {
  wishText: string;
  authorName: string;
  onUpdate: (wishText: string, authorName: string) => void;
}

const suggestedMessages = [
  "Happy Mother's Day! Thank you for all your love and care. You are the best mom in the world! 💕",
  "To the most amazing mom ever - your love has shaped who I am today. Thank you for everything! 🌸",
  "Mom, you are my hero, my inspiration, and my best friend. Happy Mother's Day! 💖",
  "Thank you for your endless love, patience, and wisdom. You make every day brighter! 🌹",
  "To my wonderful mother - your hugs can heal anything and your smile lights up my world! ✨",
  "Happy Mother's Day to the woman who taught me how to love, laugh, and live fully! 🦋"
];

const WishTextEditor: React.FC<WishTextEditorProps> = ({ 
  wishText, 
  authorName, 
  onUpdate 
}) => {
  const [currentWishText, setCurrentWishText] = useState(wishText);
  const [currentAuthorName, setCurrentAuthorName] = useState(authorName);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleWishTextChange = (text: string) => {
    setCurrentWishText(text);
    onUpdate(text, currentAuthorName);
  };

  const handleAuthorNameChange = (name: string) => {
    setCurrentAuthorName(name);
    onUpdate(currentWishText, name);
  };

  const useSuggestedMessage = (message: string) => {
    setCurrentWishText(message);
    onUpdate(message, currentAuthorName);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Your Personal Message</h2>
        <p className="text-gray-600">Write a heartfelt message for your mom</p>
      </div>

      {/* Main Message Editor */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Heart className="w-4 h-4 mr-2 text-pink-500" />
            Your Message
          </label>
          <div className="relative">
            <textarea
              value={currentWishText}
              onChange={(e) => handleWishTextChange(e.target.value)}
              placeholder="Write your heartfelt message here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none transition-colors"
              rows={6}
              maxLength={300}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {currentWishText.length}/300
            </div>
          </div>
        </div>

        {/* Author Name */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-pink-500" />
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={currentAuthorName}
            onChange={(e) => handleAuthorNameChange(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
            maxLength={50}
          />
        </div>
      </div>

      {/* Message Suggestions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="w-full flex items-center justify-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <Quote className="w-4 h-4" />
          <span>{showSuggestions ? 'Hide' : 'Show'} Message Suggestions</span>
        </Button>

        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600 mb-3">
              Click on any message below to use it as inspiration:
            </p>
            
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {suggestedMessages.map((message, index) => (
                <motion.button
                  key={index}
                  onClick={() => useSuggestedMessage(message)}
                  className="text-left p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg hover:from-pink-100 hover:to-purple-100 transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {message}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Writing Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Writing Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Share a specific memory you cherish</li>
              <li>• Express what you appreciate most about your mom</li>
              <li>• Keep it personal and from the heart</li>
              <li>• Don't worry about being perfect - sincerity matters most</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Character Count and Preview */}
      {currentWishText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Type className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-800">Message Preview</span>
          </div>
          <div className="text-sm text-green-700 italic">
            "{currentWishText}"
            {currentAuthorName && (
              <div className="mt-2 text-right">
                - {currentAuthorName}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WishTextEditor;