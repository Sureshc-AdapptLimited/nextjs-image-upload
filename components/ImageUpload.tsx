"use client";
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { AiOutlineUpload } from 'react-icons/ai';

const ImageUpload: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageSrc(reader.result as string);
    }
  };

  const showCroppedImage = useCallback(async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const fileName = `${Date.now()}-cropped.jpg`;
        const croppedFile = new File([croppedImageBlob], fileName, { type: 'image/jpeg' });
        setCroppedImage(croppedFile);
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleUpload = async () => {
    if (croppedImage) {
      const formData = new FormData();
      formData.append('file', croppedImage);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Image uploaded successfully!');
        } else {
          alert('Image upload failed.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <label
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:bg-gray-100"
      >
        <AiOutlineUpload size={40} className="text-gray-400" />
        <span className="mt-2 text-sm text-gray-600">Click to upload an image</span>
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>

      {imageSrc && (
        <div className="relative w-full h-64 mt-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <button
          onClick={showCroppedImage}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Crop & Save
        </button>
      )}

      {croppedImage && (
        <div className="mt-4">
          <img src={URL.createObjectURL(croppedImage)} alt="Cropped" className="rounded-md shadow-md max-w-full h-auto" />
          <button
            onClick={handleUpload}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
