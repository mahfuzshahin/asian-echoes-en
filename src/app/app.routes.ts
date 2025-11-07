import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NewsDetailComponent} from "./news-detail/news-detail.component";
import {VideoGalleryComponent} from "./video-gallery/video-gallery.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {CategorySectionComponent} from "./category-section/category-section.component";
import {AuthorComponent} from "./author/author.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news/:slug', component: NewsDetailComponent },
  { path: 'video', component: VideoGalleryComponent },
  { path: 'gallery', component: GalleryComponent },
  {
    path: 'category/:slug',
    component: CategorySectionComponent
  },
  { path: 'author/:id', component: AuthorComponent },
  { path: '**', redirectTo: '' }
];
