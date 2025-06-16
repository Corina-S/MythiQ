// Category Details Page Controller
class CategoryDetailsController {
  constructor() {
    this.currentMythology = 'GREEK';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadMythologyFromURL();
    this.loadMythologyContent();
  }

  setupEventListeners() {
    // Listen for navbar mythology links
    $(document).on('click', '.fullscreen-submenu-link', (e) => {
      const href = $(e.target).attr('href');
      
      // Check if this is a category-details link with hash
      if (href && href.includes('category-details.html#')) {
        // If we're already on category-details page, prevent navigation and just update content
        if (window.location.pathname.includes('category-details.html')) {
          e.preventDefault();
          const mythology = href.split('#')[1].toUpperCase();
          if (mythologyData[mythology]) {
            this.loadMythology(mythology);
            this.closeFullscreenMenu();
          }
        }
        // Otherwise let the normal navigation happen
      } else if (href && href.startsWith('#')) {
        // Handle hash-only links (for when already on the page)
        e.preventDefault();
        const mythology = href.substring(1).toUpperCase();
        if (mythologyData[mythology]) {
          this.loadMythology(mythology);
          this.closeFullscreenMenu();
        }
      }
    });

    // Listen for popstate events (browser back/forward)
    $(window).on('popstate', () => {
      this.loadMythologyFromURL();
      this.loadMythologyContent();
    });
  }

  closeFullscreenMenu() {
    // Close the fullscreen menu if it's open
    $('#fullscreen-menu').removeClass('active');
    $('body').removeClass('menu-open');
  }

  loadMythologyFromURL() {
    const hash = window.location.hash.substring(1).toUpperCase();
    if (hash && mythologyData[hash]) {
      this.currentMythology = hash;
    } else {
      // Set default if no valid hash
      this.currentMythology = 'GREEK';
      window.history.replaceState(null, null, '#greek');
    }
  }

  loadMythology(mythology) {
    if (!mythologyData[mythology]) {
      console.error(`Mythology "${mythology}" not found`);
      return;
    }

    this.currentMythology = mythology;
    
    // Update URL without page reload
    window.history.pushState(null, null, `#${mythology.toLowerCase()}`);
    
    // Update page title
    document.title = `MythiQ - ${mythologyData[mythology].title}`;
    
    this.loadMythologyContent();
  }

  loadMythologyContent() {
    const data = mythologyData[this.currentMythology];
    if (!data) return;

    // Add smooth transition class
    $('#mythology-section').addClass('transitioning');

    // Update image with fade effect
    const $imageElement = $('#mythology-image');
    $imageElement.fadeOut(200, () => {
      $imageElement.attr('src', data.image);
      $imageElement.attr('alt', `${data.title} Illustration`);
      $imageElement.fadeIn(300);
    });

    // Update theme
    this.updateTheme(this.currentMythology.toLowerCase());

    // Update title with typing effect
    this.updateTitleWithEffect(data.title);

    // Update content with fade effect
    const $textContent = $('#mythology-text-content');
    $textContent.fadeOut(200, () => {
      $textContent.empty();
      
      // Add paragraphs with staggered animation
      data.content.forEach((paragraph, index) => {
        const $p = $('<p>')
          .addClass('mythology-description')
          .text(paragraph)
          .css('opacity', '0')
          .css('transform', 'translateY(20px)');
        
        $textContent.append($p);
        
        // Animate each paragraph with delay
        setTimeout(() => {
          $p.animate({
            opacity: 1,
          }, 500).css('transform', 'translateY(0px)');
        }, index * 100);
      });
      
      $textContent.fadeIn(300);
    });

    // Load popular figures for this mythology
    this.loadPopularFigures();

    // Remove transition class after animation
    setTimeout(() => {
      $('#mythology-section').removeClass('transitioning');
    }, 800);
  }

