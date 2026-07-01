document.addEventListener('DOMContentLoaded', () => {
  // --- MASONRY GRID CATEGORY FILTERING ---
  const filterButtons = document.querySelectorAll('.btn-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from other buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            // Trigger a quick scale reveal
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- CUSTOM LIGHTBOX POPUP ---
  const lightbox = document.getElementById('lightboxModal');
  const lightboxContent = document.getElementById('lightboxMediaContainer');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentItemsArray = [];
  let currentIndex = 0;

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // Collect currently visible items in the filtered grid
        currentItemsArray = Array.from(galleryItems).filter(i => i.style.display !== 'none');
        currentIndex = currentItemsArray.indexOf(item);
        
        openLightbox(item);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on click outside media container
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('row') || e.target.classList.contains('col-12')) {
        closeLightbox();
      }
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevMedia();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextMedia();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevMedia();
        if (e.key === 'ArrowRight') showNextMedia();
      }
    });
  }

  function openLightbox(item) {
    lightbox.classList.add('show');
    loadMedia(item);
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    if (lightboxContent) {
      lightboxContent.innerHTML = ''; // Clear video or images
    }
  }

  function loadMedia(item) {
    if (!lightboxContent) return;

    lightboxContent.innerHTML = '';
    const img = item.querySelector('img');
    const isVideo = item.classList.contains('video-item');

    if (isVideo) {
      // Create video element
      const videoSrc = item.getAttribute('data-video-src') || 'https://www.w3schools.com/html/mov_bbb.mp4';
      const video = document.createElement('video');
      video.src = videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.className = 'img-fluid';
      lightboxContent.appendChild(video);
    } else if (img) {
      // Create image element
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt || 'Shree Balaji Travels';
      image.className = 'img-fluid';
      lightboxContent.appendChild(image);
    }
  }

  function showPrevMedia() {
    if (currentItemsArray.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentItemsArray.length) % currentItemsArray.length;
    loadMedia(currentItemsArray[currentIndex]);
  }

  function showNextMedia() {
    if (currentItemsArray.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentItemsArray.length;
    loadMedia(currentItemsArray[currentIndex]);
  }
});
