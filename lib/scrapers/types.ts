export interface ScraperResult {
  store: string;
  platform: string;
  title: string;
  url: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl?: string;
}

export interface ScraperInterface {
  storeName: string;
  fetchDeals(): Promise<ScraperResult[]>;
}