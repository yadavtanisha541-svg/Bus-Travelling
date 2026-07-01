document.addEventListener('DOMContentLoaded', () => {
  
  // --- PRELOADER ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
    // Fallback if load takes too long
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 3000);
  }

  // --- CUSTOM CURSOR ---
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth follower movement
    setInterval(() => {
      posX += (mouseX - posX) / 8;
      posY += (mouseY - posY) / 8;
      follower.style.left = posX + 'px';
      follower.style.top = posY + 'px';
    }, 10);

    // Hover states
    const hoverables = document.querySelectorAll('a, button, .btn-filter, .seat-box, .gallery-item, .faq-header');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.backgroundColor = '#2563eb';
        follower.style.width = '50px';
        follower.style.height = '50px';
        follower.style.borderColor = '#f97316';
      });
      item.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.backgroundColor = '#f97316';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = '#2563eb';
      });
    });
  }

  // --- SCROLL PROGRESS & STICKY NAVBAR & BACK-TO-TOP ---
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.btn-floating-top');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Sticky navbar
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }

    // Back to top button
    if (window.scrollY > 400) {
      if (backToTop) backToTop.classList.add('show');
    } else {
      if (backToTop) backToTop.classList.remove('show');
    }
  });

  // Back to top click handler
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- STATS COUNTER ANIMATION ---
  const counterSection = document.querySelector('.counter-section');
  if (counterSection && typeof gsap !== 'undefined') {
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          const counters = document.querySelectorAll('.counter-val');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let countObj = { val: 0 };
            gsap.to(countObj, {
              val: target,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function () {
                counter.innerText = Math.ceil(countObj.val);
              }
            });
          });
        }
      });
    }, { threshold: 0.3 });
    observer.observe(counterSection);
  } else if (counterSection) {
    // Fallback counter logic without GSAP
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          const counters = document.querySelectorAll('.counter-val');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const updateCounter = () => {
              const increment = target / 50;
              if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCounter, 30);
              } else {
                counter.innerText = target;
              }
            };
            updateCounter();
          });
        }
      });
    }, { threshold: 0.3 });
    observer.observe(counterSection);
  }

  // --- SWIPER SLIDERS INITIALIZATION ---
  // Offers Slider
  if (document.querySelector('.offers-slider') && typeof Swiper !== 'undefined') {
    new Swiper('.offers-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        }
      }
    });
  }

  // Testimonials Slider
  if (document.querySelector('.testimonials-slider') && typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        }
      }
    });
  }

  // --- FAQ ACCORDION ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      
      // Close other active questions
      const activeItems = document.querySelectorAll('.faq-item.active');
      activeItems.forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          activeItem.querySelector('.faq-body').style.maxHeight = '0';
        }
      });

      // Toggle current question
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- NEWSLETTER SUBSCRIPTION ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        // Show mock confirmation alert
        alert(`Thank you for subscribing! Offers will be sent to: ${emailInput.value.trim()}`);
        emailInput.value = '';
      }
    });
  }

  // --- AOS ANIMATIONS ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
});
