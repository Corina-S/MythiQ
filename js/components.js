// Component Functionality Manager
class ComponentManager {
  constructor() {
    // Initialize immediately since components are now inline
    this.initializeComponentFunctionality();
  }

  /**
   * Initialize functionality for components
   */
  initializeComponentFunctionality() {
    // Initialize fullscreen menu
    this.initializeFullscreenMenu();
  }

  /**
   * Initialize the fullscreen menu functionality
   */
  initializeFullscreenMenu() {
    const burger = document.querySelector(".navbar-burger");
    const fullscreenMenu = document.getElementById("fullscreen-menu");
    const closeButton = document.querySelector(".fullscreen-menu-close");

    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (window.fullscreenMenuAnimations) {
        window.fullscreenMenuAnimations.init();
      }
    }, 100);

    if (burger && fullscreenMenu) {
      // Open menu when burger is clicked
      burger.addEventListener("click", (e) => {
        e.preventDefault();
        this.openFullscreenMenu();
      });
    }

    if (closeButton && fullscreenMenu) {
      // Close menu when close button is clicked
      closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeFullscreenMenu();
      });
    }

    if (fullscreenMenu) {
      // Close menu with Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && fullscreenMenu.classList.contains("is-active")) {
          this.closeFullscreenMenu();
        }
      });

      // Handle menu link clicks
      const menuLinks = fullscreenMenu.querySelectorAll(".fullscreen-menu-link, .fullscreen-submenu-link");
      menuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          // Check if this is a submenu toggle
          if (link.classList.contains("categories-toggle")) {
            e.preventDefault();
            this.toggleSubmenu(link);
            return;
          }

          // Close menu when a regular link is clicked
          setTimeout(() => {
            this.closeFullscreenMenu();
          }, 100);
        });
      });

      // Initialize submenu state
      this.initializeSubmenus();
      
      // Initialize category image preview
      this.initializeCategoryImagePreview();
    }
  }

  /**
   * Initialize submenu functionality
   */
  initializeSubmenus() {
    const submenus = document.querySelectorAll(".fullscreen-submenu");
    submenus.forEach((submenu) => {
      // Set initial state for submenu items
      gsap.set(submenu.querySelectorAll(".fullscreen-submenu-link"), { y: -10, opacity: 0 });
    });
  }

  /**
   * Toggle submenu visibility
   * @param {Element} toggleElement - The element that was clicked to toggle
   */
  toggleSubmenu(toggleElement) {
    const submenuId = toggleElement.getAttribute("data-submenu") + "-submenu";
    const submenu = document.getElementById(submenuId);
    const parentItem = toggleElement.closest(".has-submenu");

    if (!submenu || !parentItem) return;

    const isOpen = parentItem.classList.contains("submenu-open");

    // Toggle the state
    if (isOpen) {
      parentItem.classList.remove("submenu-open");
    } else {
      parentItem.classList.add("submenu-open");
    }

    // Use animation from animations.js
    if (window.fullscreenMenuAnimations) {
      window.fullscreenMenuAnimations.toggleSubmenu(submenuId, isOpen);
    }
  }

  /**
   * Open the fullscreen menu using animations.js
   */
  openFullscreenMenu() {
    const burger = document.querySelector(".navbar-burger");

    if (burger) {
      burger.setAttribute("aria-expanded", "true");
    }

    // Use the animation class from animations.js
    if (window.fullscreenMenuAnimations) {
      window.fullscreenMenuAnimations.openMenu();
    }
  }

  /**
   * Close the fullscreen menu using animations.js
   */
  closeFullscreenMenu() {
    const burger = document.querySelector(".navbar-burger");

    if (burger) {
      burger.setAttribute("aria-expanded", "false");
    }

    // Use the animation class from animations.js
    if (window.fullscreenMenuAnimations) {
      window.fullscreenMenuAnimations.closeMenu();
    }
  }

  /**
   * Initialize category image preview functionality
   */
  initializeCategoryImagePreview() {
    const categoryLinks = document.querySelectorAll(".fullscreen-submenu-link[data-category]");
    const imageContainer = document.querySelector(".category-image-container");
    const previewImage = document.getElementById("category-preview-image");

    // Category data with images
    const categoryData = {
      greek: {
        image: "assets/images/categories/greek.webp"
      },
      roman: {
        image: "assets/images/categories/roman.webp"
      },
      norse: {
        image: "assets/images/categories/norse.webp"
      },
      egyptian: {
        image: "assets/images/categories/egyptian.webp"
      },
      chinese: {
        image: "assets/images/categories/chinese.webp"
      },
      japanese: {
        image: "assets/images/categories/japanese.webp"
      },
      celtic: {
        image: "assets/images/categories/celtic.webp"
      }
    };

    if (!imageContainer || !previewImage) {
      return;
    }

    categoryLinks.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        const category = e.target.getAttribute("data-category");
        const data = categoryData[category];

        if (data) {
          previewImage.src = data.image;
          previewImage.alt = `${category} mythology`;
          
          imageContainer.classList.add("visible");
        }
      });

      link.addEventListener("mouseleave", () => {
        setTimeout(() => {
          imageContainer.classList.remove("visible");
        }, 200);
      });
    });

    // Handle image load errors (fallback to placeholder)
    previewImage.addEventListener("error", () => {
      previewImage.src = "assets/images/categorie-bg.webp"; // fallback image
    });
  }
}

// Create global instance
window.componentManager = new ComponentManager();

// Auto-initialize components when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (!window.componentManager) {
    window.componentManager = new ComponentManager();
  }
});
