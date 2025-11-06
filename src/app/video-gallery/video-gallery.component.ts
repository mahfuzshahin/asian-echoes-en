import {Component, OnInit} from '@angular/core';
import {FrontendService} from "../services/frontend.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css'
})
export class VideoGalleryComponent implements OnInit{
  allVideos: any[] = [];
  filteredVideos: any[] = [];
  displayedVideos: any[] = [];

  searchQuery = '';
  activeFilter = 'all';
  currentPage = 1;
  itemsPerPage = 12;
  hasMoreVideos = true;

  constructor(
    private videoService: FrontendService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getLatestVideos().subscribe({
      next: (videos) => {
        this.allVideos = videos;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        // Load sample data if service fails
        this.loadSampleVideos();
      }
    });
  }

  loadSampleVideos() {
    this.allVideos = [
      {
        id: 1,
        title: 'Breaking News: Major Economic Development',
        description: 'Latest updates on the economic situation with expert analysis.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '10:30',
        publishedAt: new Date('2024-01-15'),
        views: '15K',
        category: 'Economics'
      },
      {
        id: 2,
        title: 'Exclusive Interview with Prime Minister',
        description: 'One-on-one conversation about current policies and future plans.',
        url: 'https://www.youtube.com/watch?v=VIDEO_ID_2',
        duration: '8:45',
        publishedAt: new Date('2024-01-14'),
        views: '8.2K',
        category: 'Politics'
      },
      // Add more sample videos...
    ];
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allVideos];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        (video.description && video.description.toLowerCase().includes(query)) ||
        (video.category && video.category.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    switch (this.activeFilter) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views));
        break;
      default:
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    this.filteredVideos = filtered;
    this.currentPage = 1;
    this.displayedVideos = this.filteredVideos.slice(0, this.itemsPerPage);
    this.hasMoreVideos = this.displayedVideos.length < this.filteredVideos.length;
  }

  parseViews(views: string): number {
    if (!views) return 0;
    if (views.includes('K')) return parseFloat(views) * 1000;
    if (views.includes('M')) return parseFloat(views) * 1000000;
    return parseInt(views) || 0;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  loadMore() {
    this.currentPage++;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newVideos = this.filteredVideos.slice(startIndex, endIndex);

    this.displayedVideos = [...this.displayedVideos, ...newVideos];
    this.hasMoreVideos = this.displayedVideos.length < this.filteredVideos.length;
  }

  getVideoThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'assets/images/video-placeholder.jpg';
  }

  extractVideoId(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  }

  openVideo(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }

}
