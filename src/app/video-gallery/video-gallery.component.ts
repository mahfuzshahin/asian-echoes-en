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
export class VideoGalleryComponent implements OnInit, OnDestroy, AfterViewInit {
  allVideos: any[] = [];
  filteredVideos: any[] = [];

  searchQuery = '';
  activeFilter = 'all';

  // Pagination & Loading
  currentPage = 1;
  itemsPerPage = 2;
  hasMoreVideos = true;
  isLoading = false;
  isInitialLoading = true;
  totalVideos = 0;
  totalPages = 0;
  errorMessage = '';

  // Video Modal & Error Handling
  showVideoModal = false;
  selectedVideo: any = null;
  embedError = false;
  isLoadingModal = false;
  iframeLoaded = false;
  private iframeLoadTimeout: any;

  // Modal state management
  private isModalOpening = false;
  private modalOpenTimeout: any;
  private embedCheckInterval: any;
  private isModalClosing = false;

  private modalActionInProgress = false;
  constructor(
    private videoService: FrontendService,
    private sanitizer: DomSanitizer,
    private router: Router, private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadVideos();
  }
  ngAfterViewInit() {
    if (this.showVideoModal && this.isLoadingModal) {
      this.triggerManualLoadCheck();
    }
  }

  ngOnDestroy() {
    // this.stopEmbedCheck();
    this.clearModalTimeouts();
    // this.clearIframeTimeouts();
  }
  private logModalState(action: string) {
    console.log(`Modal ${action}:`, {
      showVideoModal: this.showVideoModal,
      isModalOpening: this.isModalOpening,
      isModalClosing: this.isModalClosing,
      selectedVideo: this.selectedVideo?.title,
      timestamp: new Date().toISOString()
    });
  }

  private clearModalTimeouts() {
    if (this.modalOpenTimeout) {
      clearTimeout(this.modalOpenTimeout);
      this.modalOpenTimeout = null;
    }
  }



  openVideoModal(video: any, event?: Event) {
    // Immediate event blocking
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    console.log('🔄 openVideoModal called', {
      modalActionInProgress: this.modalActionInProgress,
      showVideoModal: this.showVideoModal,
      video: video?.title
    });

    // Simple, aggressive blocking
    if (this.modalActionInProgress || this.showVideoModal) {
      console.log('🚫 BLOCKED: Modal action already in progress or modal is open');
      return;
    }

    // Immediately set flag to block other calls
    this.modalActionInProgress = true;

    // Set modal states
    this.selectedVideo = video;
    this.showVideoModal = true;
    this.embedError = false;
    this.isLoadingModal = true;

    this.preventBodyScroll();
    this.cdRef.detectChanges();

    console.log('✅ Modal opened successfully');

    // Reset flag after a safe period
    this.modalOpenTimeout = setTimeout(() => {
      this.modalActionInProgress = false;
      console.log('🔄 Modal action lock released');
    }, 1000);
  }


