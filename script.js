// Rameswaram Yatra Stay - JavaScript Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // Active link highliting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  // Accommodation Category Filter Tabs
  const filterBtns = document.querySelectorAll('.tab-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Room Card Thumbnail Swap & Click
  document.querySelectorAll('.thumb-mini').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      const mainImg = thumb.closest('.room-gallery-wrap').querySelector('.room-gallery-main');
      if (mainImg) {
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt;
      }
    });
  });

  // Lightbox Modal System
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGallery = [];
  let currentIndex = 0;

  // Collect all viewable images
  function initLightbox() {
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find group or build single list
        const group = item.getAttribute('data-lightbox-group') || 'default';
        const groupElements = document.querySelectorAll(`[data-lightbox-group="${group}"]`);
        
        currentGallery = Array.from(groupElements).map(el => ({
          src: el.getAttribute('data-fullsrc') || el.src || el.href,
          caption: el.getAttribute('data-caption') || el.alt || 'Rameswaram Yatra Stay Room Photo'
        }));

        const targetSrc = item.getAttribute('data-fullsrc') || item.src || item.href;
        currentIndex = currentGallery.findIndex(img => img.src === targetSrc);
        if (currentIndex === -1) currentIndex = 0;

        showLightboxImage(currentIndex);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function showLightboxImage(index) {
    if (currentGallery.length === 0) return;
    lightboxImg.src = currentGallery[index].src;
    lightboxCaption.textContent = currentGallery[index].caption;
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      showLightboxImage(currentIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      showLightboxImage(currentIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  initLightbox();

  // Booking WhatsApp Message Generator
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('bookName').value.trim();
      const roomType = document.getElementById('bookRoom').value;
      const guests = document.getElementById('bookGuests').value;
      const checkin = document.getElementById('bookDate').value;
      const notes = document.getElementById('bookNotes').value.trim();

      let message = `Hello Rameswaram Yatra Stay!\nI would like to inquire about booking accommodation.\n\n`;
      if (name) message += `*Name:* ${name}\n`;
      message += `*Room Preference:* ${roomType}\n`;
      message += `*Guests/Group Size:* ${guests}\n`;
      if (checkin) message += `*Check-in Date:* ${checkin}\n`;
      if (notes) message += `*Special Requests:* ${notes}\n`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/91755079513?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    });
  }
});
