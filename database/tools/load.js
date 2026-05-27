fetch('database/tools/data.json')
  .then(response => response.json())
  .then(data => {
    const toolsList = document.querySelector('#tools .row');

    toolsList.innerHTML = '';

    data.tools.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-4 col-md-6';

      const listItems = item.items.map(tool => `<li>${tool}</li>`).join('');

      div.innerHTML = `
        <div class="skill-box p-3 border rounded def-box text-center">
          <h5 class="skill-title">
            <i class="${item.icon}"></i>${item.title}
          </h5>
          <ul class="list-unstyled mb-0">
            ${listItems}
          </ul>
        </div>
      `;

      toolsList.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading tools data:', error));