import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FrontendService} from "../services/frontend.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit{
  news: any;
  currentIndex = 0;
  relatedNews:any=[];
  currentVideoIndex = 0;

  showThumbnail = false;
  constructor(private service: FrontendService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    this.viewNews();
  }
  private setCanonicalUrl(slug: string) {
    const canonicalUrl = `https://api.asianechoes.com/api/news-meta/${slug}`;

    // Remove existing canonical
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }

    // Add canonical pointing to meta URL
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonicalUrl;
    document.head.appendChild(link);
  }
  viewNews() {
    this.route.params.subscribe((params) => {
      const slug = params['slug']; // keep as string
      if (slug) {
        this.setCanonicalUrl(slug);
        this.service.getNewsBySlug(slug).subscribe((response: any) => {
          console.log(response);
          this.news = response.data;
          this.getNewsByRelated(this.news.id);
        });
      }
    });
  }
  getNewsByRelated(id:any){
    this.service.getNewsByRelated(id).subscribe((response: any) => {
      this.relatedNews = response.data;
    });
  }
  prev() {
    this.currentIndex =
      this.currentIndex === 0 ? this.news.galleries.length - 1 : this.currentIndex - 1;
  }

  next() {
    this.currentIndex =
      this.currentIndex === this.news.galleries.length - 1 ? 0 : this.currentIndex + 1;
  }


  prevVideo() {
    this.currentVideoIndex = this.currentVideoIndex > 0 ? this.currentVideoIndex - 1 : this.news.videos.length - 1;
    this.showThumbnail = false;
  }

  // nextVideo() {
  //   this.currentVideoIndex = this.currentVideoIndex < this.news.videos.length - 1 ? this.currentVideoIndex + 1 : 0;
  //   this.showThumbnail = false;
  // }

  // Extracts video ID from YouTube URL
  extractVideoId(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
    return match ? match[1] : '';
  }

  // Generates safe embed URL for iframe
  getSafeEmbedUrl(url: string): SafeResourceUrl {
    const id = this.extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
  }

  // Called if iframe cannot play (embedding disabled)
  onVideoError() {
    this.showThumbnail = true;
  }

  // getSafeVideoUrl(videoId: string): SafeResourceUrl {
  //   const url = `https://www.youtube.com/embed/${videoId}`;
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Navigation for image gallery
  nextImage() {
    if (this.news.images && this.news.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.news.images.length;
    }
  }

  previousImage() {
    if (this.news.images && this.news.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.news.images.length) % this.news.images.length;
    }
  }

  // Navigation for videos
  nextVideo() {
    if (this.news.videos && this.news.videos.length > 0) {
      this.currentVideoIndex = (this.currentVideoIndex + 1) % this.news.videos.length;
    }
  }

  previousVideo() {
    if (this.news.videos && this.news.videos.length > 0) {
      this.currentVideoIndex = (this.currentVideoIndex - 1 + this.news.videos.length) % this.news.videos.length;
    }
  }

  // Share functionality
  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank');
  }

  shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.news.title);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, '_blank');
  }

  shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank');
  }

  // Copy link to clipboard
  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // You can add a toast notification here
      alert('Link copied to clipboard!');
    });
  }

  // Get category color
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'POLITICS': 'bg-red-600',
      'CRICKET': 'bg-green-600',
      'FOOTBALL': 'bg-blue-600',
      'ATHLETICS': 'bg-purple-600',
      'HOCKEY': 'bg-yellow-600',
      'INTERNATIONAL': 'bg-indigo-600',
      'BUSINESS': 'bg-emerald-600',
      'TECHNOLOGY': 'bg-cyan-600',
      'ENTERTAINMENT': 'bg-pink-600',
      'OPINION': 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate reading time
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }


}
