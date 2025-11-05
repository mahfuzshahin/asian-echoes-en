export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishDate: Date;
  imageUrl: string;
  views: number;
  tags: string[];
  isFeatured: boolean;
  readTime: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Photo {
  id: number;
  url: string;
  caption: string;
}

export interface TabNews {
  title: string;
  time?: string;
  rank?: number;
}
