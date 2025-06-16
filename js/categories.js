// Categories page functionality
$(document).ready(function () {
  generateCategoriesPage();
  setupExpandToggle();
});

function generateCategoriesPage() {
  const container = $(".main-content");
  const categoriesContainer = $("<div></div>");

  // Generate first 4 categories (always visible)
  const visibleCategories = categoriesData.slice(0, 4);
  const hiddenCategories = categoriesData.slice(4);

  visibleCategories.forEach((category, index) => {
    const categorySection = createCategorySection(category, index);
    categoriesContainer.append(categorySection);
  });

  // Add divider with expand button if there are hidden categories
  if (hiddenCategories.length > 0) {
    const expandDivider = createExpandDivider();
    categoriesContainer.append(expandDivider);

    // Add hidden categories container
    const hiddenContainer = $('<div class="hidden-categories" style="display: none;"></div>');

    hiddenCategories.forEach((category, index) => {
      const categorySection = createCategorySection(category, index + 4);
      hiddenContainer.append(categorySection);
    });

    categoriesContainer.append(hiddenContainer);
  }

  // Replace existing content but keep contact section and footer
  const contactSection = $(".contact-section").detach();
  container.empty();
  container.append(categoriesContainer);
  container.append(contactSection);
}

function createCategorySection(category, index) {
  const isEven = index % 2 === 0;
  const section = $(`
        <section class="section">
            <div class="container">
                <div class="columns is-vcentered">
                    ${
                      isEven
                        ? `
                        <!-- Left Column - Image -->
                        <div class="column is-5">
                            <div class="category-image-container visible">
                                <figure class="image">
                                    <img
                                        src="${category.image}"
                                        alt="${category.title} Illustration"
                                        class="category-image is-rounded"
                                    />
                                </figure>
                            </div>
                        </div>
                        <!-- Right Column - Content -->
                        <div class="column is-6 is-offset-1">
                            <div class="category-content">
                                <h1 class="title is-1 category-title has-text-black">${category.title}</h1>
                                <div class="content category-description">
                                    <p class="is-size-5">
                                        ${category.description}
                                    </p>
                                </div>
                                <a href="category-details.html#${category.id}" class="button category-btn">
                                    <span>Explore ${category.title.split(" ")[0]}</span>
                                    <span class="icon">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    `
                        : `
                        <!-- Left Column - Content -->
                        <div class="column is-6 is-offset-1">
                            <div class="category-content">
                                <h1 class="title is-1 category-title has-text-black">${category.title}</h1>
                                <div class="content category-description">
                                    <p class="is-size-5">
                                        ${category.description}
                                    </p>
                                </div>
                                <a href="category-details.html#${category.id}" class="button category-btn">
                                    <span>Explore ${category.title.split(" ")[0]}</span>
                                    <span class="icon">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <!-- Right Column - Image -->
                        <div class="column is-5">
                            <div class="category-image-container visible">
                                <figure class="image">
                                    <img
                                        src="${category.image}"
                                        alt="${category.title} Illustration"
                                        class="category-image is-rounded"
                                    />
                                </figure>
                            </div>
                        </div>
                    `
                    }
                </div>
            </div>
        </section>
    `);

  return section;
}

function createExpandDivider() {
  return $(`
        <div class="container">
            <hr class="divider" />
            <div style="text-align: center;">
                <i class="fas fa-chevron-down divider-chevron" id="expandToggle"></i>
            </div>
        </div>
    `);
}

function setupExpandToggle() {
  $(document).on("click", "#expandToggle", function () {
    const chevron = $(this);
    const hiddenCategories = $(".hidden-categories");

    if (hiddenCategories.is(":visible")) {
      // Collapse - rotate back to normal
      chevron.css("transform", "rotate(0deg)");
      hiddenCategories.slideUp(600);
    } else {
      // Expand - rotate 180 degrees to point up
      chevron.css("transform", "rotate(180deg)");
      hiddenCategories.slideDown(600);
    }
  });
}
// Categories page functionality
$(document).ready(function () {
  generateCategoriesPage();
  setupExpandToggle();
});

