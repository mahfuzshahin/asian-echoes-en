import {Component, OnInit} from '@angular/core';
import {News} from "../models/news.model";
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  featuredNews: News[] = [];
  latestNews: News[] = [];
  popularNews: News[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadFeaturedNews();
    this.loadLatestNews();
    this.loadPopularNews();
  }

  loadFeaturedNews(): void {
    this.newsService.getFeaturedNews().subscribe(news => {
      this.featuredNews = news;
    });
  }

  loadLatestNews(): void {
    // Implementation for latest news
  }

  loadPopularNews(): void {
    // Implementation for popular news
  }
}
