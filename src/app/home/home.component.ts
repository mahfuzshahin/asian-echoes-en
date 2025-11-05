import {Component, OnInit} from '@angular/core';
import {News} from "../models/news.model";
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PhotoGalleryComponent} from "../photo-gallery/photo-gallery.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FrontendService} from "../services/frontend.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PhotoGalleryComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  featuredNews: News[] = [];
  topStories: News[] = [];
  sportsNews: News[] = [];
  latest_news:any;

  constructor(private newsService: NewsService, private service: FrontendService) {}

  ngOnInit(): void {
    this.loadFeaturedNews();
    this.loadTopStories();
    this.loadSportsNews();
    this.getLatestNews();
  }
  getLatestNews(){
    this.service.getLatestNews().subscribe((response:any)=>{
      this.latest_news = response.data;
    })
  }

  loadFeaturedNews(): void {
    this.newsService.getFeaturedNews().subscribe(news => {
      this.featuredNews = news;
    });
  }

  loadTopStories(): void {
    this.newsService.getTopStories().subscribe(news => {
      this.topStories = news;
    });
  }

  loadSportsNews(): void {
    this.newsService.getSportsNews().subscribe(news => {
      this.sportsNews = news;
    });
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'POLITICS': 'bg-red-600',
      'CRICKET': 'bg-green-600',
      'FOOTBALL': 'bg-blue-600',
      'ATHLETICS': 'bg-purple-600',
      'HOCKEY': 'bg-yellow-600',
      'INTERNATIONAL': 'bg-indigo-600',
      'BUSINESS': 'bg-emerald-600',
      'TECHNOLOGY': 'bg-cyan-600',
      'ENTERTAINMENT': 'bg-pink-600',
      'OPINION': 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
  }
}
