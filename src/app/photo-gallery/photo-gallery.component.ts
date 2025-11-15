import {Component, OnInit} from '@angular/core';
import {Input} from "postcss";
import {Photo} from "../models/news.model";
import {SwiperOptions} from "swiper/types";
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FrontendService} from "../services/frontend.service";

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.css'
})
export class PhotoGalleryComponent implements OnInit{
  photos: any[] = [];

  constructor(private photoService: FrontendService) {}

  ngOnInit(): void {
    this.photoService.getLatestNewsGallery().subscribe(photos => {
      this.photos = photos.data;
    });
  }
}
