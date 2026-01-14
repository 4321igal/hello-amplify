import { useState } from 'react';

export interface CSVPreviewItem {
  id: number;
  [key: string]: string | number;
}

export function useCSVImport() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<CSVPreviewItem[]>([]);

  const handleCSVUpload = (file: File) => {
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const preview = lines.slice(1, 6).map((line, idx) => {
        const values = line.split(',').map(v => v.trim());
        const product: CSVPreviewItem = { id: Date.now() + idx };
        headers.forEach((header, i) => {
          product[header] = values[i] || '';
        });
        return product;
      }).filter(p => p.rawName || p.name);
      
      setImportPreview(preview);
    };
    reader.readAsText(file);
  };

  const resetImport = () => {
    setCsvFile(null);
    setImportPreview([]);
  };

  return {
    // State
    csvFile,
    importPreview,
    
    // Setters
    setCsvFile,
    setImportPreview,
    
    // Actions
    handleCSVUpload,
    resetImport
  };
}
