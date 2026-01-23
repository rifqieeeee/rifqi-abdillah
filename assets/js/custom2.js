document.querySelectorAll('.teaching').forEach(section => {

  const filterButtons = section.querySelectorAll('.filter-btn');
  const items = section.querySelectorAll('.teaching-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

      // aktifkan tombol
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

    });
  });

});
