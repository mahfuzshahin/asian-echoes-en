import {Component, OnInit} from '@angular/core';
import {AuthorService} from "../services/author.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent implements OnInit{
  author: any | null = null;
  authorNews: any[] = [];
  loading = false;
  isLoadingMore = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 8;
  hasMoreNews = true;
  totalArticles = 0;

  constructor(
    private service: AuthorService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.viewAuthor();
  }

  viewAuthor() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadAuthorNews(id, 1);
      }
    });
  }

  loadAuthorNews(authorId: string, page: number = 1): void {
    if (page === 1) {
      this.loading = true;
    } else {
      this.isLoadingMore = true;
    }

    this.service.getAuthorPagination(authorId, this.itemsPerPage, page)
      .subscribe((response: any) => {
        if (response.status) {
          // Set author information (only on first load)
          if (page === 1) {
            this.author = response.author;
          }

          // Handle news data
          const newNews = response.data || [];

          if (page === 1) {
            this.authorNews = newNews;
          } else {
            this.authorNews = [...this.authorNews, ...newNews];
          }

          // Update pagination info
          this.currentPage = parseInt(response.pagination.page) || page;
          this.totalPages = response.pagination.totalPages || 1;
          this.totalArticles = response.pagination.total || 0;

          // Calculate if there are more pages to load
          this.hasMoreNews = this.currentPage < this.totalPages;

          console.log('Author News Loaded:', {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            hasMore: this.hasMoreNews,
            totalArticles: this.totalArticles,
            newItems: newNews.length
          });
        }

        this.loading = false;
        this.isLoadingMore = false;
      }, error => {
        console.error('Error loading author news:', error);
        this.loading = false;
        this.isLoadingMore = false;
        this.hasMoreNews = false;
      });
  }

  loadMore(): void {
    if (this.hasMoreNews && !this.isLoadingMore && !this.loading && this.author) {
      const nextPage = this.currentPage + 1;
      this.loadAuthorNews(this.author.id.toString(), nextPage);
    }
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Recently';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getReadTime(content: string = ''): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  getDefaultImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhl/aWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCAxMzYuNTY5IDIzMCAxMjBDMjMwIDEwMy40MzEgMjE2LjU2OSA5MCAyMDAgOTBDMTgzLjQzMSA5MCAxNzAgMTAzLjQzMSAxNzAgMTIwQzE3MCAxMzYuNTY5IDE4My40MzEgMTUwIDIwMCAxNTBaTTIwMCAxNzBDMTY1LjUgMTcwIDEzNSAxODcuNSAxMzUgMjEwVjIzMEgyNjVWMjEwQzI2NSAxODcuNSAyMzQuNSAxNzAgMjAwIDE3MFoiIGZpbGw9IiM5Q0EwQUIiLz4KPC9zdmc+';
  }
}
