import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { News, Category, Photo } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://jsonplaceholder.typicode.com'; // Mock API

  constructor(private http: HttpClient) { }

  getFeaturedNews(): Observable<News[]> {
    // Mock data - replace with actual API call
    const featuredNews: News[] = [
      {
        id: 1,
        title: 'Major Infrastructure Project Approved, Set to Transform Regional Connectivity',
        summary: 'The government has given the final green light to a mega-project that promises to boost trade and ease traffic congestion.',
        content: 'Full article content here...',
        category: 'Politics',
        author: 'John Doe',
        publishDate: new Date('2023-10-15'),
        imageUrl: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9',
        views: 1200,
        tags: ['Infrastructure', 'Development', 'Economy'],
        isFeatured: true
      },
      // Add more mock news items
    ];
    return of(featuredNews);
  }

  getNewsByCategory(category: string): Observable<News[]> {
    // Mock implementation
    return of([]);
  }

  getNewsById(id: number): Observable<News> {
    // Mock implementation
    return of({
      id: 1,
      title: 'Major Infrastructure Project Approved',
      summary: 'Project summary...',
      content: 'Full content...',
      category: 'Politics',
      author: 'John Doe',
      publishDate: new Date(),
      imageUrl: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9',
      views: 1200,
      tags: ['Infrastructure', 'Development'],
      isFeatured: true
    });
  }

  getCategories(): Observable<Category[]> {
    const categories: Category[] = [
      { id: 1, name: 'Home', slug: 'home' },
      { id: 2, name: 'National', slug: 'national' },
      { id: 3, name: 'Politics', slug: 'politics' },
      { id: 4, name: 'International', slug: 'international' },
      { id: 5, name: 'Business', slug: 'business' },
      { id: 6, name: 'Sports', slug: 'sports' },
      { id: 7, name: 'Entertainment', slug: 'entertainment' },
      { id: 8, name: 'Technology', slug: 'technology' },
      { id: 9, name: 'Opinion', slug: 'opinion' }
    ];
    return of(categories);
  }

  getPhotosByNewsId(newsId: number): Observable<Photo[]> {
    const photos: Photo[] = [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9',
        caption: 'Construction site preparation',
        newsId: 1
      },
      // Add more photos
    ];
    return of(photos);
  }

  getRelatedNews(newsId: number): Observable<News[]> {
    // Mock related news
    return of([]);
  }
}
