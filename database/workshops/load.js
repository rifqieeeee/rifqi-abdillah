fetch('database/workshops/data.json')
  .then(response => response.json())
  .then(data => {
    const workshopList = document.querySelector('#workshops .row');

    workshopList.innerHTML = '';

    data.workshops.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-lg-4 col-md-6';

      div.innerHTML = `
        <div class="workshop-box">
          <h5>${item.title}</h5>
          <p><strong>${item.issuer}</strong> – ${item.date}</p>
        </div>
      `;

      workshopList.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading workshop data:', error));