fetch('database/organization/data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#organization .row');

    container.innerHTML = '';

    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-6 organization-item';

      const listItems = item.items
        .map(point => `<li>${point}</li>`)
        .join('');

      div.innerHTML = `
        <div class="community-box def-box">
          <h3>${item.organization}</h3>

          <p class="community-meta">
            <span><i class="bi bi-calendar-event"></i> ${item.period}</span>
            <span><i class="bi bi-geo-alt"></i> ${item.location}</span>
          </p>

          <p><strong>${item.position}</strong></p>

          <p>${item.description}</p>

          <ul class="community-info">
            ${listItems}
          </ul>
        </div>
      `;

      container.appendChild(div);
    });
  });