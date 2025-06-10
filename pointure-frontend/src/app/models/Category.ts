export enum CategoryCode {
  Drawing = 10,
  Painting = 20,
  Surfaces = 30,
  Brushes = 40,
  Easels = 50,
  Printmaking = 60,
  Sculpting = 70,
  KidsArt = 80,
  StudioSupplies = 90,
  Framing = 100,
  DigitalArt = 110,
  Calligraphy = 120,
  ArtSets = 130,
  ArtBooks = 140,
  ArtTools = 150,
  ArtAccessories = 160,
  ArtStorage = 170,
  Miscellaneous = 180,
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  route: string;
}
