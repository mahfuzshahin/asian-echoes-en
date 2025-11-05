import { Component } from '@angular/core';
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeTab = 'latest';
  tabData: any = {};

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.tabData = this.newsService.getTabNews();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getCurrentTabData(): any[] {
    return this.tabData[this.activeTab] || [];
  }
}
