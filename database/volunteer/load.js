fetch('database/volunteer/data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#volunteer .row');

    container.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-6 volunteer-item local';

      div.innerHTML = `
        <div class="community-box">
          <h3>${item.title}</h3>

          <p class="community-meta">
            <span><i class="bi bi-calendar-event"></i> ${item.year}</span>
            <span><i class="bi bi-geo-alt"></i> ${item.location}</span>
          </p>

          <p>${item.description}</p>

          <ul class="community-info">
            <li><strong>Role:</strong> ${item.role}</li>
            <li><strong>Partner:</strong> ${item.partner}</li>
          </ul>
        </div>
      `;
      container.appendChild(div);
    });
  });
