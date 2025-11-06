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

  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  hasMorePhotos = true;

  constructor(private photoService: FrontendService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.getLatestNewsGallery().subscribe({
      next: (photos) => {
        this.allPhotos = photos.map((photo:any) => ({
          ...photo,
          loaded: false
        }));
        this.extractCategories();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading photos:', error);
        this.loadSamplePhotos();
      }
    });
  }

  loadSamplePhotos() {
    this.allPhotos = [
      {
        id: 1,
        title: 'Economic Summit 2024',
        caption: 'World leaders gather for the annual economic summit to discuss global financial policies and future collaborations.',
        fileUrl: 'http://localhost:3000/uploads/1760124008418-535099395.jpg',
        category: 'Events',
        createdAt: new Date('2024-01-15'),
        loaded: false
      },
      {
        id: 2,
        title: 'City Development Project',
        caption: 'New infrastructure project aims to transform urban transportation and reduce congestion.',
        fileUrl: 'http://localhost:3000/uploads/photo2.jpg',
        category: 'Infrastructure',
        createdAt: new Date('2024-01-14'),
        loaded: false
      },
      {
        id: 3,
        title: 'Cultural Festival',
        caption: 'Annual cultural festival celebrates diversity with traditional performances and art exhibitions.',
        fileUrl: 'http://localhost:3000/uploads/photo3.jpg',
        category: 'Culture',
        createdAt: new Date('2024-01-13'),
        loaded: false
      },
      // Add more sample photos...
    ];
    this.extractCategories();
    this.applyFilters();
  }

  extractCategories() {
    const categories = new Set(this.allPhotos.map(photo => photo.category).filter(Boolean));
    this.categories = Array.from(categories);
  }

  applyFilters() {
    let filtered = [...this.allPhotos];

    // Apply category filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(photo => photo.category === this.activeFilter);
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(query) ||
        (photo.caption && photo.caption.toLowerCase().includes(query)) ||
        (photo.category && photo.category.toLowerCase().includes(query))
      );
    }

    this.filteredPhotos = filtered;
    this.currentPage = 1;
    this.displayedPhotos = this.filteredPhotos.slice(0, this.itemsPerPage);
    this.hasMorePhotos = this.displayedPhotos.length < this.filteredPhotos.length;
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

  loadMore() {
    this.currentPage++;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newPhotos = this.filteredPhotos.slice(startIndex, endIndex);

    this.displayedPhotos = [...this.displayedPhotos, ...newPhotos];
    this.hasMorePhotos = this.displayedPhotos.length < this.filteredPhotos.length;
  }

  onImageLoad(photo: any) {
    photo.loaded = true;
  }

  // Lightbox Methods
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

  // Keyboard navigation for lightbox
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
