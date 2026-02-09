fetch('database/hki/data.json')
  .then(response => response.json())
  .then(data => {
    const hkiList = document.querySelector('#hki-patents .publication-list');
    hkiList.innerHTML = '';

    data.hki.forEach(item => {
      const li = document.createElement('li');
      li.className = `publication-item year-${item.year}`;

      li.innerHTML = `
        <div class="hki-card">
          <div class="hki-meta">
            ${item.authors} • ${item.year}
          </div>
          <h4 class="hki-title">${item.title}</h4>
          <div class="hki-info">
            <span class="badge">${item.type}</span>
            <span class="institution">${item.institution}</span>
          </div>
        </div>
      `;

      hkiList.appendChild(li);
    });
  })
  .catch(error => console.error('Error loading HKI data:', error));
