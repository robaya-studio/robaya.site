// Screenshot Gallery Component
// Usage: Add data-gallery="folder-path" to the screenshots-container
// Example: <div class="screenshots-grid" data-gallery="locales/screenshots/">
// Options: data-pattern (file name stem, default 0x0ss; empty with data-ext gives 1.jpg, 2.jpg, …),
// data-count, data-ext (default png), data-lang-folders — files live in <folder><lang>/ and are
// swapped when the site language changes (robaya:languagechange from lang.js).

class ScreenshotGallery {
  constructor() {
    this.init();
  }

  init() {
    // Create lightbox HTML
    this.createLightbox();
    
    // Initialize all galleries
    const galleries = document.querySelectorAll('[data-gallery]');
    galleries.forEach(gallery => this.initGallery(gallery));
  }

  createLightbox() {
    // Check if lightbox already exists
    if (document.getElementById('lightbox')) return;

    const lightboxHTML = `
      <div id="lightbox">
        <span id="lightbox-close">×</span>
        <button id="lightbox-prev" class="lightbox-nav">‹</button>
        <div class="lightbox-content">
          <img src="" alt="Screenshot">
          <div class="lightbox-counter">
            <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
          </div>
        </div>
        <button id="lightbox-next" class="lightbox-nav">›</button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    this.initLightbox();
  }

  initGallery(container) {
    const baseFolder = container.getAttribute('data-gallery');
    const byLanguage = container.hasAttribute('data-lang-folders');
    const ext = container.getAttribute('data-ext') || 'png';
    const folderFor = (lang) => (byLanguage ? `${baseFolder}${lang}/` : baseFolder);
    const folderPath = folderFor(document.documentElement.lang || 'en');
    const screenshotPattern = container.hasAttribute('data-pattern')
      ? container.getAttribute('data-pattern')
      : '0x0ss';
    const startIndex = 1;
    const screenshotCount = parseInt(container.getAttribute('data-count')) || 9;
    
    // Find existing carousel or create one
    let carousel = container.querySelector('.screenshots-carousel');
    if (!carousel) {
      carousel = document.createElement('div');
      carousel.className = 'screenshots-carousel';
      container.appendChild(carousel);
    }

    // Create and insert arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'carousel-arrow carousel-arrow-prev';
    prevArrow.innerHTML = '‹';
    prevArrow.setAttribute('aria-label', 'Previous');
    
    const nextArrow = document.createElement('button');
    nextArrow.className = 'carousel-arrow carousel-arrow-next';
    nextArrow.innerHTML = '›';
    nextArrow.setAttribute('aria-label', 'Next');
    
    container.insertBefore(prevArrow, carousel);
    container.appendChild(nextArrow);

    // Clear existing items
    carousel.innerHTML = '';

    // Generate screenshot items
    for (let i = 0; i < screenshotCount; i++) {
      const index = startIndex + i;
      let filename;
      
      if (startIndex === 0) {
        // Standard pattern: 0x0ss.png, 0x0ss-2.png, 0x0ss-3.png, etc.
        filename = i === 0 ? `${screenshotPattern}.png` : `${screenshotPattern}-${i + 1}.png`;
      } else if (screenshotPattern === '') {
        // Bare numbers: 1.jpg, 2.jpg, …
        filename = `${index}.${ext}`;
      } else {
        // Custom start index: 0x0ss-10.png, 0x0ss-11.png, etc.
        filename = `${screenshotPattern}-${index}.${ext}`;
      }
      
      const screenshotItem = document.createElement('div');
      screenshotItem.className = 'screenshot-item';
      screenshotItem.innerHTML = `<img src="${folderPath}${filename}" alt="Game Screenshot ${i + 1}" data-screenshot="${filename}">`;
      carousel.appendChild(screenshotItem);
    }

    // Language folders: the lightbox reads the same <img> elements, so swapping their src is enough
    if (byLanguage) {
      document.addEventListener('robaya:languagechange', (e) => {
        const folder = folderFor(e.detail.lang);
        carousel.querySelectorAll('img[data-screenshot]').forEach((img) => {
          img.src = folder + img.getAttribute('data-screenshot');
        });
      });
    }

    // Initialize screenshot click handlers
    this.initScreenshots(carousel);
    
    // Initialize carousel scroll with arrows
    this.initCarouselScroll(carousel, prevArrow, nextArrow);
  }
  
  initCarouselScroll(carousel, prevArrow, nextArrow) {
    const getScrollAmount = () => {
      const firstItem = carousel.querySelector('.screenshot-item');
      if (firstItem) {
        return firstItem.offsetWidth + 16; // item width + gap (1rem)
      }
      return 320; // fallback
    };
    
    const updateArrowVisibility = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      
      if (carousel.scrollLeft <= 10) {
        prevArrow.style.opacity = '0.3';
        prevArrow.style.pointerEvents = 'none';
      } else {
        prevArrow.style.opacity = '1';
        prevArrow.style.pointerEvents = 'auto';
      }
      
      if (carousel.scrollLeft >= maxScroll - 10) {
        nextArrow.style.opacity = '0.3';
        nextArrow.style.pointerEvents = 'none';
      } else {
        nextArrow.style.opacity = '1';
        nextArrow.style.pointerEvents = 'auto';
      }
    };
    
    prevArrow.addEventListener('click', () => {
      carousel.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
      });
    });
    
    nextArrow.addEventListener('click', () => {
      carousel.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
      });
    });
    
    // Update arrows on scroll
    carousel.addEventListener('scroll', updateArrowVisibility);
    
    // Initial check
    setTimeout(updateArrowVisibility, 100);
    
    // Check on resize
    window.addEventListener('resize', updateArrowVisibility);
  }

  initScreenshots(carousel) {
    const screenshots = carousel.querySelectorAll('.screenshot-item img');
    
    screenshots.forEach((img) => {
      img.addEventListener('click', () => {
        this.openLightbox(screenshots, img);
      });
    });
  }

  initLightbox() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = this.lightbox.querySelector('img');
    this.lightboxClose = document.getElementById('lightbox-close');
    this.lightboxPrev = document.getElementById('lightbox-prev');
    this.lightboxNext = document.getElementById('lightbox-next');
    this.lightboxCurrent = document.getElementById('lightbox-current');
    this.lightboxTotal = document.getElementById('lightbox-total');
    
    this.currentImageIndex = 0;
    this.imagesArray = [];

    this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPrevImage();
    });
    this.lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showNextImage();
    });

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.showPrevImage();
      } else if (e.key === 'ArrowRight') {
        this.showNextImage();
      }
    });
  }

  openLightbox(images, clickedImage) {
    this.imagesArray = Array.from(images);
    this.currentImageIndex = this.imagesArray.indexOf(clickedImage);
    
    this.lightboxTotal.textContent = this.imagesArray.length;
    this.updateLightbox();
    
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  updateLightbox() {
    this.lightboxImg.src = this.imagesArray[this.currentImageIndex].src;
    this.lightboxCurrent.textContent = this.currentImageIndex + 1;
  }

  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imagesArray.length;
    this.updateLightbox();
  }

  showPrevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.imagesArray.length) % this.imagesArray.length;
    this.updateLightbox();
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize the gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScreenshotGallery();
});

