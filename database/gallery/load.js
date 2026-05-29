let galleryData = [];
let currentPage = 1;
const itemsPerPage = 12;

fetch('database/gallery/data.json')
  .then(response => response.json())
  .then(data => {
    galleryData = data;
    renderGallery();
    renderPagination();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  })
  .catch(error => {
    console.error('Error loading gallery data:', error);
  });

function renderGallery() {
  const container = document.querySelector('.isotope-container');
  if (!container) return;

  container.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = galleryData.slice(start, end);

  paginatedItems.forEach(item => {
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

  imagesLoaded(container, () => {
    new Isotope(container, {
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });
  });

  GLightbox({ selector: '.glightbox' });
}

function renderPagination() {
  const portfolioSection = document.querySelector('#portfolio .container:last-child');
  if (!portfolioSection) return;

  let pagination = document.querySelector('.gallery-pagination');

  if (!pagination) {
    pagination = document.createElement('div');
    pagination.className = 'gallery-pagination text-center mt-4';
    portfolioSection.appendChild(pagination);
  }

  pagination.innerHTML = '';

  const totalPages = Math.ceil(galleryData.length / itemsPerPage);

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.className = 'btn btn-outline-primary btn-sm mx-1';
  prevBtn.disabled = currentPage === 1;

  prevBtn.addEventListener('click', () => {
    currentPage--;
    renderGallery();
    renderPagination();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = `btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;

    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderGallery();
      renderPagination();

      window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    });

    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'btn btn-outline-primary btn-sm mx-1';
  nextBtn.disabled = currentPage === totalPages;

  nextBtn.addEventListener('click', () => {
    currentPage++;
    renderGallery();
    renderPagination();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  pagination.appendChild(nextBtn);
}