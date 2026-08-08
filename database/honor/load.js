fetch('/database/honor/data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  })
  .then(data => {
    const honorList = document.querySelector('#honors .row');

    if (!honorList) {
      console.error('Element #honors .row tidak ditemukan.');
      return;
    }

    honorList.innerHTML = '';

    data.honors.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-4 col-md-6';

      div.innerHTML = `
        <div class="def-box award-item p-3 border rounded text-center h-100">
          
          <h5 class="mb-2">
            <img
              src="https://flagcdn.com/${item.country}.svg"
              alt="${item.flagAlt}"
              style="
                width: 20px;
                height: auto;
                margin-right: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.486);
              "
            >
            ${item.title}
          </h5>

          <p class="mb-1">
            <em>${item.event}</em>
          </p>

          <p class="mb-1">
            <strong>Organized by:</strong> ${item.institution}
          </p>

          <small class="text-muted">
            ${item.month} ${item.year}
          </small>

        </div>
      `;

      honorList.appendChild(div);
    });
  })
  .catch(error => {
    console.error('Error loading honor data:', error);
  });