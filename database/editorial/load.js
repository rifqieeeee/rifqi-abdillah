fetch('database/editorial/data.json')
  .then(response => response.json())
  .then(data => {

    const editorialList = document.querySelector('.editorial-board');
    const reviewerList = document.querySelector('.reviewer-activities');
    const conferenceList = document.querySelector('.conference-committees');

    editorialList.innerHTML = '';
    reviewerList.innerHTML = '';
    conferenceList.innerHTML = '';

    // Editorial Board
    data.editorial_board.forEach(item => {
      const li = document.createElement('li');
      li.className = `publication-item ${item.year}`;
      li.innerHTML = `
        ${item.role} – 
        <strong>${item.journal}</strong> 
        (${item.publisher}, ${item.year})
      `;
      editorialList.appendChild(li);
    });

    // Reviewer Activities
    data.reviewer_activities.forEach(item => {
      const li = document.createElement('li');
      li.className = `publication-item ${item.year}`;
      li.innerHTML = `
        ${item.role} – 
        <strong>${item.journal}</strong> 
        (${item.year})
      `;
      reviewerList.appendChild(li);
    });

    // Conference Committees
    data.conference_committees.forEach(item => {
      const li = document.createElement('li');
      li.className = `publication-item ${item.year}`;
      li.innerHTML = `
        ${item.role} – 
        <strong>${item.conference}</strong> 
        (${item.year})
      `;
      conferenceList.appendChild(li);
    });

  })
  .catch(error => console.error('Error loading journal activities:', error));
