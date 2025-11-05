import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { News, Category, Photo, TabNews } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor() { }

  getFeaturedNews(): Observable<News[]> {
    const featuredNews: News[] = [
      {
        id: 1,
        title: 'Major Infrastructure Project Approved, Set to Transform Regional Connectivity',
        summary: 'The government has given the final green light to a mega-project that promises to boost trade and ease traffic congestion.',
        content: 'Full article content here...',
        category: 'POLITICS',
        author: 'John Doe',
        publishDate: new Date('2023-10-15'),
        imageUrl: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        views: 1200,
        tags: ['Infrastructure', 'Development', 'Economy'],
        isFeatured: true,
        readTime: 5
      }
    ];
    return of(featuredNews);
  }

  getTopStories(): Observable<News[]> {
    const topStories: News[] = [
      {
        id: 2,
        title: 'Parliament Session Ends Amidst Heated Debates on New Legislation',
        summary: 'Intense discussions mark the end of parliamentary session.',
        content: 'Full content...',
        category: 'POLITICS',
        author: 'Political Desk',
        publishDate: new Date('2023-10-15'),
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        views: 800,
        tags: ['Parliament', 'Legislation'],
        isFeatured: false,
        readTime: 3
      },
      {
        id: 3,
        title: 'Global Summit Addresses Climate Change with New Commitments',
        summary: 'International leaders gather to discuss climate action.',
        content: 'Full content...',
        category: 'INTERNATIONAL',
        author: 'Environment Desk',
        publishDate: new Date('2023-10-15'),
        imageUrl: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        views: 950,
        tags: ['Climate', 'Summit'],
        isFeatured: false,
        readTime: 4
      }
    ];
    return of(topStories);
  }

  getSportsNews(): Observable<News[]> {
    const sportsNews: News[] = [
      {
        id: 4,
        title: 'National Cricket Team Secures Victory in Thrilling Final Match',
        summary: 'In a nail-biting conclusion, the Tigers clinched the series with a last-ball six.',
        content: 'Full content...',
        category: 'CRICKET',
        author: 'Sports Desk',
        publishDate: new Date('2023-10-14'),
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80',
        views: 2400,
        tags: ['Cricket', 'Victory'],
        isFeatured: true,
        readTime: 4
      }
    ];
    return of(sportsNews);
  }

  getTabNews(): any {
    return {
      latest: [
        { title: 'New policy announced for tech startups to boost innovation.', time: '5 mins ago' },
        { title: 'City metro expansion project gets underway with new funding.', time: '25 mins ago' },
        { title: 'International trade fair opens in Dhaka with 50+ countries.', time: '1 hour ago' },
        { title: 'Famous singer to perform live concert this Friday at Army Stadium.', time: '3 hours ago' },
      ],
      popular: [
        { title: 'Analyzing the economic forecast for the next quarter.', rank: 1 },
        { title: 'Weekend travel guide: Top 5 hidden gems near Dhaka.', rank: 2 },
        { title: 'How a local startup is challenging global tech giants.', rank: 3 },
        { title: 'Inside story of the dramatic policy shift in education.', rank: 4 },
      ],
      read: [
        { title: 'Exclusive interview with the national cricket captain.', rank: 1 },
        { title: 'A deep dive into the changing political landscape.', rank: 2 },
        { title: 'Health tips: How to stay fit during monsoon season.', rank: 3 },
        { title: 'The rise of e-commerce in rural Bangladesh.', rank: 4 },
      ]
    };
  }

  getGalleryPhotos(): Observable<Photo[]> {
    const photos: Photo[] = [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'City Development'
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Cultural Festival'
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Natural Beauty'
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Urban Life'
      }
    ];
    return of(photos);
  }
}
