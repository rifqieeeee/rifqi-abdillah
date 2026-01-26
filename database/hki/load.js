fetch('database/hki/data.json')
  .then(response => response.json())
  .then(data => {
    const hkiList = document.querySelector('#hki-patents .publication-list');
    hkiList.innerHTML = '';

    data.hki.forEach(item => {
      const li = document.createElement('li');
      li.className = `publication-item ${item.year}`;

      li.innerHTML = `
        ${item.authors} (${item.year}). 
        <strong>${item.title}</strong>. 
        ${item.type}, ${item.institution}.
      `;

      hkiList.appendChild(li);
    });
  })
  .catch(error => console.error('Error loading HKI data:', error));
