export interface Product {
  id: string;
  rawName: string;
  rawDescription: string;
  barcode?: string;
  category: string;
  image?: string;
  status: 'ready' | 'pending';
  confidence: number;
  aiDescription?: string;
  aiTags?: string[];
  aiSEO?: string;
  targetAudience?: string;
  isOverridden?: boolean;
  createdAt: string;
}

export interface Stats {
  total: number;
  ready: number;
  pending: number;
  avgConfidence: number;
}

export interface CreateProductDTO {
  rawName: string;
  rawDescription: string;
  barcode?: string;
  category: string;
  image?: string;
}

export interface CSVPreviewItem {
  rawName?: string;
  name?: string;
  rawDescription?: string;
  description?: string;
  category?: string;
  barcode?: string;
}
