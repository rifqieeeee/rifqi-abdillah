fetch('database/editorial/data.json')
  .then(response => response.json())
  .then(data => {

    const editorialList = document.querySelector('.editorial-board');
    const reviewerList = document.querySelector('.reviewer-activities');
    const conferenceList = document.querySelector('.conference-committees');

    editorialList.innerHTML = '';
    reviewerList.innerHTML = '';
    conferenceList.innerHTML = '';

    // helper function biar konsisten
    const createCard = (item, title, subtitle) => {
      const li = document.createElement('li');
      li.className = `publication-item year-${item.year}`;

      li.innerHTML = `
        <div class="activity-card">
          <div class="activity-role">${item.role}</div>
          <h4 class="activity-title">${title}</h4>
          <div class="activity-meta">
            ${subtitle} • ${item.year}
          </div>
        </div>
      `;

      return li;
    };

    // Editorial Board
    data.editorial_board.forEach(item => {
      editorialList.appendChild(
        createCard(item, item.journal, item.publisher)
      );
    });

    // Reviewer Activities
    data.reviewer_activities.forEach(item => {
      reviewerList.appendChild(
        createCard(item, item.journal, 'Reviewer')
      );
    });

    // Conference Committees
    data.conference_committees.forEach(item => {
      conferenceList.appendChild(
        createCard(item, item.conference, 'Conference Committee')
      );
    });

  })
  .catch(error => console.error('Error loading journal activities:', error));