function generateCategoriesPage() {
  const container = $(".main-content");
  const categoriesContainer = $("<div></div>");

  // Generate first 4 categories (always visible)
  const visibleCategories = categoriesData.slice(0, 4);
  const hiddenCategories = categoriesData.slice(4);

  visibleCategories.forEach((category, index) => {
    const categorySection = createCategorySection(category, index);
    categoriesContainer.append(categorySection);
  });

  // Add divider with expand button if there are hidden categories
  if (hiddenCategories.length > 0) {
    const expandDivider = createExpandDivider();
    categoriesContainer.append(expandDivider);

    // Add hidden categories container
    const hiddenContainer = $('<div class="hidden-categories" style="display: none;"></div>');

    hiddenCategories.forEach((category, index) => {
      const categorySection = createCategorySection(category, index + 4);
      hiddenContainer.append(categorySection);
    });

    categoriesContainer.append(hiddenContainer);
  }

  // Replace existing content but keep contact section and footer
  const contactSection = $(".contact-section").detach();
  container.empty();
  container.append(categoriesContainer);
  container.append(contactSection);
}

function createCategorySection(category, index) {
  const isEven = index % 2 === 0;
  const section = $(`
        <section class="section">
            <div class="container">
                <div class="columns is-vcentered">
                    ${
                      isEven
                        ? `
                        <!-- Left Column - Image -->
                        <div class="column is-5">
                            <div class="category-image-container visible">
                                <figure class="image">
                                    <img
                                        src="${category.image}"
                                        alt="${category.title} Illustration"
                                        class="category-image is-rounded"
                                    />
                                </figure>
                            </div>
                        </div>
                        <!-- Right Column - Content -->
                        <div class="column is-6 is-offset-1">
                            <div class="category-content">
                                <h1 class="title is-1 category-title has-text-black">${category.title}</h1>
                                <div class="content category-description">
                                    <p class="is-size-5">
                                        ${category.description}
                                    </p>
                                </div>
                                <a href="category-details.html#${category.id}" class="button category-btn">
                                    <span>Explore ${category.title.split(" ")[0]}</span>
                                    <span class="icon">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    `
                        : `
                        <!-- Left Column - Content -->
                        <div class="column is-6 is-offset-1">
                            <div class="category-content">
                                <h1 class="title is-1 category-title has-text-black">${category.title}</h1>
                                <div class="content category-description">
                                    <p class="is-size-5">
                                        ${category.description}
                                    </p>
                                </div>
                                <a href="category-details.html#${category.id}" class="button category-btn">
                                    <span>Explore ${category.title.split(" ")[0]}</span>
                                    <span class="icon">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <!-- Right Column - Image -->
                        <div class="column is-5">
                            <div class="category-image-container visible">
                                <figure class="image">
                                    <img
                                        src="${category.image}"
                                        alt="${category.title} Illustration"
                                        class="category-image is-rounded"
                                    />
                                </figure>
                            </div>
                        </div>
                    `
                    }
                </div>
            </div>
        </section>
    `);

  return section;
}

function createExpandDivider() {
  return $(`
        <div class="container">
            <hr class="divider" />
            <div style="text-align: center;">
                <i class="fas fa-chevron-down divider-chevron" id="expandToggle"></i>
            </div>
        </div>
    `);
}

function setupExpandToggle() {
  $(document).on("click", "#expandToggle", function () {
    const chevron = $(this);
    const hiddenCategories = $(".hidden-categories");

    if (hiddenCategories.is(":visible")) {
      // Collapse - rotate back to normal
      chevron.css("transform", "rotate(0deg)");
      hiddenCategories.slideUp(600);
    } else {
      // Expand - rotate 180 degrees to point up
      chevron.css("transform", "rotate(180deg)");
      hiddenCategories.slideDown(600);
    }
  });
}
