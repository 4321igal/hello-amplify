import { useState } from 'react';
import { CreateProductDTO } from '../types/product';

export interface FormData extends CreateProductDTO {
  image?: string;
}

export function useProductForm(initialData?: FormData) {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      rawName: '',
      rawDescription: '',
      barcode: '',
      category: '',
      image: undefined
    }
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploadType, setImageUploadType] = useState<'upload' | 'url'>('upload');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      rawName: '',
      rawDescription: '',
      barcode: '',
      category: '',
      image: undefined
    });
    setImagePreview(null);
    setImageUrl('');
    setImageUploadType('upload');
  };

  const getSubmitData = (): FormData => {
    return {
      ...formData,
      image: imagePreview || imageUrl || undefined
    };
  };

  return {
    // State
    formData,
    imagePreview,
    imageUrl,
    imageUploadType,
    
    // Setters
    setFormData,
    setImagePreview,
    setImageUrl,
    setImageUploadType,
    
    // Actions
    handleImageUpload,
    resetForm,
    getSubmitData
  };
}
