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
  category_news:any[]=[];
  categories: any[] = [{name:'South Asia', code:'sports'}, {name:'Southeast Asia' ,code: 'southeast-asia'}];
  categorySections:any[]=[];

  constructor(private newsService: NewsService, private service: FrontendService) {}

  ngOnInit(): void {
    this.loadFeaturedNews();
    this.loadTopStories();
    this.loadSportsNews();
    this.getLatestNews();
    this.getLatestNewsFromEachCategory();
    this.loadAllCategories();
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
      'News': 'bg-red-600',
      'Sports': 'bg-green-600',
      'South Asia': 'bg-blue-600',
      ' Southeast Asia': 'bg-purple-600',
      'HOCKEY': 'bg-yellow-600',
      'INTERNATIONAL': 'bg-indigo-600',
      'BUSINESS': 'bg-emerald-600',
      'TECHNOLOGY': 'bg-cyan-600',
      'ENTERTAINMENT': 'bg-pink-600',
      'OPINION': 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
  }

  getLatestNewsFromEachCategory(){
    this.service.getLatestNewsFromEachCategory().subscribe((response:any)=>{
      this.category_news = response.data;
    })
  }
  loadAllCategories() {
    this.categorySections = []; // reset

    this.categories.forEach((category:any) => {
      this.service.getCategorySection(category.code).subscribe({
        next: (res: any) => {
          if (res.status && res.data) {
            this.categorySections.push({
              name: category.name,
              code: category.code,
              mainNews: res.data.mainNews || null,
              otherNews: res.data.otherNews || []
            });
          } else {
            // If no news, push empty arrays
            this.categorySections.push({
              name: category.name,
              code: category.code,
              mainNews: null,
              otherNews: []
            });
          }
        },
        error: err => console.error(`Error fetching category '${category.code}':`, err)
      });
    });
  }
  getPlainText(html: string): string {
    if (!html) return '';
    // Remove all image tags
    html = html.replace(/<img[^>]*>/g, '');
    // Remove all other HTML tags
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 250); // limit to 250 chars
  }
}
