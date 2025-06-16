// Figure generation class
class FigureGenerator {
  constructor() {
    this.currentPage = 0;
    this.itemsPerPage = 36;
    this.categoryOrder = ["ROMAN", "GREEK", "NORSE", "JAPANESE", "CELTIC", "AZTEC"];
    this.organizedFigures = this.organizeFiguresByCategory();
    this.init();
  }

  init() {
    this.generateFiguresGrid();
    this.setupNavigationButtons();
    this.updateNavigationButtons();
  }

  organizeFiguresByCategory() {
    // Group figures by category
    const figuresByCategory = {};
    figureData.forEach((figure) => {
      if (!figuresByCategory[figure.category]) {
        figuresByCategory[figure.category] = [];
      }
      figuresByCategory[figure.category].push(figure);
    });

    // Create vertical columns (4 columns for the grid)
    const columns = [[], [], [], []];
    let currentColumn = 0;

    // Distribute categories and their figures across columns vertically
    this.categoryOrder.forEach((category) => {
      if (figuresByCategory[category]) {
        // Add category header to current column
        columns[currentColumn].push({
          type: "category",
          category: category,
          name: category,
        });

        // Add figures for this category to the same column
        figuresByCategory[category].forEach((figure) => {
          columns[currentColumn].push({
            type: "figure",
            category: figure.category,
            name: figure.name,
            image: figure.image,
          });
        });

        // Move to next column
        currentColumn = (currentColumn + 1) % 4;
      }
    });

    // Convert columns back to a single array in row-major order
    const orderedFigures = [];
    const maxLength = Math.max(...columns.map((col) => col.length));

    for (let row = 0; row < maxLength; row++) {
      for (let col = 0; col < 4; col++) {
        if (columns[col][row]) {
          orderedFigures.push(columns[col][row]);
        } else {
          // Add empty placeholder if column is shorter
          orderedFigures.push({
            type: "empty",
            category: "",
            name: "",
          });
        }
      }
    }

    return orderedFigures.filter((item) => item.type !== "empty");
  }

  generateFiguresGrid() {
    const $figuresGrid = $(".figures-grid");
    $figuresGrid.empty();

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.organizedFigures.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = this.organizedFigures[i];

      if (item && item.name) {
        const $figureItem = $("<div>")
          .addClass("figure-item")
          .addClass(item.type === "category" ? "mythology-category" : "figure-name")
          .text(item.name)
          .attr("data-figure-name", item.name)
          .attr("data-figure-category", item.category)
          .attr("data-figure-image", item.image || "")
          .hide();

        // Add click handler for figure items to navigate to deity details
        if (item.type === "figure") {
          $figureItem.css('cursor', 'pointer');
          $figureItem.on('click', () => {
            this.navigateToDeityDetails(item.name, item.category);
          });
        }

        $figuresGrid.append($figureItem);
      }
    }

    // Animate in the new items
    this.animateFigureItems();

    // Update navigation buttons if this method exists
    if (this.updateNavigationButtons) {
      this.updateNavigationButtons();
    }
  }

  // Navigate to deity details page
  navigateToDeityDetails(deityName, deityCategory) {
    const url = `deity-details.html?deity=${encodeURIComponent(deityName)}&category=${encodeURIComponent(deityCategory)}`;
    window.location.href = url;
  }

  animateFigureItems() {
    const $figureItems = $(".figures-grid .figure-item");

    // Show all items instantly without delay or animation
    $figureItems.show();
  }

  setupNavigationButtons() {
    const $prevBtn = $(".figures-prev-btn");
    const $nextBtn = $(".figures-next-btn");

    $prevBtn.off("click").on("click", () => {
      this.goToPreviousPage();
    });

    $nextBtn.off("click").on("click", () => {
      this.goToNextPage();
    });
  }

  updateNavigationButtons() {
    const $prevBtn = $(".figures-prev-btn");
    const $nextBtn = $(".figures-next-btn");
    const $pageIndicator = $(".page-indicator");
    const totalPages = Math.ceil(this.organizedFigures.length / this.itemsPerPage);

    // Update page indicator
    $pageIndicator.text(`Page ${this.currentPage + 1} of ${totalPages}`);

    // Show/hide previous button
    if (this.currentPage > 0) {
      $prevBtn.show();
    } else {
      $prevBtn.hide();
    }

    // Update next button text and behavior
    if (this.currentPage < totalPages - 1) {
      $nextBtn.show().html('NEXT <i class="fas fa-chevron-right"></i>');
    } else {
      $nextBtn.show().html('<i class="fas fa-redo"></i> RESTART');
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      const $prevBtn = $(".figures-prev-btn");
      $prevBtn.addClass("is-loading");

      setTimeout(() => {
        this.currentPage--;
        this.generateFiguresGrid();
        this.updateNavigationButtons();
        $prevBtn.removeClass("is-loading");
      }, 300);
    }
  }

  goToNextPage() {
    const $nextBtn = $(".figures-next-btn");
    const totalPages = Math.ceil(this.organizedFigures.length / this.itemsPerPage);

    $nextBtn.addClass("is-loading");

    setTimeout(() => {
      if (this.currentPage < totalPages - 1) {
        this.currentPage++;
      } else {
        // Restart from beginning
        this.currentPage = 0;
      }

      this.generateFiguresGrid();
      this.updateNavigationButtons();
      $nextBtn.removeClass("is-loading");
    }, 300);
  }
}

