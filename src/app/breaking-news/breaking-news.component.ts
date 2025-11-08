import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FrontendService} from "../services/frontend.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breaking-news.component.html',
  styleUrl: './breaking-news.component.css'
})
export class BreakingNewsComponent implements OnInit{
  breakingNews:any[] = [];
  constructor(private frontendService: FrontendService) {
  }
  ngOnInit() {
    this.findBreakingNews();
  }
  findBreakingNews(){
    this.frontendService.findBreakingNews().subscribe((response:any)=>{
      this.breakingNews = response.data;
    });
  }
}
