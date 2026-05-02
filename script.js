/* script.js */

// 1. Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('show');
  }
});

// 2. Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// 3. Highlight Active Nav Link on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// 4. Statistics Counter Animation
const counters = document.querySelectorAll('.stat-num');
let hasCounted = false;

function countUp() {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const c = +counter.innerText;
    const increment = target / 50;

    if (c < target) {
      counter.innerText = Math.ceil(c + increment);
      setTimeout(countUp, 40);
    } else {
      counter.innerText = target;
    }
  });
}

// Trigger counter when in view
const heroStats = document.querySelector('.hero-stats');
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !hasCounted) {
    countUp();
    hasCounted = true;
  }
}, { threshold: 0.5 });

if (heroStats) observer.observe(heroStats);

// 5. Filtering logic for Services and Portfolio
function setupFiltering(filterContainerId, gridId, itemClass) {
  const filterBtns = document.querySelectorAll(`#${filterContainerId} .filter-btn`);
  const items = document.querySelectorAll(`#${gridId} .${itemClass}`);

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-cat') === filterValue) {
          item.style.display = 'block';
          // Slight delay for animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

setupFiltering('serviceFilter', 'servicesGrid', 'service-card');
setupFiltering('portfolioFilter', 'portfolioGrid', 'portfolio-card');


// 6. Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
let currentPortfolioItems = [];
let currentIndex = 0;

// Collect all currently visible portfolio items
function updatePortfolioItems() {
  currentPortfolioItems = Array.from(document.querySelectorAll('.portfolio-card')).filter(item => {
    return window.getComputedStyle(item).display !== 'none';
  });
}

// Expose openLightbox to global scope for inline onclick handler
window.openLightbox = function(btnElement) {
  updatePortfolioItems();
  const card = btnElement.closest('.portfolio-card');
  currentIndex = currentPortfolioItems.indexOf(card);
  showLightboxItem(currentIndex);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

window.closeLightbox = function() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
}

window.shiftLightbox = function(direction) {
  currentIndex += direction;
  if (currentIndex < 0) {
    currentIndex = currentPortfolioItems.length - 1;
  } else if (currentIndex >= currentPortfolioItems.length) {
    currentIndex = 0;
  }
  showLightboxItem(currentIndex);
}

function showLightboxItem(index) {
  if (currentPortfolioItems.length === 0) return;
  
  const item = currentPortfolioItems[index];
  const title = item.getAttribute('data-title');
  const desc = item.getAttribute('data-desc');
  const tagsStr = item.getAttribute('data-tags');
  const tag = item.querySelector('.portfolio-tag').innerText;
  
  const techs = tagsStr.split(',').map(t => `<span class="lb-tech">${t.trim()}</span>`).join('');

  lightboxContent.innerHTML = `
    <div class="lb-content-wrapper animate-fade-in">
      <span class="lb-tag">${tag}</span>
      <h3 class="lb-title">${title}</h3>
      <p class="lb-desc">${desc}</p>
      <div class="lb-techs">
        ${techs}
      </div>
      <a href="#contact" class="btn-primary" onclick="closeLightbox()">Inquire About This Project</a>
    </div>
  `;
}

// 7. Form Submission Handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
      formSuccess.style.display = 'flex';
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1500);
  });
}
