fetch('database/gallery/data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.isotope-container');

    if (!container) return;

    container.innerHTML = '';

    data.forEach(item => {
      const col = document.createElement('div');
      col.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.category}`;

      col.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${item.image}" class="img-fluid" alt="${item.title}">
          <div class="portfolio-info">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a href="${item.image}"
               title="${item.description}"
               data-gallery="${item.gallery}"
               class="glightbox preview-link">
              <i class="bi bi-zoom-in"></i>
            </a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

    // Re-init plugins
    imagesLoaded(container, () => {
      new Isotope(container, {
        itemSelector: '.portfolio-item',
        layoutMode: 'masonry'
      });
    });

    GLightbox({ selector: '.glightbox' });
  })
  .catch(error => {
    console.error('Error loading gallery data:', error);
  });
