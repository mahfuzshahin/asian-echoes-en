import {Component, OnInit} from '@angular/core';
import {News, Photo} from "../models/news.model";
import {SwiperOptions} from "swiper/types";
import {ActivatedRoute} from "@angular/router";
import {NewsService} from "../services/news.service";

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit{
  news!: News;
  photos: Photo[] = [];
  relatedNews: News[] = [];

  // Swiper configuration
  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    loop: true
  };

  thumbConfig: SwiperOptions = {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  };

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const newsId = +params['id'];
      this.loadNewsDetail(newsId);
      this.loadPhotos(newsId);
      this.loadRelatedNews(newsId);
    });
  }

  loadNewsDetail(id: number): void {
    this.newsService.getNewsById(id).subscribe(news => {
      this.news = news;
    });
  }

  loadPhotos(newsId: number): void {
    this.newsService.getPhotosByNewsId(newsId).subscribe(photos => {
      this.photos = photos;
    });
  }

  loadRelatedNews(newsId: number): void {
    this.newsService.getRelatedNews(newsId).subscribe(news => {
      this.relatedNews = news;
    });
  }
}
