// Figures Page Generator - Manages the figures.html page
class FiguresPageGenerator {
  constructor() {
    this.categoryOrder = ["GREEK", "ROMAN", "NORSE", "EGYPTIAN", "JAPANESE", "CELTIC", "AZTEC"];
    this.allFigures = this.organizeFiguresByMythology();
    this.searchTerm = "";
    this.init();
  }

  init() {
    // Check if we're on the figures page
    if (!$("#figures-content").length) {
      return;
    }
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.generateAllFigures();
      this.setupSearch();
    }, 100);
  }

  organizeFiguresByMythology() {
    if (typeof figureData === "undefined") {
      return {};
    }

    const organized = {};
    this.categoryOrder.forEach((category) => {
      organized[category] = figureData.filter((figure) => figure.category === category);
    });
    return organized;
  }

  generateAllFigures() {
    // Clear existing content
    $(".mythology-section, .no-results-message, .expand-divider, .hidden-mythologies").remove();

    const $figuresContainer = $("#figures-content");
    let totalAnimationDelay = 0;

    // If searching, show filtered results from all mythologies
    if (this.searchTerm) {
      this.generateSearchResults($figuresContainer);
      return;
    }

    // Generate first 3 mythologies (always visible)
    const visibleMythologies = this.categoryOrder.slice(0, 3);
    const hiddenMythologies = this.categoryOrder.slice(3);

    // Generate sections for visible mythologies
    visibleMythologies.forEach((mythology, mythologyIndex) => {
      const figures = this.allFigures[mythology] || [];
      if (figures.length === 0) return;

      // Create mythology section
      const $mythologySection = this.createMythologySection(mythology, figures);
      $figuresContainer.append($mythologySection);

      // Animate figures in this section
      const $figureCards = $mythologySection.find(".figure-card");
      $figureCards.each((index, card) => {
        const $card = $(card);
        $card.css({
          opacity: "0",
          transform: "translateY(30px)",
          transition: "all 0.6s ease",
        });

        setTimeout(() => {
          $card.css({
            opacity: "1",
            transform: "translateY(0)",
          });
        }, totalAnimationDelay + index * 100);
      });

      totalAnimationDelay += figures.length * 100 + 200; // Add delay between sections
    });

    // Add divider with expand button if there are hidden mythologies
    if (hiddenMythologies.length > 0) {
      const expandDivider = this.createExpandDivider();
      $figuresContainer.append(expandDivider);

      // Add hidden mythologies container
      const $hiddenContainer = $('<div class="hidden-mythologies" style="display: none;"></div>');

      hiddenMythologies.forEach((mythology, mythologyIndex) => {
        const figures = this.allFigures[mythology] || [];
        if (figures.length === 0) return;

        const $mythologySection = this.createMythologySection(mythology, figures);
        $hiddenContainer.append($mythologySection);
      });

      $figuresContainer.append($hiddenContainer);
      
      // Setup expand toggle functionality
      this.setupExpandToggle();
    }
  }

  createMythologySection(mythology, figures) {
    const mythologyData = window.mythologyData || {};
    const title = mythologyData[mythology]?.title || `${mythology} MYTHOLOGY`;
    const cleanTitle = title.replace(" MYTHOLOGY", " Mythology");

    const $section = $(`
      <div class="mythology-section" data-mythology="${mythology}" style="margin-bottom: 4rem;">
        <div class="mythology-section-header" style="margin-bottom: 2rem;">
          <h3 class="mythology-section-title" style="
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 700;
            color: var(--secondary-color);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 1rem;
            position: relative;
          ">${cleanTitle}</h3>
          <div class="section-divider" style="
            width: 100px;
            height: 3px;
            background: var(--secondary-color);
            margin: 0 auto;
            border-radius: 2px;
          "></div>
        </div>
        <div class="figures-grid-section"></div>
      </div>
    `);

    // Group figures into rows of 5
    const rowSize = 5;
    const rows = [];
    for (let i = 0; i < figures.length; i += rowSize) {
      rows.push(figures.slice(i, i + rowSize));
    }

    const $gridSection = $section.find(".figures-grid-section");
    rows.forEach((row) => {
      const $gridRow = $('<div class="grid"></div>');
      row.forEach((figure) => {
        const $figureCard = this.createFigureCard(figure);
        $gridRow.append($figureCard);
      });
      $gridSection.append($gridRow);
    });

    return $section;
  }

  createFigureCard(figure) {
    const $card = $(`
      <div class="figure-card clickable-figure" data-figure="${figure.name}" data-category="${figure.category}">
        <div class="figure-image-container">
          <img src="assets/images/deities/${figure.image}" alt="${figure.name}" class="figure-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="image-placeholder" style="display: none;">
            <i class="fas fa-user-circle"></i>
            <span>No Image</span>
          </div>
        </div>
        <h4 class="figure-name has-text-tertiary">${figure.name}</h4>
        <p class="figure-category">${figure.category}</p>
      </div>
    `);

    // Add click handler to navigate to deity details
    $card.on('click', () => {
      this.navigateToDeityDetails(figure.name, figure.category);
    });

    return $card;
  }

  navigateToDeityDetails(deityName, deityCategory) {
    const url = `deity-details.html?deity=${encodeURIComponent(deityName)}&category=${encodeURIComponent(deityCategory)}`;
    window.location.href = url;
  }

  generateSearchResults($container) {
    // Clear expand divider and hidden content when searching
    $(".expand-divider, .hidden-mythologies").remove();
    
    const allFigures = [];
    this.categoryOrder.forEach((category) => {
      allFigures.push(...this.allFigures[category]);
    });

    const filteredFigures = allFigures.filter((figure) =>
      figure.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (filteredFigures.length === 0) {
      this.showNoResultsMessage($container);
      return;
    }

    // Create search results section
    const $searchSection = $(`
      <div class="search-results-section" style="margin-bottom: 4rem;">
        <div class="search-results-header" style="margin-bottom: 2rem;">
          <h3 style="
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--secondary-color);
            text-align: center;
            margin-bottom: 0.5rem;
          ">Search Results for "${this.searchTerm}"</h3>
          <p style="
            font-family: 'Poppins', sans-serif;
            color: var(--primary-foreground-color);
            opacity: 0.8;
            text-align: center;
            font-size: 1rem;
          ">${filteredFigures.length} figure${filteredFigures.length !== 1 ? "s" : ""} found</p>
          <div class="section-divider" style="
            width: 100px;
            height: 3px;
            background: var(--secondary-color);
            margin: 1rem auto 0;
            border-radius: 2px;
          "></div>
        </div>
        <div class="search-results-grid"></div>
      </div>
    `);

    // Group search results into rows
    const rowSize = 5;
    const rows = [];
    for (let i = 0; i < filteredFigures.length; i += rowSize) {
      rows.push(filteredFigures.slice(i, i + rowSize));
    }

    const $gridSection = $searchSection.find(".search-results-grid");
    rows.forEach((row) => {
      const $gridRow = $('<div class="grid"></div>');
      row.forEach((figure) => {
        const $figureCard = this.createFigureCard(figure);
        $gridRow.append($figureCard);
      });
      $gridSection.append($gridRow);
    });

    $container.append($searchSection);

    // Animate search results
    const $figureCards = $searchSection.find(".figure-card");
    $figureCards.each((index, card) => {
      const $card = $(card);
      $card.css({
        opacity: "0",
        transform: "translateY(30px)",
        transition: "all 0.6s ease",
      });

      setTimeout(() => {
        $card.css({
          opacity: "1",
          transform: "translateY(0)",
        });
      }, index * 100);
    });
  }

  showNoResultsMessage() {
    const $figuresContainer = $("#figures-content");
    const $noResults = $(`
      <div class="no-results-message" style="text-align: center; padding: 3rem;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--secondary-color); font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem;">
          No figures found
        </h3>
        <p style="color: var(--primary-foreground-color); opacity: 0.8;">
          Try a different search term or browse other mythologies.
        </p>
      </div>
    `);
    $figuresContainer.append($noResults);
  }

  setupSearch() {
    const $searchInput = $(".fullscreen-search-input");
    const $searchButton = $(".fullscreen-search-button");

    const performSearch = () => {
      const searchTerm = $searchInput.val().trim();
      if (this.searchTerm !== searchTerm) {
        this.searchTerm = searchTerm;
        this.generateAllFigures();
        
        // If search term is empty, we're back to normal view, so setup expand toggle
        if (!this.searchTerm) {
          setTimeout(() => {
            this.setupExpandToggle();
          }, 100);
        }
      }
    };

    $searchInput.on("input", performSearch);
    $searchButton.on("click", performSearch);
    $searchInput.on("keypress", (e) => {
      if (e.which === 13) {
        // Enter key
        performSearch();
      }
    });
  }

  createExpandDivider() {
    return $(`
        <div class="container">
            <hr class="divider" style="background-color: #b98d73;" />
            <div style="text-align: center;">
                <i class="fas fa-chevron-down divider-chevron" style="color: #b98d73;" id="expandToggle"></i>
            </div>
        </div>
    `);
  }

  setupExpandToggle() {
    $(document).off("click", "#expandToggle"); // Remove any existing handlers

    $(document).on("click", "#expandToggle", () => {
      const chevron = $("#expandToggle");
      const hiddenMythologies = $(".hidden-mythologies");

      if (hiddenMythologies.is(":visible")) {
        // Collapse - rotate back to normal
        chevron.css("transform", "rotate(0deg)");
        hiddenMythologies.slideUp(600);
      } else {
        // Expand - rotate 180 degrees to point up
        chevron.css("transform", "rotate(180deg)");
        hiddenMythologies.slideDown(600, () => {
          // Animate the newly visible figures
          const $newFigureCards = hiddenMythologies.find(".figure-card");
          $newFigureCards.each((index, card) => {
            const $card = $(card);
            $card.css({
              opacity: "0",
              transform: "translateY(30px)",
              transition: "all 0.6s ease",
            });

            setTimeout(() => {
              $card.css({
                opacity: "1",
                transform: "translateY(0)",
              });
            }, index * 50); // Faster animation for expanded content
          });
        });
      }
    });

    // Add hover effect
    $(document).on("mouseenter", "#mythologyExpandToggle", function () {
      $(this).css("background", "rgba(255, 255, 255, 0.2)");
    });

    $(document).on("mouseleave", "#mythologyExpandToggle", function () {
      $(this).css("background", "rgba(255, 255, 255, 0.1)");
    });
  }
}

// Initialize figures page when DOM is ready
$(document).ready(function () {
  // Only initialize if we're on the figures page
  if ($("#figures-content").length) {
    new FiguresPageGenerator();
  }
});
