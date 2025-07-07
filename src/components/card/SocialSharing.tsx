import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import type { CardData } from '../MothersDayCardCreator';

interface SocialSharingProps {
  cardData: CardData;
  onGenerateImage: () => Promise<string>;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ cardData, onGenerateImage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showLinePreview, setShowLinePreview] = useState(false);

  const generateAndDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      const imageData = await onGenerateImage();
      setGeneratedImage(imageData);
      
      // Create download link
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `mothers-day-card-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerateImage]);

  const generateLineFlexMessage = useCallback(async () => {
    if (!generatedImage) {
      const imageData = await onGenerateImage();
      setGeneratedImage(imageData);
    }

    const flexMessage = {
      type: "flex",
      altText: "Happy Mother's Day Card 💝",
      contents: {
        type: "bubble",
        size: "kilo",
        hero: {
          type: "image",
          url: generatedImage || "https://via.placeholder.com/800x600/ff69b4/ffffff?text=Mother's+Day+Card",
          size: "full",
          aspectRatio: "4:3",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "💝 Happy Mother's Day!",
              weight: "bold",
              size: "xl",
              color: "#E91E63",
              align: "center"
            },
            {
              type: "text",
              text: cardData.wishText.substring(0, 100) + (cardData.wishText.length > 100 ? "..." : ""),
              size: "sm",
              color: "#666666",
              margin: "md",
              wrap: true,
              align: "center"
            },
            {
              type: "separator",
              margin: "md"
            },
            {
              type: "box",
              layout: "vertical",
              margin: "md",
              contents: [
                {
                  type: "text",
                  text: `Card Style: ${cardData.style.name}`,
                  size: "xs",
                  color: "#999999",
                  align: "center"
                },
                ...(cardData.authorName ? [{
                  type: "text",
                  text: `From: ${cardData.authorName}`,
                  size: "xs",
                  color: "#999999",
                  align: "center"
                }] : [])
              ]
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              height: "sm",
              color: "#E91E63",
              action: {
                type: "uri",
                label: "Create Your Own Card",
                uri: window.location.href
              }
            }
          ]
        }
      }
    };

    return flexMessage;
  }, [cardData, generatedImage, onGenerateImage]);

  const shareToLine = useCallback(async () => {
    try {
      setIsGenerating(true);
      const flexMessage = await generateLineFlexMessage();
      
      // Create LINE share URL with flex message
      const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
        `💝 Happy Mother's Day! 💝\n\n${cardData.wishText}\n\n${cardData.authorName ? `- ${cardData.authorName}\n\n` : ''}Create your own beautiful Mother's Day card: ${window.location.href}`
      )}`;
      
      window.open(lineUrl, '_blank');
      setShowLinePreview(true);
    } catch (error) {
      console.error('Error sharing to LINE:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateLineFlexMessage, cardData]);

  const copyFlexMessage = useCallback(async () => {
    try {
      const flexMessage = await generateLineFlexMessage();
      await navigator.clipboard.writeText(JSON.stringify(flexMessage, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying flex message:', error);
    }
  }, [generateLineFlexMessage]);

  const shareToFacebook = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`💝 Happy Mother's Day! ${cardData.wishText}`)}`;
    window.open(url, '_blank');
  }, [cardData.wishText]);

  const shareToTwitter = useCallback(() => {
    const text = `💝 Happy Mother's Day! ${cardData.wishText.substring(0, 100)}${cardData.wishText.length > 100 ? '...' : ''} ${cardData.authorName ? `- ${cardData.authorName}` : ''}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }, [cardData]);

  const shareToWhatsApp = useCallback(() => {
    const text = `💝 Happy Mother's Day! 💝\n\n${cardData.wishText}\n\n${cardData.authorName ? `- ${cardData.authorName}\n\n` : ''}Create your own beautiful Mother's Day card: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }, [cardData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Beautiful Card</h2>
        <p className="text-gray-600">Download or share your Mother's Day card on social media</p>
      </div>

      {/* Download Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 flex items-center">
          <Download className="w-4 h-4 mr-2 text-green-500" />
          Download Your Card
        </h3>
        
        <Button
          onClick={generateAndDownload}
          disabled={isGenerating}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download as Image
            </div>
          )}
        </Button>
      </div>

      {/* LINE Sharing - Special Focus */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-green-800 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Share on LINE
        </h3>
        
        <div className="space-y-2">
          <Button
            onClick={shareToLine}
            disabled={isGenerating}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Share to LINE
            </div>
          </Button>
          
          <Button
            onClick={copyFlexMessage}
            variant="outline"
            className="w-full border-green-300 text-green-600 hover:bg-green-50"
          >
            <div className="flex items-center">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy LINE Flex Message'}
            </div>
          </Button>
        </div>
        
        <div className="text-xs text-green-600 bg-green-100 rounded p-2">
          <strong>For Developers:</strong> Use the "Copy Flex Message" to get the JSON for LINE Bot integration
        </div>
      </div>

      {/* Other Social Media */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 flex items-center">
          <Share2 className="w-4 h-4 mr-2 text-blue-500" />
          Share on Social Media
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={shareToWhatsApp}
            variant="outline"
            className="w-full border-green-300 text-green-600 hover:bg-green-50"
          >
            📱 Share on WhatsApp
          </Button>
          
          <Button
            onClick={shareToFacebook}
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            📘 Share on Facebook
          </Button>
          
          <Button
            onClick={shareToTwitter}
            variant="outline"
            className="w-full border-sky-300 text-sky-600 hover:bg-sky-50"
          >
            🐦 Share on Twitter
          </Button>
        </div>
      </div>

      {/* LINE Flex Message Preview */}
      {showLinePreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
            LINE Message Preview
          </h4>
          <div className="bg-white rounded-lg p-3 text-sm">
            <div className="text-pink-600 font-bold text-center mb-2">💝 Happy Mother's Day!</div>
            <div className="text-gray-600 text-center mb-2">{cardData.wishText.substring(0, 100)}...</div>
            <div className="text-xs text-gray-400 text-center border-t pt-2">
              Card Style: {cardData.style.name}
              {cardData.authorName && <div>From: {cardData.authorName}</div>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sharing Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ExternalLink className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-800 mb-1">Sharing Tips</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Download the image for best quality when sharing</li>
              <li>• LINE Flex Message provides an interactive card experience</li>
              <li>• Share the link to let others create their own cards</li>
              <li>• WhatsApp and messaging apps work great with the image download</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSharing;