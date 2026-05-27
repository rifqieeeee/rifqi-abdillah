fetch('database/honor/data.json')
  .then(response => response.json())
  .then(data => {
    const honorList = document.querySelector('#honors .row');

    honorList.innerHTML = '';

    data.honors.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-4 col-md-6';

      div.innerHTML = `
        <div class="def-box award-item p-2 border rounded text-center">
          <h5 class="mb-1">
            <img src="https://flagcdn.com/${item.country}.svg" alt="${item.flagAlt}" style="width:20px; height:auto; margin-right:5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.486);">
            ${item.title}
          </h5>
          <p class="mb-0"><em>${item.event}</em></p>
        </div>
      `;

      honorList.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading honor data:', error));