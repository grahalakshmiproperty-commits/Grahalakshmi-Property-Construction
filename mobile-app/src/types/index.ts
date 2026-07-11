export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  property_type: 'buy' | 'rent' | 'commercial';
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  user_type: 'buyer' | 'seller' | 'agent' | 'admin';
  created_at: string;
}

export interface PropertyFilters {
  propertyType?: 'buy' | 'rent' | 'commercial';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
}
