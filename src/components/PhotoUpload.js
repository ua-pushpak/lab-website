import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

const PhotoUpload = ({ onPhotoUploaded, currentPhoto }) => {
  const [preview, setPreview] = useState(currentPhoto || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const uploadFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    setUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await apiService.uploadPhoto(formData);
      setProgress(100);
      onPhotoUploaded(response.data.data.url);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading:', error);
      setUploading(false);
      setProgress(0);
      alert('Error uploading file. Please try again.');
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
    onPhotoUploaded('');
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-drone-blue bg-drone-blue/10'
            : 'border-white/20 hover:border-drone-blue/50 hover:bg-drone-gray'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <div className="py-8">
            <i className="fas fa-cloud-upload-alt text-4xl text-drone-blue mb-3"></i>
            <p className="text-white font-medium mb-1">
              Drag and drop your photo here
            </p>
            <p className="text-gray-400 text-sm">
              or click to browse
            </p>
            <p className="text-gray-500 text-xs mt-2">
              JPEG, PNG, GIF, WebP (Max 5MB)
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-drone-dark/90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-drone-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white">Uploading... {progress}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;