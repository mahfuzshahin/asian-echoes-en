import {Component, OnInit} from '@angular/core';
import {Input} from "postcss";
import {Photo} from "../models/news.model";
import {SwiperOptions} from "swiper/types";
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.css'
})
export class PhotoGalleryComponent implements OnInit{
  photos: Photo[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getGalleryPhotos().subscribe(photos => {
      this.photos = photos;
    });
  }
}
