import {Component, OnInit} from '@angular/core';
import {FrontendService} from "../services/frontend.service";
import {Input} from "postcss";
import {NewsService} from "../services/news.service";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css'
})
export class CategorySectionComponent implements OnInit{
  slug: string = '';
  categoryName: string = '';

  mainNews: any | null = null;
  otherNews: any[] = [];
  loading = false;
  isLoadingMore = false;
  currentPage = 1;
  totalPages = 1;
  limit = 2;
  hasMoreNews = true;
  totalArticles = 0;

  constructor(
    private newsService: FrontendService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      this.categoryName = this.formatCategoryName(this.slug);

      // Reset state when slug changes
      this.resetState();
      this.loadNews(1);
    });
  }

  resetState(): void {
    this.mainNews = null;
    this.otherNews = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.hasMoreNews = true;
    this.totalArticles = 0;
  }

  loadNews(page: number = 1): void {
    if (page === 1) {
      this.loading = true;
    } else {
      this.isLoadingMore = true;
    }

    console.log('Loading page:', page, 'Current totalPages:', this.totalPages);

    this.newsService.getCategorySectionPaginated(this.slug, page, this.limit)
      .subscribe((res: any) => {
        if (res.status && res.data) {
          console.log('API Response:', res.data);

          // Set main news only on first page load
          if (page === 1 && res.data.mainNews) {
            this.mainNews = res.data.mainNews;
          }

          // Handle other news
          const newOtherNews = res.data.otherNews || [];

          if (page === 1) {
            this.otherNews = newOtherNews;
          } else {
            // Append new news to existing list for pagination
            this.otherNews = [...this.otherNews, ...newOtherNews];
          }

          // Update pagination info from API response
          this.currentPage = page;
          this.totalPages = res.data.totalPages || 1;
          this.totalArticles = res.data.totalArticles || (this.otherNews.length + (this.mainNews ? 1 : 0));

          // Calculate if there are more pages to load
          // hasMoreNews should be true if current page is less than total pages
          // AND if we actually received some news items (in case of last page having fewer items)
          this.hasMoreNews = this.currentPage < this.totalPages && newOtherNews.length > 0;

          console.log('After loading - Page:', this.currentPage,
            'Total Pages:', this.totalPages,
            'Has More:', this.hasMoreNews,
            'New items:', newOtherNews.length);
        } else {
          console.error('API Error:', res.message);
          this.hasMoreNews = false;
        }

        this.loading = false;
        this.isLoadingMore = false;
      }, err => {
        console.error('HTTP Error:', err);
        this.loading = false;
        this.isLoadingMore = false;
        this.hasMoreNews = false;
      });
  }

  loadMore(): void {
    if (this.hasMoreNews && !this.isLoadingMore && !this.loading) {
      const nextPage = this.currentPage + 1;
      console.log('Loading more - Current Page:', this.currentPage, 'Next Page:', nextPage, 'Total Pages:', this.totalPages);
      this.loadNews(nextPage);
    } else {
      console.log('Cannot load more. Status:', {
        hasMore: this.hasMoreNews,
        isLoadingMore: this.isLoadingMore,
        loading: this.loading,
        currentPage: this.currentPage,
        totalPages: this.totalPages
      });
    }
  }

  getTotalArticlesLoaded(): number {
    return this.otherNews.length + (this.mainNews ? 1 : 0);
  }

  getRemainingPages(): number {
    return Math.max(0, this.totalPages - this.currentPage);
  }

  formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getReadTime(content: string = ''): string {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }
  getPlainText(html: string): string {
    if (!html) return '';
    // Remove all image tags
    html = html.replace(/<img[^>]*>/g, '');
    // Remove all other HTML tags
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 250); // limit to 250 chars
  }
}
