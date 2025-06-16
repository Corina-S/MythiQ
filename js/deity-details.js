// Deity Details Page Controller
class DeityDetailsController {
  constructor() {
    this.currentDeity = null;
    this.init();
  }

  init() {
    // Check if we're on the deity-details page or if the main content exists
    if (!document.querySelector(".main-content")) {
      return;
    }

    this.loadDeityFromURL();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for popstate events (browser back/forward)
    $(window).on("popstate", () => {
      this.loadDeityFromURL();
    });
  }

  loadDeityFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const deityName = urlParams.get("deity");
    const deityCategory = urlParams.get("category");

    if (deityName && deityCategory) {
      this.loadDeity(deityName, deityCategory);
    } else {
      // If no deity specified, show all figures (existing functionality)
      this.showAllFigures();
    }
  }

  loadDeity(deityName, deityCategory) {
    // Find the deity in the detailed data first, then fallback to figure data
    let deity = deityData[deityName];

    if (!deity) {
      // Fallback to figure data if not in detailed data
      deity = figureData.find((figure) => figure.name === deityName && figure.category === deityCategory);
    }

    if (!deity) {
      console.error(`Deity "${deityName}" from category "${deityCategory}" not found`);
      this.showAllFigures();
      return;
    }

    this.currentDeity = deity;

    // Update page title
    document.title = `MythiQ - ${deity.name}`;

    // Update the page content
    this.renderDeityDetails();
  }

  renderDeityDetails() {
    if (!this.currentDeity) return;

    const deity = this.currentDeity;
    const mythologyInfo = mythologyData[deity.category];
    const categoryDisplayName = mythologyInfo ? mythologyInfo.title.replace(" MYTHOLOGY", "") : deity.category;

    // If this is detailed deity data, replace the entire page content
    if (deity.origins && deity.symbols && deity.curiosities) {
      this.renderFullDeityPage(deity, categoryDisplayName);
    } else {
      // Fallback to the original layout for basic deity data
      this.renderBasicDeityLayout(deity, categoryDisplayName);
    }
  }

  renderFullDeityPage(deity, categoryDisplayName) {
    // Get the proper name format (with original language if available)
    const fullName = this.getDeityFullName(deity);

    // Replace the entire body content for deity details
    const mainContent = $(".main-content");
    mainContent.empty();

    const deityPageHTML = `
      <div class="deity-details">
      <!-- Hero Section -->
      <section class="section deity-main-section">
        <div class="container is-fluid">
          <div class="columns">
            <div class="column is-flex is-flex-direction-column is-justify-content-center p-5">
              <div class="is-flex is-flex-direction-column is-align-items-start mb-5">
                <h3 class="has-text-weight-bold title is-4 is-uppercase has-text-secondary">Name</h3>
                <span class="has-text-white">${fullName}</span>
              </div>
              <div class="is-flex is-flex-direction-column is-align-items-start mt-5" style="width: 300px">
                <h3 class="has-text-weight-bold title is-4 is-uppercase has-text-secondary">Origins</h3>
                <span class="has-text-white">${deity.origins}</span>
              </div>
            </div>
            <div class="column mythology-image-column" style="height: fit-content">
              <div class="category-image-container visible">
                <figure class="image">
                  <img
                    src="assets/images/deities/${deity.image}"
                    alt="${categoryDisplayName} Mythology Illustration"
                    style="border: 5px solid white"
                    class="is-rounded"
                    id="mythology-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  />
                  <div class="deity-image-placeholder" style="display: none;">
                    <i class="fas fa-user-circle"></i>
                    <span>No Image Available</span>
                  </div>
                </figure>
              </div>
            </div>
            <div class="column is-flex is-flex-direction-column is-justify-content-center p-5">
              <div class="is-flex is-flex-direction-column is-align-items-end mb-5">
                <h3 class="has-text-weight-bold title is-4 is-uppercase has-text-secondary">Symbols</h3>
                <span class="has-text-white">${deity.symbols}</span>
              </div>
              <div class="is-flex is-flex-direction-column is-align-items-end mt-5">
                <h3 class="has-text-weight-bold title is-4 is-uppercase has-text-secondary">Curiosities</h3>
                <span class="has-text-white has-text-right">${deity.curiosities}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quote Section -->
      <section class="section quote-section" style="background-color: #b98d73">
        <div class="container">
          <div class="has-text-centered">
            <blockquote class="quote-text has-text-black" style="margin-bottom: 5rem">
              "${deity.quote}"
            </blockquote>
            <span class="quote-author">(${deity.quoteSource})</span>
          </div>
        </div>
      </section>

      <!-- Deity Details Section -->
      <section class="section deity-description-section">
        <div class="container columns is-gap-5">
          <div class="column" style="height: fit-content">
            <h2 class="title deity-details-title">${deity.name} - History in ${categoryDisplayName} Mythology</h2>
            <p>${deity.description}</p>
          </div>
          <div class="column mythology-image-column" style="height: fit-content">
            <div class="category-image-container visible">
              <figure class="image">
                <img
                  src="assets/images/categories/${deity.category.toLowerCase()}.webp"
                  alt="${categoryDisplayName} Mythology Illustration"
                  class="category-image mythology-image is-rounded"
                  id="mythology-image"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <div class="category-image-placeholder" style="display: none;">
                  <i class="fas fa-image"></i>
                  <span>No Category Image</span>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Deities section -->
      <section class="section">
        <h2 class="title is-2 section-title has-text-black has-text-left">Related Deities</h2>
        <div class="grid" id="related-deities-grid">
          <!-- Related deities will be populated here -->
        </div>
      </section>

      <!-- Categories Section -->
      <section class="section categories-section">
        <div class="mythology-container">
          <div class="container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
            <h3 class="categories-section-title mb-5">More Categories</h3>
            <div class="mythology-cards mt-5" id="mythologyCards">
              <div class="mythology-card greek active" data-mythology="greek">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Greek</h3>
                  <p class="card-subtitle">Land of Olympian Gods</p>
                  <p class="card-description">
                    The rich tapestry of Greek mythology, featuring mighty gods like Zeus, Athena, and Poseidon, has
                    captivated humanity for millennia. From Mount Olympus to the depths of Hades, these tales of
                    heroism, love, and divine intervention continue to inspire modern culture.
                  </p>
                </div>
              </div>

              <div class="mythology-card norse" data-mythology="norse">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Norse</h3>
                  <p class="card-subtitle">Realm of Asgard</p>
                  <p class="card-description">
                    From the icy realms of Asgard comes the fierce mythology of the Norse. With Odin the All-Father,
                    Thor the Thunder God, and the cunning Loki, these tales speak of Ragnarök, Valhalla, and the eternal
                    struggle between order and chaos.
                  </p>
                </div>
              </div>

              <div class="mythology-card egyptian" data-mythology="egyptian">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Egyptian</h3>
                  <p class="card-subtitle">Gift of the Nile</p>
                  <p class="card-description">
                    Ancient Egypt's mythology spans thousands of years, featuring gods like Ra, Isis, and Anubis. These
                    deities governed life, death, and rebirth along the sacred Nile, creating a complex pantheon that
                    influenced art, architecture, and afterlife beliefs.
                  </p>
                </div>
              </div>

              <div class="mythology-card japanese" data-mythology="japanese">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Japanese</h3>
                  <p class="card-subtitle">Land of Kami</p>
                  <p class="card-description">
                    Shinto and Buddhist traditions blend in Japanese mythology, featuring kami spirits, Amaterasu the
                    Sun Goddess, and legendary creatures like dragons and kitsune. These stories emphasize harmony with
                    nature and respect for ancestral spirits.
                  </p>
                </div>
              </div>

              <div class="mythology-card celtic" data-mythology="celtic">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Celtic</h3>
                  <p class="card-subtitle">Druids & Fae</p>
                  <p class="card-description">
                    Celtic mythology weaves tales of druids, faeries, and nature spirits across Ireland, Scotland, and
                    Wales. Gods like Cernunnos and the Morrigan represent the wild, untamed forces of nature and the
                    cycles of life and death.
                  </p>
                </div>
              </div>

              <div class="mythology-card aztec" data-mythology="aztec">
                <div class="card-overlay"></div>
                <div class="card-content">
                  <h3 class="card-title">Aztec</h3>
                  <p class="card-subtitle">Empire of the Sun</p>
                  <p class="card-description">
                    The Aztec pantheon features powerful deities like Quetzalcoatl and Tezcatlipoca, governing the
                    cycles of creation and destruction. Their mythology emphasizes sacrifice, cosmic balance, and the
                    eternal struggle between light and darkness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="section contact-section">
        <div class="container">
          <div class="contact-container">
            <div class="contact-content">
              <div class="columns is-vcentered">
                <div class="column is-half">
                  <div class="contact-text">
                    <h2 class="title is-2 contact-title">Have any questions, doubts, or curiosities about myths?</h2>
                    <p class="subtitle is-5 contact-description">
                      We're happy to help with anything related to gods, heroes, legends, and mythological mysteries.
                    </p>
                  </div>
                </div>
                <div class="column is-half">
                  <div class="contact-form-wrapper">
                    <form class="contact-form" id="contactForm">
                      <div class="columns gap-5 is-multiline">
                        <div class="column is-half-desktop is-full-mobile">
                          <div class="field mr-2-desktop">
                            <div class="control">
                              <input
                                class="input contact-input"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div class="column is-half-desktop is-full-mobile">
                          <div class="field ml-2-desktop">
                            <div class="control">
                              <input
                                class="input contact-input"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <div class="control">
                          <input
                            class="input contact-input"
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                      <div class="field">
                        <div class="control">
                          <textarea
                            class="textarea contact-textarea"
                            id="message"
                            name="message"
                            placeholder="Message"
                            rows="5"
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div class="field">
                        <div class="control">
                          <button type="submit" class="button is-fullwidth contact-submit-btn">Send</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    mainContent.html(deityPageHTML);

    // Load related deities
    this.loadRelatedDeities();
  }

  getDeityFullName(deity) {
    if (deity.greekName) {
      return `${deity.name} (${deity.greekName} in Greek)`;
    } else if (deity.romanName) {
      return `${deity.name} (${deity.romanName} in Latin)`;
    } else if (deity.norseName) {
      return `${deity.name} (${deity.norseName} in Old Norse)`;
    } else if (deity.egyptianName) {
      return `${deity.name} (${deity.egyptianName} in Egyptian)`;
    }
    return deity.name;
  }

  loadRelatedDeities() {
    if (!this.currentDeity) return;

    const relatedFigures = figureData
      .filter((figure) => figure.category === this.currentDeity.category && figure.name !== this.currentDeity.name)
      .slice(0, 5); // Show up to 5 related figures

    const $relatedGrid = $("#related-deities-grid");
    $relatedGrid.empty();

    if (relatedFigures.length === 0) {
      $relatedGrid.parent().hide();
      return;
    }

    relatedFigures.forEach((figure) => {
      const $figureCard = $(`
        <div class="figure-card" data-figure="${figure.name}" data-category="${figure.category}">
          <div class="figure-image-container">
            <img src="assets/images/deities/${figure.image}" 
                 alt="${figure.name}" 
                 class="figure-image" 
                 loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="image-placeholder" style="display: none;">
              <i class="fas fa-user-circle"></i>
              <span>No Image</span>
            </div>
          </div>
          <h3 class="figure-name">${figure.name}</h3>
        </div>
      `);

      // Add click handler for related figures
      $figureCard.on("click", () => {
        this.navigateToDeity(figure.name, figure.category);
      });

      $relatedGrid.append($figureCard);
    });
  }

  renderBasicDeityLayout(deity, categoryDisplayName) {
    // Original basic layout for deities without detailed data
    const $figuresContent = $("#figures-content");
    $figuresContent.empty();

    // Create deity details layout
    const $deityDetails = $(`
      <div class="deity-details-container">
        <div class="columns is-vcentered">
          <!-- Deity Image Column -->
          <div class="column is-5">
            <div class="deity-image-container">
              <figure class="image">
                <img src="assets/images/deities/${deity.image}" 
                     alt="${deity.name}" 
                     class="deity-main-image visible"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="deity-image-placeholder" style="display: none;">
                  <i class="fas fa-user-circle"></i>
                  <span>No Image Available</span>
                </div>
              </figure>
            </div>
          </div>
          
          <!-- Deity Info Column -->
          <div class="column is-7">
            <div class="deity-info-content">
              <div class="deity-category-badge">
                <span class="tag is-large">${categoryDisplayName}</span>
              </div>
              
              <h1 class="title is-1 deity-name">${deity.name}</h1>
              
              <div class="deity-description">
                <p class="subtitle is-5">
                  ${deity.name} is a prominent figure from ${categoryDisplayName.toLowerCase()} mythology, 
                  representing one of the most significant deities in the ${deity.category.toLowerCase()} pantheon.
                </p>
                
                <div class="deity-attributes">
                  <h3 class="title is-4">About ${deity.name}</h3>
                  <p>
                    This legendary figure has played a crucial role in ${categoryDisplayName.toLowerCase()} 
                    mythology and continues to be revered for their unique attributes and stories. 
                    The tales surrounding ${deity.name} have been passed down through generations, 
                    influencing art, literature, and cultural traditions.
                  </p>
                </div>
              </div>
              
              <div class="deity-actions mt-5">
                <button class="button is-primary is-large back-to-figures-btn">
                  <i class="fas fa-arrow-left"></i>
                  <span>Back to All Figures</span>
                </button>
                <button class="button is-outlined is-large explore-category-btn" data-category="${deity.category}">
                  <span>Explore ${categoryDisplayName}</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Related Figures Section -->
        <div class="related-figures-section mt-6">
          <h3 class="title is-3 has-text-centered">More ${categoryDisplayName} Figures</h3>
          <div class="related-figures-grid" id="related-figures-grid">
            <!-- Related figures will be populated here -->
          </div>
        </div>
      </div>
    `);

    $figuresContent.append($deityDetails);

    // Add event listeners for action buttons
    $(".back-to-figures-btn").on("click", () => {
      this.goBackToFigures();
    });

    $(".explore-category-btn").on("click", (e) => {
      const category = $(e.currentTarget).data("category");
      this.goToCategoryPage(category);
    });

    // Load related figures using the original method
    this.loadRelatedFiguresBasic();

    // Animate the content in
    this.animateDeityDetailsIn();
  }

  loadRelatedFiguresBasic() {
    if (!this.currentDeity) return;

    const relatedFigures = figureData
      .filter((figure) => figure.category === this.currentDeity.category && figure.name !== this.currentDeity.name)
      .slice(0, 4); // Show up to 4 related figures

    const $relatedGrid = $("#related-figures-grid");
    $relatedGrid.empty();

    if (relatedFigures.length === 0) {
      $(".related-figures-section").hide();
      return;
    }

    relatedFigures.forEach((figure, index) => {
      const $figureCard = $(`
        <div class="related-figure-card" data-figure="${figure.name}" data-category="${figure.category}">
          <div class="figure-image-container">
            <img src="assets/images/deities/${figure.image}" 
                 alt="${figure.name}" 
                 class="figure-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="image-placeholder" style="display: none;">
              <i class="fas fa-user-circle"></i>
              <span>No Image</span>
            </div>
          </div>
          <h4 class="figure-name">${figure.name}</h4>
          <p class="figure-category">${figure.category}</p>
        </div>
      `);

      // Add click handler for related figures
      $figureCard.on("click", () => {
        this.navigateToDeity(figure.name, figure.category);
      });

      $relatedGrid.append($figureCard);

      // Animate in with delay
      setTimeout(() => {
        $figureCard.css({
          opacity: "1",
          transform: "translateY(0)",
        });
      }, index * 150);
    });
  }

  animateDeityDetailsIn() {
    const $container = $(".deity-details-container");
    $container.css({
      opacity: "0",
      transform: "translateY(30px)",
    });

    setTimeout(() => {
      $container.css({
        opacity: "1",
        transform: "translateY(0)",
        transition: "all 0.6s ease",
      });
    }, 100);
  }

  showAllFigures() {
    // Fallback to show all figures (existing FiguresPageGenerator functionality)
    if (typeof FiguresPageGenerator !== "undefined") {
      new FiguresPageGenerator();
    }
  }

  navigateToDeity(deityName, deityCategory) {
    // Update URL and reload deity
    const url = `deity-details.html?deity=${encodeURIComponent(deityName)}&category=${encodeURIComponent(
      deityCategory
    )}`;
    window.location.href = url;
  }

  goBackToFigures() {
    // Navigate back to figures page
    window.location.href = "figures.html";
  }

  goToCategoryPage(category) {
    // Navigate to category details page
    const categoryName = category.toLowerCase();
    window.location.href = `category-details.html#${categoryName}`;
  }

  // Static method to navigate to a deity from any page
  static navigateToDeity(deityName, deityCategory) {
    const url = `deity-details.html?deity=${encodeURIComponent(deityName)}&category=${encodeURIComponent(
      deityCategory
    )}`;
    window.location.href = url;
  }
}

// Global function to navigate to deity details (for use in other files)
window.navigateToDeity = function (deityName, deityCategory) {
  DeityDetailsController.navigateToDeity(deityName, deityCategory);
};

// Initialize deity details controller when DOM is ready
$(document).ready(function () {
  // Only initialize if we're on the deity-details page
  if (window.location.pathname.includes("deity-details.html")) {
    new DeityDetailsController();
  }
});
