fetch('database/community/data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#community .row');
    container.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = `col-lg-6 community-item ${item.type} ${item.scope}`;

      div.innerHTML = `
        <div class="community-box">
          <h3>${item.title}</h3>

          <div class="pkm-badges">
            <span class="pkm-badge drtpm">${item.badge}</span>
          </div>

          <p class="community-meta">
            <span><i class="bi bi-calendar-event"></i> ${item.year}</span>
            <span><i class="bi bi-geo-alt"></i> ${item.location}</span>
          </p>

          <p>${item.description}</p>

          <ul class="community-info">
            <li><strong>Role:</strong> ${item.role}</li>
            <li><strong>Partner:</strong> ${item.partner}</li>
            <li><strong>Funding:</strong> ${item.funding}</li>
            <li><strong>Output:</strong> ${item.output}</li>
          </ul>
        </div>
      `;

      container.appendChild(div);
    });

    /* =========================
       INIT ISOTOPE (FILTER)
    ========================= */
    const iso = new Isotope(container, {
      itemSelector: '.community-item',
      layoutMode: 'fitRows'
    });

    /* =========================
       FILTER BUTTON CLICK
    ========================= */
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {

        // active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        if (filterValue === 'all') {
          iso.arrange({ filter: '*' });
        } else {
          iso.arrange({ filter: `.${filterValue}` });
        }
      });
    });
  });
