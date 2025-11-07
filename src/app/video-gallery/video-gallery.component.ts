import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import {FrontendService} from "../services/frontend.service";
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css'
})
export class VideoGalleryComponent implements OnInit {
  videos: any[] = [];
  selectedVideo: any | null = null;
  showVideoModal = false;
  safeVideoUrl: SafeResourceUrl | null = null;

  // Modal states
  isLoadingModal = false;
  embedError = false;

  // Pagination
  currentPage = 1;
  limit = 8;
  hasMoreVideos = true;
  isLoading = false;
  isInitialLoading = true;

  constructor(
    private videoService: FrontendService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.videoService.getPaginatedVideos(this.limit, this.currentPage).subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          const newVideos = response.data;
          this.videos = [...this.videos, ...newVideos];
          this.hasMoreVideos = newVideos.length === this.limit;
          this.currentPage++;
        }
        this.isLoading = false;
        this.isInitialLoading = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.isLoading = false;
        this.isInitialLoading = false;
      }
    });
  }

  openVideoModal(video: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedVideo = video;
    this.showVideoModal = true;
    this.isLoadingModal = true;
    this.embedError = false;

    // Create safe URL for iframe
    this.safeVideoUrl = this.getSafeVideoUrl(video.youtubeUrl);

    document.body.style.overflow = 'hidden';
  }

  closeVideoModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedVideo = null;
    this.safeVideoUrl = null;
    this.showVideoModal = false;
    this.isLoadingModal = false;
    this.embedError = false;
    document.body.style.overflow = 'auto';
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeVideoModal();
    }
  }

  getSafeVideoUrl(youtubeUrl: string): SafeResourceUrl {
    const embedUrl = this.videoService.getYouTubeEmbedUrl(youtubeUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getYouTubeWatchUrl(youtubeUrl: string): string {
    return this.videoService.getYouTubeWatchUrl(youtubeUrl);
  }

  onIframeLoad(event: Event): void {
    this.isLoadingModal = false;
  }

  onIframeError(event: Event): void {
    this.isLoadingModal = false;
    this.embedError = true;
  }

  // Open video on YouTube in new tab
  watchOnYouTube(video: any): void {
    const watchUrl = this.getYouTubeWatchUrl(video.youtubeUrl);
    window.open(watchUrl, '_blank');
    this.closeVideoModal();
  }

  loadMore(): void {
    this.loadVideos();
  }

  onImageLoad(video: any): void {
    video.loaded = true;
  }

}
