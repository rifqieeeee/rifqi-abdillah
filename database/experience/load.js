fetch('database/experience/data.json')
  .then(response => response.json())
  .then(data => {
    const experienceList = document.querySelector('#experience-list');

    experienceList.innerHTML = '';

    data.experiences.forEach(item => {
      const div = document.createElement('div');
      div.className = 'resume-item';

      const durationHTML = item.duration
        ? `<span class="duration">${item.duration}</span>`
        : '';

      const descriptionHTML = item.description
        ? `<p>${item.description}</p>`
        : '';

      const itemsHTML = item.items && item.items.length > 0
        ? `
          <ul>
            ${item.items.map(list => `<li>${list}</li>`).join('')}
          </ul>
        `
        : '';

      const detailsHTML = item.details && item.details.length > 0
        ? `
          <details>
            <summary><strong>${item.detailsTitle}</strong></summary>

            <br>

            ${item.details.map(detail => `
              <p><strong>${detail.title}</strong></p>
              <p><em>${detail.subtitle}</em></p>
              <ul>
                ${detail.items.map(list => `<li>${list}</li>`).join('')}
              </ul>
            `).join('')}
          </details>
        `
        : '';

      const subRolesHTML = item.subRoles && item.subRoles.length > 0
        ? `
          <ul>
            ${item.subRoles.map(role => `
              <li>
                <strong>${role.title}</strong> <span class="text-muted">(${role.period})</span>
                <ul>
                  ${role.items.map(list => `<li>${list}</li>`).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
        `
        : '';

      div.innerHTML = `
        <h4>${item.title}</h4>
        <h5>
          ${item.period}
          ${durationHTML}
        </h5>
        <p><em>${item.institution}</em></p>

        ${descriptionHTML}
        ${itemsHTML}
        ${detailsHTML}
        ${subRolesHTML}
      `;

      experienceList.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading experience data:', error));