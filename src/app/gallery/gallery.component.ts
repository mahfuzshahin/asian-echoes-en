import {Component, HostListener, OnInit} from '@angular/core';
import {FrontendService} from "../services/frontend.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit{
  allPhotos: any[] = [];
  filteredPhotos: any[] = [];
  displayedPhotos: any[] = [];

  categories: string[] = [];
  searchQuery = '';
  activeFilter = 'all';
  viewMode: 'grid' | 'masonry' = 'grid';

  // Lightbox
  showLightbox = false;
  currentLightboxIndex = 0;

  // Pagination & Loading
  currentPage = 1;
  itemsPerPage = 8; // Load 4 photos each time
  hasMorePhotos = true;
  isLoading = false;
  isInitialLoading = true;
  totalPhotos = 0;
  errorMessage = '';

  constructor(private photoService: FrontendService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.isInitialLoading = true;
    this.errorMessage = '';

    this.photoService.getPaginatedGalleries(this.itemsPerPage, 1).subscribe({
      next: (response: any) => {
        this.isInitialLoading = false;
        if (response && response.data) {
          this.allPhotos = response.data.map((photo: any) => ({
            ...photo,
            loaded: false
          }));
          this.totalPhotos = response.total || 10; // Assuming total 10 photos from API
          this.extractCategories();
          this.applyFilters();
          this.updateHasMorePhotos();
        }
      },
      error: (error) => {
        this.isInitialLoading = false;
        this.errorMessage = 'Failed to load photos. Please try again.';
        console.error('Error loading photos:', error);
        this.loadSamplePhotos();
      }
    });
  }

  loadMore() {
    this.isLoading = true;
    const nextPage = this.currentPage + 1;

    this.photoService.getPaginatedGalleries(this.itemsPerPage, nextPage).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.data && response.data.length > 0) {
          const newPhotos = response.data.map((photo: any) => ({
            ...photo,
            loaded: false
          }));

          // Add new photos to existing ones
          this.allPhotos = [...this.allPhotos, ...newPhotos];
          this.currentPage = nextPage;
          this.extractCategories();
          this.applyFilters();
          this.updateHasMorePhotos();
        } else {
          this.hasMorePhotos = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load more photos. Please try again.';
        console.error('Error loading more photos:', error);
      }
    });
  }

  updateHasMorePhotos() {
    // Check if we have loaded all available photos
    this.hasMorePhotos = this.allPhotos.length < this.totalPhotos;
  }

  loadSamplePhotos() {
    // Sample data with 10 photos
    this.allPhotos = [
      {
        id: 1,
        title: 'Economic Summit 2024',
        caption: 'World leaders gather for the annual economic summit to discuss global financial policies.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo1.jpg'
        },
        category: 'Events',
        createdAt: new Date('2024-01-15'),
        loaded: false
      },
      {
        id: 2,
        title: 'City Development Project',
        caption: 'New infrastructure project aims to transform urban transportation and reduce congestion.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo2.jpg'
        },
        category: 'Infrastructure',
        createdAt: new Date('2024-01-14'),
        loaded: false
      },
      {
        id: 3,
        title: 'Cultural Festival',
        caption: 'Annual cultural festival celebrates diversity with traditional performances and art exhibitions.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo3.jpg'
        },
        category: 'Culture',
        createdAt: new Date('2024-01-13'),
        loaded: false
      },
      {
        id: 4,
        title: 'Sports Championship',
        caption: 'National sports championship finals with athletes from across the country.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo4.jpg'
        },
        category: 'Sports',
        createdAt: new Date('2024-01-12'),
        loaded: false
      },
      {
        id: 5,
        title: 'Technology Conference',
        caption: 'Latest innovations showcased at the annual technology conference.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo5.jpg'
        },
        category: 'Technology',
        createdAt: new Date('2024-01-11'),
        loaded: false
      },
      {
        id: 6,
        title: 'Environmental Awareness',
        caption: 'Community event focused on environmental conservation and sustainability.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo6.jpg'
        },
        category: 'Environment',
        createdAt: new Date('2024-01-10'),
        loaded: false
      },
      {
        id: 7,
        title: 'Healthcare Symposium',
        caption: 'Medical professionals discuss advancements in healthcare technology.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo7.jpg'
        },
        category: 'Healthcare',
        createdAt: new Date('2024-01-09'),
        loaded: false
      },
      {
        id: 8,
        title: 'Education Fair',
        caption: 'Annual education fair connecting students with universities and colleges.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo8.jpg'
        },
        category: 'Education',
        createdAt: new Date('2024-01-08'),
        loaded: false
      },
      {
        id: 9,
        title: 'Business Networking',
        caption: 'Entrepreneurs and business leaders network at the annual business event.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo9.jpg'
        },
        category: 'Business',
        createdAt: new Date('2024-01-07'),
        loaded: false
      },
      {
        id: 10,
        title: 'Art Exhibition',
        caption: 'Contemporary art exhibition featuring local and international artists.',
        attachment: {
          fileUrl: 'http://localhost:3000/uploads/photo10.jpg'
        },
        category: 'Art',
        createdAt: new Date('2024-01-06'),
        loaded: false
      }
    ];
    this.totalPhotos = this.allPhotos.length;

    // Initially show only first 4 photos
    const initialPhotos = this.allPhotos.slice(0, this.itemsPerPage);
    this.allPhotos = initialPhotos.map(photo => ({...photo, loaded: false}));

    this.extractCategories();
    this.applyFilters();
    this.updateHasMorePhotos();
  }

  extractCategories() {
    const categories = new Set(this.allPhotos.map(photo => photo.category).filter(Boolean));
    this.categories = Array.from(categories);
  }

  applyFilters() {
    let filtered = [...this.allPhotos];

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(photo => photo.category === this.activeFilter);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(query) ||
        (photo.caption && photo.caption.toLowerCase().includes(query)) ||
        (photo.category && photo.category.toLowerCase().includes(query))
      );
    }

    this.filteredPhotos = filtered;
    this.displayedPhotos = this.filteredPhotos;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'masonry') {
    this.viewMode = mode;
  }

  onSearch() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  onImageLoad(photo: any) {
    photo.loaded = true;
  }

  openLightbox(index: number) {
    this.currentLightboxIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.showLightbox = false;
    document.body.style.overflow = 'auto';
  }

  nextPhoto() {
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.filteredPhotos.length;
  }

  previousPhoto() {
    this.currentLightboxIndex = this.currentLightboxIndex === 0
      ? this.filteredPhotos.length - 1
      : this.currentLightboxIndex - 1;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showLightbox) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.nextPhoto();
        break;
      case 'ArrowLeft':
        this.previousPhoto();
        break;
    }
  }
}
