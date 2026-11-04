export interface Destination {
  id: string;
  name: string;
  country: string;
  scope: string;
  nights: number;
  priceFrom: number;
  image: string;
  blurb: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  summary: string;
  days: number;
  price: number;
  image: string;
  includes: string[];
}

export interface Testimonial {
  name: string;
  city: string;
  text: string;
}

export interface Catalog {
  destinations: Destination[];
  packages: TravelPackage[];
  testimonials: Testimonial[];
}

export interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  destination: string;
  travelers: number;
  travelDate?: string;
  message?: string;
}
