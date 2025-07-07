import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const clearImage = useCallback(() => {
    setUploadedImage(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Photo</h2>
        <p className="text-gray-600">Add a beautiful photo to your Mother's Day card</p>
      </div>

      {!uploadedImage ? (
        <motion.div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-pink-400 bg-pink-50' 
              : 'border-gray-300 hover:border-pink-300 hover:bg-pink-25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <motion.div
              className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center"
              animate={{ scale: dragActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-8 h-8 text-pink-500" />
            </motion.div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drop your image here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF (Max: 10MB)
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-lg border-2 border-pink-200 p-4"
        >
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded photo"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-green-600 font-semibold">✓ Photo uploaded successfully!</p>
            <p className="text-sm text-gray-500 mt-1">
              You can now proceed to choose a card style
            </p>
          </div>
        </motion.div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 mt-1">💡</div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Tips for best results:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use high-quality images with good lighting</li>
              <li>• Portrait or square images work best</li>
              <li>• Make sure the main subject is clearly visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;