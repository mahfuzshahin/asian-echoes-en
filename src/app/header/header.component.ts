import {Component, OnInit} from '@angular/core';
import {Category} from "../models/news.model";
import {NewsService} from "../services/news.service";
import {LucideAngularModule} from "lucide-angular";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule, NgForOf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink,
    NgForOf, CommonModule, RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  categories: Category[] = [];
  currentTime: string = '';

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }

  loadCategories(): void {
    this.newsService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka'
    }) + ' (BST)';
  }
}
