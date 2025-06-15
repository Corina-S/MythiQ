// GSAP Animations for MythiQ
// Card transition animations

class MythologyCardAnimations {
  constructor() {
    this.cards = document.querySelectorAll(".mythology-card");
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    this.setupCardClickHandlers();
    this.setupInitialState();
    
    // Listen for window resize to update mobile state and reinitialize
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      // If mobile state changed, reinitialize the layout
      if (wasMobile !== this.isMobile) {
        this.setupInitialState();
      }
    });
  }

  setupInitialState() {
    // Set the first card as active by default
    this.cards.forEach((card, index) => {
      if (index === 0) {
        card.classList.add("active");
        this.setupActiveCard(card);
      } else {
        card.classList.remove("active");
        this.setupInactiveCard(card);
      }
    });
  }

  setupActiveCard(card) {
    const title = card.querySelector(".card-title");
    title.style.writingMode = "initial";
    title.style.textOrientation = "initial";
    title.style.whiteSpace = "initial";
    title.style.textAlign = "initial";
    
    if (this.isMobile) {
      title.style.fontSize = "1.8rem";
      title.style.marginBottom = "0.5rem";
    } else {
      title.style.fontSize = "2.5rem";
      title.style.marginBottom = "0.5rem";
    }
  }

  setupInactiveCard(card) {
    const title = card.querySelector(".card-title");
    
    if (this.isMobile) {
      title.style.writingMode = "initial";
      title.style.textOrientation = "initial";
      title.style.whiteSpace = "nowrap";
      title.style.fontSize = "1rem";
      title.style.marginBottom = "0.5rem";
      title.style.textAlign = "center";
    } else {
      title.style.writingMode = "vertical-rl";
      title.style.textOrientation = "mixed";
      title.style.whiteSpace = "nowrap";
      title.style.fontSize = "1.2rem";
      title.style.marginBottom = "2rem";
      title.style.textAlign = "initial";
    }
  }

  setupCardClickHandlers() {
    this.cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        this.handleCardClick(event.currentTarget);
      });
    });
  }

  handleCardClick(clickedCard) {
    // Remove active from all cards and animate them to inactive state
    this.cards.forEach((card) => {
      if (card !== clickedCard) {
        card.classList.remove("active");
        this.animateToInactive(card);
      }
    });

    // Add active to clicked card and animate it to active state
    clickedCard.classList.add("active");
    this.animateToActive(clickedCard);
  }

  animateToInactive(card) {
    this.setupInactiveCard(card);
    
    const title = card.querySelector(".card-title");
    // Simple animation
    gsap.to(title, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  }

  animateToActive(card) {
    this.setupActiveCard(card);
    
    const title = card.querySelector(".card-title");
    // Simple animation
    gsap.to(title, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  }

  // Alternative animation methods you can switch to:

  // Scale + Rotation Animation
  animateWithScaleRotation(card, isActive) {
    const title = card.querySelector(".card-title");
    
    if (isActive) {
      gsap.fromTo(title, 
        { scale: 0.5, rotation: 90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(title, {
        scale: 0.8,
        rotation: 90,
        opacity: 0.7,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }

  // Slide Animation
  animateWithSlide(card, isActive) {
    const title = card.querySelector(".card-title");
    
    if (isActive) {
      gsap.fromTo(title,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.to(title, {
        x: -20,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  // Bounce Animation
  animateWithBounce(card, isActive) {
    const title = card.querySelector(".card-title");
    
    if (isActive) {
      gsap.fromTo(title,
        { y: -30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out" }
      );
    } else {
      gsap.to(title, {
        y: 10,
        scale: 0.9,
        opacity: 0.7,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }
}

// Fullscreen Menu Animations
class FullscreenMenuAnimations {
  constructor() {
    this.fullscreenMenu = null;
    this.isAnimating = false;
  }

  /**
   * Initialize the fullscreen menu animations
   */
  init() {
    this.fullscreenMenu = document.getElementById('fullscreen-menu');
    
    if (this.fullscreenMenu) {
      // Set initial state for GSAP animations
      gsap.set(this.fullscreenMenu, { opacity: 0, visibility: 'hidden' });
      gsap.set('.fullscreen-menu-link', { y: 50, opacity: 0 });
      gsap.set('.fullscreen-menu-search', { y: 30, opacity: 0 });
      gsap.set('.fullscreen-menu-close', { rotation: 0, scale: 0 });
      gsap.set('.fullscreen-menu-logo', { x: -50, opacity: 0 });
      gsap.set('.fullscreen-submenu', { height: 0, opacity: 0 });
      gsap.set('.submenu-arrow', { rotation: 0 });
    }
  }

  /**
   * Open the fullscreen menu with GSAP animations
   */
  openMenu() {
    if (!this.fullscreenMenu || this.isAnimating) return;
    
    this.isAnimating = true;
    this.fullscreenMenu.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');

    // Reset submenu states when opening menu
    this.resetSubmenuStates();

    // Create timeline for smooth sequential animations
    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    
    // Animate menu background
    tl.to(this.fullscreenMenu, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.4,
      ease: 'power2.out'
    })
    
    // Animate logo and close button together
    .to('.fullscreen-menu-logo', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    
    .to('.fullscreen-menu-close', {
      scale: 1,
      rotation: 180,
      duration: 0.3,
      ease: 'back.out(1.7)'
    }, '-=0.3')
    
    // Animate menu links with stagger effect
    .to('.fullscreen-menu-link', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.1')
    
    // Animate search bar
    .to('.fullscreen-menu-search', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3');
  }

  /**
   * Close the fullscreen menu with GSAP animations
   */
  closeMenu() {
    if (!this.fullscreenMenu || !this.fullscreenMenu.classList.contains('is-active') || this.isAnimating) return;
    
    this.isAnimating = true;

    // Close any open submenus first
    this.closeAllSubmenus();

    // Create timeline for smooth exit animations
    const tl = gsap.timeline({
      onComplete: () => {
        this.fullscreenMenu.classList.remove('is-active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        this.isAnimating = false;
      }
    });
    
    // Animate elements out in reverse order
    tl.to('.fullscreen-menu-search', {
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    })
    
    .to('.fullscreen-menu-link', {
      y: -30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in'
    }, '-=0.1')
    
    .to('.fullscreen-menu-logo', {
      x: -50,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2')
    
    .to('.fullscreen-menu-close', {
      scale: 0,
      rotation: -180,
      duration: 0.3,
      ease: 'back.in(1.7)'
    }, '-=0.2')
    
    .to(this.fullscreenMenu, {
      opacity: 0,
      visibility: 'hidden',
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.1');
  }

  /**
   * Reset all submenu states
   */
  resetSubmenuStates() {
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    hasSubmenuItems.forEach(item => {
      item.classList.remove('submenu-open');
    });
    
    gsap.set('.fullscreen-submenu', { height: 0, opacity: 0 });
    gsap.set('.fullscreen-submenu-link', { y: -10, opacity: 0 });
    gsap.set('.submenu-arrow', { rotation: 0 });
    gsap.set('.fullscreen-menu-logo', { x: -50, opacity: 0 });
  }

  /**
   * Close all open submenus
   */
  closeAllSubmenus() {
    const openSubmenus = document.querySelectorAll('.has-submenu.submenu-open');
    openSubmenus.forEach(item => {
      const submenuId = item.querySelector('[data-submenu]').getAttribute('data-submenu') + '-submenu';
      const submenu = document.getElementById(submenuId);
      const arrow = item.querySelector('.submenu-arrow');
      
      if (submenu) {
        item.classList.remove('submenu-open');
        this.closeSubmenu(submenu, arrow);
      }
    });
  }

  /**
   * Alternative opening animation with different effects
   */
  openMenuWithScale() {
    if (!this.fullscreenMenu || this.isAnimating) return;
    
    this.isAnimating = true;
    this.fullscreenMenu.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');

    // Set initial scale state
    gsap.set(this.fullscreenMenu, { scale: 0.8 });
    gsap.set('.fullscreen-menu-content', { scale: 0.5, rotation: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    
    tl.to(this.fullscreenMenu, {
      opacity: 1,
      visibility: 'visible',
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
    
    .to('.fullscreen-menu-content', {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    
    .to('.fullscreen-menu-close', {
      scale: 1,
      rotation: 360,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    
    .to('.fullscreen-menu-link', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'elastic.out(1, 0.3)'
    }, '-=0.2')
    
    .to('.fullscreen-menu-search', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.4');
  }

  /**
   * Alternative closing animation with different effects
   */
  closeMenuWithScale() {
    if (!this.fullscreenMenu || !this.fullscreenMenu.classList.contains('is-active') || this.isAnimating) return;
    
    this.isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        this.fullscreenMenu.classList.remove('is-active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        this.isAnimating = false;
        // Reset transforms
        gsap.set(this.fullscreenMenu, { scale: 1 });
        gsap.set('.fullscreen-menu-content', { scale: 1, rotation: 0 });
      }
    });
    
    tl.to('.fullscreen-menu-search', {
      y: 50,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    })
    
    .to('.fullscreen-menu-link', {
      y: -50,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.in'
    }, '-=0.1')
    
    .to('.fullscreen-menu-close', {
      scale: 0,
      rotation: -360,
      duration: 0.3,
      ease: 'back.in(1.7)'
    }, '-=0.2')
    
    .to('.fullscreen-menu-content', {
      scale: 0.5,
      rotation: -5,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2')
    
    .to(this.fullscreenMenu, {
      opacity: 0,
      visibility: 'hidden',
      scale: 0.8,
      duration: 0.3,
      ease: 'back.in(1.7)'
    }, '-=0.2');
  }

  /**
   * Toggle submenu with GSAP animations
   * @param {string} submenuId - ID of the submenu to toggle
   * @param {boolean} isOpen - Current state of the submenu
   */
  toggleSubmenu(submenuId, isOpen) {
    const submenu = document.getElementById(submenuId);
    const arrow = document.querySelector(`[data-submenu="${submenuId.replace('-submenu', '')}"] .submenu-arrow`);
    
    if (!submenu) return;

    if (isOpen) {
      this.closeSubmenu(submenu, arrow);
    } else {
      this.openSubmenu(submenu, arrow);
    }
  }

  /**
   * Open submenu with animation
   * @param {Element} submenu - The submenu element
   * @param {Element} arrow - The arrow element
   */
  openSubmenu(submenu, arrow) {
    // Get natural height
    submenu.style.height = 'auto';
    const autoHeight = submenu.offsetHeight;
    submenu.style.height = '0px';

    const tl = gsap.timeline();
    
    // Animate submenu open
    tl.to(submenu, {
      height: autoHeight,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    
    // Animate submenu links
    .to(submenu.querySelectorAll('.fullscreen-submenu-link'), {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=0.2');

    // Rotate arrow
    if (arrow) {
      gsap.to(arrow, {
        rotation: 180,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  /**
   * Close submenu with animation
   * @param {Element} submenu - The submenu element
   * @param {Element} arrow - The arrow element
   */
  closeSubmenu(submenu, arrow) {
    const tl = gsap.timeline();
    
    // Animate submenu links out
    tl.to(submenu.querySelectorAll('.fullscreen-submenu-link'), {
      y: -10,
      opacity: 0,
      duration: 0.2,
      stagger: 0.02,
      ease: 'power2.in'
    })
    
    // Animate submenu close
    .to(submenu, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.1');

    // Rotate arrow back
    if (arrow) {
      gsap.to(arrow, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Wait for GSAP to be available
  if (typeof gsap !== 'undefined') {
    new MythologyCardAnimations();
    
    // Create global fullscreen menu animations instance
    window.fullscreenMenuAnimations = new FullscreenMenuAnimations();
  } else {
    console.error('GSAP library not found. Please make sure GSAP is loaded before this script.');
  }
});
