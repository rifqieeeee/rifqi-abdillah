fetch('database/publications/data.json')
  .then(response => response.json())
  .then(data => {
    const internationalList = document.querySelector('.col-lg-6:nth-child(1) .publication-list');
    const nationalList = document.querySelector('.col-lg-6:nth-child(2) .publication-list');

    internationalList.innerHTML = '';
    nationalList.innerHTML = '';

    data.publications.forEach(pub => {

      // Regex untuk Rifqi Abdillah atau R. Abdillah (case-insensitive)
      const authorRegex = /\b(Rifqi\s+Abdillah|R\.\s*Abdillah)\b/gi;

      // Ganti dengan versi bold
      const formattedAuthors = pub.authors.replace(
        authorRegex,
        '<strong>$1</strong>'
      );

      const li = document.createElement('li');
      li.className = `publication-item ${pub.type} ${pub.year}`;
      li.style.textAlign = 'justify';

      li.innerHTML = `
        ${formattedAuthors} (${pub.year}).  
        <strong><em>${pub.title}</em></strong>.  
        ${pub.venue}${pub.pages ? ', ' + pub.pages : ''}${pub.publisher ? ', ' + pub.publisher : ''}.
        <a href="${pub.link}" target="_blank">[DOI]</a>
      `;

      if (pub.category === 'international') {
        internationalList.appendChild(li);
      } else {
        nationalList.appendChild(li);
      }
    });
  })
  .catch(error => console.error('Error loading publications:', error));
