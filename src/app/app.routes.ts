import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NewsDetailComponent} from "./news-detail/news-detail.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  // { path: 'category/:slug', component: CategoryComponent },
  { path: '**', redirectTo: '' }
];
