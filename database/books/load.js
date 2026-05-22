fetch('database/books/data.json')
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById('books-container');

    data.books.forEach(item => {

      const card = document.createElement('div');
      card.className = 'hki-card';

      card.innerHTML = `
        <div class="hki-meta">
          ${item.authors} • ${item.year}
        </div>

        <h4 class="hki-title">
          ${item.title}
        </h4>

        <div class="hki-info">
          <span class="badge book-badge">${item.type}</span>
          <span class="institution">${item.publisher}</span>
        </div>
      `;

      container.appendChild(card);

    });

  })
  .catch(error => console.error('Error loading books:', error));