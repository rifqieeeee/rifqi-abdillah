fetch('database/research/data.json')
  .then(res => res.json())
  .then(data => {

    /* =========================
       RESEARCH SECTION
    ========================= */
     const researchContainer = document.getElementById('research-list');

    data.research.forEach(item => {
      researchContainer.innerHTML += `
        <div class="col-lg-6 research-item ${item.status} ${item.scope}">
          <div class="research-box">
            <h3>${item.title}</h3>

            <p class="research-meta">
              <span><i class="bi bi-calendar-event"></i> ${item.year}</span>
              <span><i class="bi bi-geo-alt"></i> ${capitalize(item.scope)}</span>
              <span class="badge status ${item.status}">
                ${capitalize(item.status)}
              </span>
            </p>

            <p>${item.description}</p>

            <ul class="research-info">
              <li><strong>Role:</strong> ${item.role}</li>
              <li><strong>Funding:</strong> ${item.funding}</li>
              <li><strong>Output:</strong> ${item.output}</li>
            </ul>
          </div>
        </div>
      `;
    });

    initResearchFilter();

    /* =========================
       OPEN SOURCE SECTION
    ========================= */
    const openSourceContainer = document.getElementById('opensource-list');

    data.opensource.forEach(p => {
      openSourceContainer.innerHTML += `
        <div class="col-lg-6 opensource-item">
          <div class="research-box">
            <h3>${p.title}</h3>

            <p class="research-meta">
              <span><i class="bi bi-cpu"></i> ${p.category}</span>
              <span><i class="bi bi-globe"></i> ${p.platform}</span>
            </p>

            <p>${p.description}</p>

            <ul class="research-info">
              <li><strong>Tech:</strong> ${p.tech.join(', ')}</li>
              <li><strong>License:</strong> ${p.license}</li>
            </ul>

            <div class="mt-3">
              <a href="${p.link}" target="_blank"
                 class="btn btn-sm btn-outline-primary">
                <i class="bi bi-box-arrow-up-right"></i> ${p.platform}
              </a>

              ${p.link2 !== "#" ? `
                <a href="${p.link2}" target="_blank" class="btn btn-sm btn-outline-success">
                  <i class="bi bi-box-arrow-up-right"></i> ${p.platform2}
                </a>
              ` : ""}


              ${p.github !== "#" ? `
                <a href="${p.github}" target="_blank" class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-github"></i> GitHub
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      `;
    });

  });

function initResearchFilter() {

  const iso = new Isotope('#research-list', {
    itemSelector: '.research-item',
    layoutMode: 'fitRows'
  });

  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      iso.arrange({
        filter: filter === 'all' ? '*' : '.' + filter
      });
    });
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
