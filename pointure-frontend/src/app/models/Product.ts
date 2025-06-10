export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: number;
  categoryName: string;
  listingImages: string[];
  brandName: string;
  price: number;
  stock: number;
  colors: number[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
