fetch('database/community/data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#community .row');
    container.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = `col-lg-6 community-item ${item.type} ${item.scope}`;

      div.innerHTML = `
        <div class="community-box def-box">
          <h3>${item.title}</h3>

          <p class="community-meta">
            <span><i class="bi bi-calendar-event"></i> ${item.year}</span>
            <span><i class="bi bi-geo-alt"></i> ${item.location}</span>
            <span class="pkm-badge ${item.badge}">
              ${capitalize(item.badge)}
            </span>
          </p>

          <p>${item.description}</p>

          <ul class="community-info">
            <li><strong>Role:</strong> ${item.role}</li>
            <li><strong>Partner:</strong> ${item.partner}</li>
            <li><strong>Funding:</strong> ${item.funding}</li>
            <li><strong>Output:</strong> ${item.output}</li>

            ${item.news && item.news !== "#" ? `
              <li>
                <strong>News:</strong>
                <a href="${item.news}" target="_blank">
                  View News
                </a>
              </li>
            ` : ""}
          </ul>
        </div>
      `;

      container.appendChild(div);
    });

    /* =========================
       INIT ISOTOPE (FILTER)
    ========================= */
    // const iso = new Isotope(container, {
    //   itemSelector: '.community-item',
    //   layoutMode: 'fitRows'
    // });

    /* =========================
       FILTER BUTTON CLICK
    ========================= */
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.community-item');

        items.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}