document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const printButton = document.getElementById('print-gallery-btn');
  const printPortfolio = document.getElementById('print-portfolio');
  const pagesContainer = document.getElementById('print-pages-container');
  const galleryDataUrl = 'database/gallery/data.json';
  const ITEMS_PER_PAGE = 9;

  let galleryDataCache = null;
  let isPreparingPrint = false;

  function normalizeText(value) {
    return value === null || value === undefined ? '' : String(value).trim();
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = text;
    }

    return element;
  }

  function createHeader() {
    const header = createElement('header', 'print-page-header');

    header.innerHTML = `
      <div class="print-profile">
        <img
          src="assets/img/foto profil.jpg"
          alt="Rifqi Abdillah"
          class="print-logo"
        >

        <div class="print-identity">
          <h1>Rifqi Abdillah, S.Tr.T., M.Kom.</h1>

          <p class="print-profession">
            Lecturer | Researcher | Artificial Intelligence &amp; IoT Enthusiast
          </p>

          <div class="print-contact">
            <span>rifqiabdillah@unesa.ac.id</span>
            <span>+62 853 3162 4441</span>
            <span>Surabaya, Indonesia</span>
          </div>

          <div class="print-contact">
            <span>linkedin.com/in/rifqi-abdi</span>
            <span>www.rifqiabdillah.my.id</span>
          </div>
        </div>
      </div>
    `;

    return header;
  }

  function createIntro() {
    const intro = createElement('div', 'print-document-intro');

    intro.innerHTML = `
      <span>PROFESSIONAL DOCUMENTATION</span>

      <h2>Gallery Portfolio</h2>

      <p>
        Selected documentation of research, teaching, community service,
        professional collaboration, academic activities, and technological projects.
      </p>
    `;

    return intro;
  }

  function createFooter(pageNumber, totalPages) {
    const footer = createElement('footer', 'print-page-footer');

    footer.innerHTML = `
      <span>Rifqi Abdillah — Gallery Portfolio</span>
      <span>Page ${pageNumber} of ${totalPages}</span>
    `;

    return footer;
  }

  function createPrintCard(item, index) {
    const card = createElement('article', 'print-gallery-card');

    const imageWrapper = createElement(
      'div',
      'print-gallery-image-wrapper'
    );

    const image = createElement(
      'img',
      'print-gallery-image'
    );

    const title = normalizeText(item.title);
    const description = normalizeText(item.description);
    const category = normalizeText(item.category);
    const imagePath = normalizeText(item.image);

    image.src = imagePath || 'assets/img/foto profil.jpg';

    image.alt =
      description ||
      title ||
      `Gallery portfolio documentation ${index + 1}`;

    image.loading = 'eager';
    image.decoding = 'sync';

    image.onerror = function () {
      image.onerror = null;
      image.src = 'assets/img/foto profil.jpg';
      image.style.objectFit = 'contain';
      image.style.padding = '8mm';
    };

    imageWrapper.appendChild(image);

    const content = createElement(
      'div',
      'print-gallery-content'
    );

    if (category) {
      content.appendChild(
        createElement(
          'div',
          'print-gallery-meta',
          category
        )
      );
    }

    if (title) {
      content.appendChild(
        createElement(
          'h3',
          'print-gallery-title',
          title
        )
      );
    }

    content.appendChild(
      createElement(
        'p',
        'print-gallery-description',
        description || 'Professional activity documentation.'
      )
    );

    card.appendChild(imageWrapper);
    card.appendChild(content);

    return card;
  }

  async function loadGalleryData() {
    if (galleryDataCache) {
      return galleryDataCache;
    }

    const response = await fetch(galleryDataUrl, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load gallery data. HTTP status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new TypeError(
        'Gallery data must use an array format.'
      );
    }

    galleryDataCache = data.filter(function (item) {
      return (
        item &&
        typeof item === 'object' &&
        (
          normalizeText(item.image) ||
          normalizeText(item.title) ||
          normalizeText(item.description)
        )
      );
    });

    return galleryDataCache;
  }

  function formatCategoryName(category) {
    const categoryNames = {
      campus: 'Campus Activities',
      research: 'Research Activities',
      teaching: 'Teaching Activities',
      speech: 'Speaking Engagements',
      workshop: 'Workshops',
      webinar: 'Webinars',
      school: 'School and Educational Activities',
      other: 'Other Activities'
    };

    return categoryNames[category] || category;
  }

  function groupGalleryByCategory(data) {
    const categoryOrder = [
      'campus',
      'research',
      'teaching',
      'speech',
      'workshop',
      'webinar',
      'school',
      'other'
    ];

    const groupedData = {};

    data.forEach(function (item) {
      const category =
        normalizeText(item.category).toLowerCase() || 'other';

      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      groupedData[category].push(item);
    });

    return categoryOrder
      .filter(function (category) {
        return (
          groupedData[category] &&
          groupedData[category].length > 0
        );
      })
      .map(function (category) {
        return {
          category: category,
          items: groupedData[category]
        };
      });
  }

  function chunkItems(items, size) {
    const chunks = [];

    for (
      let index = 0;
      index < items.length;
      index += size
    ) {
      chunks.push(
        items.slice(index, index + size)
      );
    }

    return chunks;
  }

  function buildPageDefinitions(data) {
    const groups = groupGalleryByCategory(data);
    const pageDefinitions = [];

    groups.forEach(function (group) {
      const chunks = chunkItems(
        group.items,
        ITEMS_PER_PAGE
      );

      chunks.forEach(function (items, chunkIndex) {
        pageDefinitions.push({
          category: group.category,
          items: items,
          continued: chunkIndex > 0
        });
      });
    });

    return pageDefinitions;
  }

  function renderPrintGallery(data) {
    pagesContainer.replaceChildren();

    if (!Array.isArray(data) || data.length === 0) {
      const page = createElement(
        'section',
        'print-page'
      );

      page.appendChild(createHeader());
      page.appendChild(createIntro());

      page.appendChild(
        createElement(
          'div',
          'print-empty-message',
          'No gallery documentation is currently available.'
        )
      );

      page.appendChild(
        createFooter(1, 1)
      );

      pagesContainer.appendChild(page);

      return;
    }

    const pageDefinitions =
      buildPageDefinitions(data);

    const totalPages =
      pageDefinitions.length;

    const fragment =
      document.createDocumentFragment();

    pageDefinitions.forEach(function (
      definition,
      pageIndex
    ) {
      const page = createElement(
        'section',
        'print-page'
      );

      page.appendChild(createHeader());

      if (pageIndex === 0) {
        page.appendChild(createIntro());
      }

      const heading = createElement(
        'div',
        'print-category-heading'
      );

      const headingText =
        formatCategoryName(definition.category) +
        (definition.continued
          ? ' — Continued'
          : '');

      heading.appendChild(
        createElement(
          'h3',
          '',
          headingText
        )
      );

      heading.appendChild(
        createElement(
          'span',
          '',
          `${definition.items.length} ${
            definition.items.length === 1
              ? 'documentation'
              : 'documentations'
          }`
        )
      );

      page.appendChild(heading);

      const grid = createElement(
        'div',
        'print-gallery-grid'
      );

      definition.items.forEach(function (
        item,
        itemIndex
      ) {
        grid.appendChild(
          createPrintCard(
            item,
            itemIndex
          )
        );
      });

      page.appendChild(grid);

      page.appendChild(
        createFooter(
          pageIndex + 1,
          totalPages
        )
      );

      fragment.appendChild(page);
    });

    pagesContainer.appendChild(fragment);
  }

  function waitForPrintImages() {
    const images = Array.from(
      document.querySelectorAll(
        '#print-portfolio img'
      )
    );

    return Promise.all(
      images.map(function (image) {
        if (image.complete) {
          return Promise.resolve();
        }

        return new Promise(function (resolve) {
          image.addEventListener(
            'load',
            resolve,
            {
              once: true
            }
          );

          image.addEventListener(
            'error',
            resolve,
            {
              once: true
            }
          );
        });
      })
    );
  }

  async function printGalleryPortfolio() {
    if (isPreparingPrint) {
      return;
    }

    isPreparingPrint = true;

    const originalButtonContent =
      printButton.innerHTML;

    printButton.disabled = true;

    printButton.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" ' +
      'aria-hidden="true"></span>Preparing Portfolio...';

    try {
      const galleryData =
        await loadGalleryData();

      renderPrintGallery(galleryData);

      printPortfolio.setAttribute(
        'aria-hidden',
        'false'
      );

      await waitForPrintImages();

      await new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(resolve);
        });
      });

      window.print();
    } catch (error) {
      console.error(
        'Portfolio print error:',
        error
      );

      alert(
        'Gallery portfolio could not be prepared. ' +
        'Please ensure database/gallery/data.json ' +
        'exists and contains valid data.'
      );
    } finally {
      printButton.disabled = false;
      printButton.innerHTML =
        originalButtonContent;
      isPreparingPrint = false;
    }
  }

  if (
    printButton &&
    printPortfolio &&
    pagesContainer
  ) {
    printButton.addEventListener(
      'click',
      printGalleryPortfolio
    );
  } else {
    console.error(
      'Portfolio print elements were not found. ' +
      'Ensure that #print-gallery-btn, #print-portfolio, ' +
      'and #print-pages-container exist in the HTML.'
    );
  }

  window.addEventListener(
    'afterprint',
    function () {
      printPortfolio.setAttribute(
        'aria-hidden',
        'true'
      );
    }
  );
});