  loadPopularFigures() {
    // Get figures for current mythology
    const figures = figureData.filter(figure => figure.category === this.currentMythology);
    
    if (figures.length === 0) {
      console.warn(`No figures found for mythology: ${this.currentMythology}`);
      $('#popular-figures-section').hide();
      return;
    }

    // Show the section if it was hidden
    $('#popular-figures-section').show();
    
    // Take only first 5 figures
    const popularFigures = figures.slice(0, 5);
    
    // Update section title and subtitle
    const mythologyTitle = mythologyData[this.currentMythology].title;
    const cleanTitle = mythologyTitle.replace(' MYTHOLOGY', '');
    $('#figures-section-title').text(`Popular ${cleanTitle} Figures`);
    $('#figures-section-subtitle').text(`Discover the most iconic deities and heroes from ${mythologyTitle.toLowerCase()}`);
    
    // Clear existing figures
    const $figuresGrid = $('#figures-grid');
    $figuresGrid.fadeOut(200, () => {
      $figuresGrid.empty();
      
      // Add loading state
      $figuresGrid.addClass('loading');
      
      // Create figure cards
      popularFigures.forEach((figure) => {
        const $figureCard = $(`
          <div class="figure-card" style="opacity: 0; transform: translateY(30px);" data-figure="${figure.name}">
            <div class="figure-image-container">
              <img 
                src="assets/images/deities/${figure.image}" 
                alt="${figure.name}"
                class="figure-image"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
              />
              <div class="figure-image-placeholder" style="display: none;">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <h3 class="figure-name">${figure.name}</h3>
          </div>
        `);
        
        // Add click event for potential future interactions
        $figureCard.on('click', () => {
          console.log(`Clicked on ${figure.name}`);
          // Navigate to deity details page
          const url = `deity-details.html?deity=${encodeURIComponent(figure.name)}&category=${encodeURIComponent(figure.category)}`;
          window.location.href = url;
        });
        
        $figuresGrid.append($figureCard);
      });
      
      // Show grid and animate cards
      $figuresGrid.fadeIn(300, () => {
        popularFigures.forEach((figure, index) => {
          const $card = $(`.figure-card[data-figure="${figure.name}"]`);
          setTimeout(() => {
            $card.css({
              'opacity': '1',
              'transform': 'translateY(0)',
              'transition': 'all 0.5s ease'
            });
          }, index * 150);
        });
      });
      
      // Remove loading state after all animations
      setTimeout(() => {
        $figuresGrid.removeClass('loading');
      }, popularFigures.length * 150 + 500);
    });
  }

  updateTheme(mythology) {
    const $section = $('#mythology-section');
    const $figuresSection = $('#popular-figures-section');
    
    // Remove all existing theme classes
    const themeClasses = 'greek-theme roman-theme norse-theme egyptian-theme japanese-theme celtic-theme aztec-theme chinese-theme';
    $section.removeClass(themeClasses);
    $figuresSection.removeClass(themeClasses);
    
    // Add new theme class
    const themeClass = `${mythology}-theme`;
    $section.addClass(themeClass);
    $figuresSection.addClass(themeClass);
  }

  updateTitleWithEffect(title) {
    const $title = $('#mythology-title');
    
    // Fade out current title
    $title.fadeOut(200, () => {
      $title.text(title);
      
      // Typing effect
      const text = title;
      $title.text('').show();
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          $title.text($title.text() + text.charAt(i));
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      
      typeWriter();
    });
  }

  // Method to load specific mythology (can be called externally)
  static loadMythology(mythology) {
    if (window.categoryController) {
      window.categoryController.loadMythology(mythology);
    }
  }
}

// Initialize when DOM is ready
$(document).ready(() => {
  // Only initialize if we're on the category details page
  if ($('#mythology-section').length > 0) {
    window.categoryController = new CategoryDetailsController();
  }
});

// Smooth scrolling for anchor links
$(document).ready(() => {
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80 // Account for fixed navbar
      }, 800);
    }
  });
});