// Figures Page Generator for figures.html
// jQuery initialization for main functionality
$(document).ready(function () {
  // Navbar burger functionality
  $(".navbar-burger").on("click", function () {
    $(this).toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  // Initialize original figure generator for other pages (like index.html)
  if ($(".figures-grid").length) {
    new FigureGenerator();
  }

  // Basic card functionality (animations are handled in animations.js)
  const $cards = $(".mythology-card");

  // Simple fallback click handler (in case animations.js doesn't load)
  if (typeof MythologyCardAnimations === "undefined") {
    $cards.on("click", function () {
      // Remove active from all cards
      $cards.removeClass("active");

      // Add active to clicked card
      $(this).addClass("active");
    });
  }

  // Add hover effects for figure items with image preview
  let $previewTooltip = null;

  // Create the tooltip element
  function createPreviewTooltip() {
    if (!$previewTooltip) {
      $previewTooltip = $("<div>")
        .addClass("deity-preview-tooltip")
        .css({
          position: "fixed",
          zIndex: 1000,
          display: "none",
          pointerEvents: "none",
        })
        .appendTo("body");
    }
  }

  // Add click handlers for figure items to navigate to deity details
  $(document)
    .on("click", ".figure-item.figure-name", function() {
      const $item = $(this);
      const figureName = $item.attr("data-figure-name");
      const figureCategory = $item.attr("data-figure-category");
      
      if (figureName && figureCategory) {
        const url = `deity-details.html?deity=${encodeURIComponent(figureName)}&category=${encodeURIComponent(figureCategory)}`;
        window.location.href = url;
      }
    });

  $(document)
    .on("mouseenter", ".figure-item.figure-name", function () {
      const $item = $(this);
      const imageName = $item.attr("data-figure-image");
      const figureName = $item.attr("data-figure-name");
      const figureCategory = $item.attr("data-figure-category");

      if (imageName && figureName) {
        createPreviewTooltip();

        // Stop any existing animations and immediately hide the tooltip
        $previewTooltip.stop(true, true).hide();

        const imageUrl = `assets/images/deities/${imageName}`;

        $previewTooltip
          .html(
            `
        <div class="tooltip-content">
          <img src="${imageUrl}" alt="${figureName}" class="deity-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div class="image-placeholder" style="display: none;">
            <i class="fas fa-image"></i>
            <span>Image not available</span>
          </div>
          <div class="deity-info">
            <h4>${figureName}</h4>
            <span class="deity-category">${figureCategory}</span>
          </div>
        </div>
      `
          )
          .fadeIn(200);
      }

      $item.addClass("is-hovered");
    })
    .on("mouseleave", ".figure-item.figure-name", function () {
      $(this).removeClass("is-hovered");

      if ($previewTooltip) {
        $previewTooltip.stop(true, true).fadeOut(150);
      }
    })
    .on("mousemove", ".figure-item.figure-name", function (e) {
      if ($previewTooltip && $previewTooltip.is(":visible")) {
        const tooltipWidth = 200;
        const tooltipHeight = 250;
        const offset = 15;

        let left = e.clientX + offset;
        let top = e.clientY + offset;

        // Prevent tooltip from going off-screen
        if (left + tooltipWidth > $(window).width()) {
          left = e.clientX - tooltipWidth - offset;
        }
        if (top + tooltipHeight > $(window).height()) {
          top = e.clientY - tooltipHeight - offset;
        }

        $previewTooltip.css({
          left: left + "px",
          top: top + "px",
        });
      }
    });

  // Category items don't show preview, just hover effect
  $(document)
    .on("mouseenter", ".figure-item.mythology-category", function () {
      $(this).addClass("is-hovered");
    })
    .on("mouseleave", ".figure-item.mythology-category", function () {
      $(this).removeClass("is-hovered");
    });

  // Contact form handling
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const $submitBtn = $(".contact-submit-btn");
    const originalText = $submitBtn.text();

    // Show loading state
    $submitBtn.text("Sending...").prop("disabled", true);

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      $submitBtn.text("Sent!").css("background-color", "#6a994e");

      // Reset form
      this.reset();

      // Reset button after 2 seconds
      setTimeout(() => {
        $submitBtn.text(originalText).prop("disabled", false).css("background-color", "");
      }, 2000);
    }, 1500);
  });

  // Add smooth scrolling for any internal links (if needed)
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 100,
        },
        800
      );
    }
  });

  // Footer navigation handling
  $(".footer-link").on("click", function (e) {
    e.preventDefault();
    const href = $(this).attr("href");

    // Map footer links to sections
    const sectionMap = {
      "#about": ".hero-section",
      "#categories": ".categories-section",
      "#figures": ".figures-section",
      "#blog": ".quote-section:last-of-type",
    };

    const targetSection = sectionMap[href];
    if (targetSection) {
      const $target = $(targetSection);
      if ($target.length) {
        $("html, body").animate(
          {
            scrollTop: $target.offset().top - 100,
          },
          800
        );
      }
    }
  });

  // Footer blog button handling
  $(".footer-blog-btn").on("click", function () {
    // Scroll to blog section
    const $blogSection = $(".quote-section:last-of-type");
    if ($blogSection.length) {
      $("html, body").animate(
        {
          scrollTop: $blogSection.offset().top - 100,
        },
        800
      );
    }
  });
});