  private forceIframeLoadDetection() {
    setTimeout(() => {
      if (this.showVideoModal && this.isLoadingModal) {
        console.log('🔄 Force checking iframe state');
        const iframe = document.querySelector('iframe');

        if (iframe) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            console.log('🔍 Iframe document accessible:', !!iframeDoc);
          } catch (e) {
            console.log('✅ Iframe loaded (CORS error expected)');
            this.handleIframeLoadComplete();
          }
        }

        setTimeout(() => {
          if (this.isLoadingModal && !this.iframeLoaded) {
            console.log('⏰ Final fallback - assuming iframe loaded');
            this.handleIframeLoadComplete();
          }
        }, 3000);
      }
    }, 1000);
  }
  closeVideoModal(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    console.log('🔄 closeVideoModal called', {
      modalActionInProgress: this.modalActionInProgress,
      showVideoModal: this.showVideoModal
    });

    // Don't block close based on action in progress, but still use flag
    this.modalActionInProgress = true;

    this.clearModalTimeouts();

    // Reset modal states
    this.showVideoModal = false;
    this.selectedVideo = null;
    this.embedError = false;
    this.isLoadingModal = true;

    this.restoreBodyScroll();
    this.cdRef.detectChanges();

    console.log('✅ Modal closed successfully');

    // Reset flag
    setTimeout(() => {
      this.modalActionInProgress = false;
      console.log('🔄 Modal action lock released after close');
    }, 500);
  }


  private clearIframeTimeouts() {
    if (this.iframeLoadTimeout) {
      clearTimeout(this.iframeLoadTimeout);
      this.iframeLoadTimeout = null;
    }
  }
  onIframeLoad(event: any) {
    console.log('✅ Iframe loaded successfully');
    this.isLoadingModal = false;
    this.cdRef.detectChanges();
  }

  private handleIframeLoadComplete() {
    console.log('🎬 Iframe load complete');
    this.iframeLoaded = true;
    this.isLoadingModal = false;
    this.clearIframeTimeouts();
    // Start error detection
    setTimeout(() => {
      this.startEmbedCheck();
    }, 2000);

    this.cdRef.detectChanges();
  }

  onBackdropClick(event: MouseEvent) {
    console.log('🎯 Backdrop clicked');
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();

    const target = event.target as HTMLElement;
    if (target.classList.contains('video-modal-container') ||
      target.classList.contains('modal-backdrop')) {
      this.closeVideoModal(event);
    }
  }

  preventBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  restoreBodyScroll() {
    document.body.style.overflow = '';
  }

  startEmbedCheck() {
    this.stopEmbedCheck();

    this.embedCheckInterval = setInterval(() => {
      this.checkEmbedStatus();
    }, 1000);

    setTimeout(() => {
      if (!this.embedError) {
        this.stopEmbedCheck();
      }
    }, 10000);
  }

  stopEmbedCheck() {
    if (this.embedCheckInterval) {
      clearInterval(this.embedCheckInterval);
      this.embedCheckInterval = null;
    }
  }
  onIframeError(event: any) {
    console.error('❌ Iframe error occurred:', event);
    this.embedError = true;
    this.isLoadingModal = false;
    this.cdRef.detectChanges();
  }
  checkEmbedStatus() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    const iframeTitle = iframe.title.toLowerCase();
    const errorIndicators = [
      'unavailable',
      'playback has been disabled',
      'embedding disabled',
      'video not available',
      'private video',
      'error',
      'restricted'
    ];

    const hasTitleError = errorIndicators.some(indicator =>
      iframeTitle.includes(indicator)
    );

    const rect = iframe.getBoundingClientRect();

    if (hasTitleError || rect.height < 200 || rect.width < 300) {
      this.embedError = true;
      this.isLoadingModal = false;
      this.stopEmbedCheck();
      this.cdRef.detectChanges();
    }
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const videoId = this.extractVideoId(url);
    if (!videoId) {
      this.embedError = true;
      this.isLoadingModal = false;
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Manual load trigger as fallback
  triggerManualLoadCheck() {
    setTimeout(() => {
      if (this.showVideoModal && this.isLoadingModal && !this.iframeLoaded) {
        console.log('🔄 Manual load check - iframe might be stuck');
        const iframe = document.querySelector('iframe');
        if (iframe) {
          console.log('🔍 Iframe found, checking state');
          // Try to trigger load complete manually
          this.handleIframeLoadComplete();
        }
      }
    }, 3000);
  }

  // Call this after modal opens



  extractVideoId(url: string): string {
    if (!url) return '';

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId && videoId.length === 11) {
        return videoId;
      }
    }

    if (url.includes('youtube.com')) {
      if (url.includes('v=')) {
        const match = url.match(/v=([^&]{11})/);
        if (match && match[1]) {
          return match[1];
        }
      }
    }

    return '';
  }
  loadVideos() {
    this.isInitialLoading = true;
    this.errorMessage = '';

    this.videoService.getPaginatedVideos(this.itemsPerPage, 1).subscribe({
      next: (response: any) => {
        this.isInitialLoading = false;
        if (response && response.status && response.data) {
          this.allVideos = response.data.map((video: any) => ({
            ...video,
            loaded: false
          }));
          this.totalVideos = response.pagination?.total || 0;
          this.totalPages = response.pagination?.totalPages || 0;
          this.applyFilters();
          this.updateHasMoreVideos();
          this.cdRef.detectChanges();
        } else {
          this.errorMessage = 'Failed to load videos. Please try again.';
        }
      },
      error: (error) => {
        this.isInitialLoading = false;
        this.errorMessage = 'Failed to load videos. Please try again.';
        console.error('Error loading videos:', error);
        this.cdRef.detectChanges();
      }
    });
  }

  loadMore() {
    this.isLoading = true;
    const nextPage = this.currentPage + 1;

    this.videoService.getPaginatedVideos(this.itemsPerPage, nextPage).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.status && response.data && response.data.length > 0) {
          const newVideos = response.data.map((video: any) => ({
            ...video,
            loaded: false
          }));

          this.allVideos = [...this.allVideos, ...newVideos];
          this.currentPage = nextPage;
          this.applyFilters();
          this.updateHasMoreVideos();
        } else {
          this.hasMoreVideos = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load more videos. Please try again.';
        console.error('Error loading more videos:', error);
      }
    });
  }

  updateHasMoreVideos() {
    this.hasMoreVideos = this.currentPage < this.totalPages;
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
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    this.filteredVideos = filtered;
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


  // Keyboard navigation for modal
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showVideoModal) {
      switch (event.key) {
        case 'Escape':
          this.closeVideoModal();
          break;
        case 'ArrowRight':
          // Optional: Add navigation to next video
          break;
        case 'ArrowLeft':
          // Optional: Add navigation to previous video
          break;
      }
    }
  }

  // Optional: Navigate to video detail page (if you want to keep this functionality)
  openVideoDetail(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }

}
