import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breaking-news.component.html',
  styleUrl: './breaking-news.component.css'
})
export class BreakingNewsComponent {
  breakingNews = [
    'Major infrastructure project approved, set to transform regional connectivity',
    'National cricket team secures victory in thrilling final match',
    'Stock market experiences record highs amid economic recovery'
  ];
}
