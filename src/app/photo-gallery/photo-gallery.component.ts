import {Component, OnInit} from '@angular/core';
import {Input} from "postcss";
import {Photo} from "../models/news.model";
import {SwiperOptions} from "swiper/types";

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.css'
})
export class PhotoGalleryComponent implements OnInit{
  ngOnInit(): void {
      throw new Error('Method not implemented.');
  }
   photos: Photo[] = [];

  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    loop: true,
    thumbs: {
      swiper: undefined
    }
  };

  thumbConfig: SwiperOptions = {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      320: { slidesPerView: 3 },
      640: { slidesPerView: 4 }
    }
  };
}
