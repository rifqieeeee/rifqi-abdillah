fetch('database/membership/data.json')
  .then(response => response.json())
  .then(data => {
    const membershipList = document.querySelector('#membership-list');

    membershipList.innerHTML = '';

    data.memberships.forEach(item => {
      const div = document.createElement('div');
      div.className = 'resume-item';

      div.innerHTML = `
        <h4>${item.organization}</h4>
        <p><b><i>${item.memberId}</i></b>- ${item.period}</p>
        <p><em>${item.description}</em></p>
      `;

      membershipList.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading membership data:', error));