const researchButtons = document.querySelectorAll('.research-filters .filter-btn');
const researchItems = document.querySelectorAll('.research-item');

researchButtons.forEach(button => {
button.addEventListener('click', () => {
    researchButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    researchItems.forEach(item => {
    if (filter === 'all' || item.classList.contains(filter)) {
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
    });
});
});

const teachingButtons = document.querySelectorAll('.teaching-filters .filter-btn');
const teachingItems = document.querySelectorAll('.teaching-item');

teachingButtons.forEach(button => {
button.addEventListener('click', () => {
    teachingButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    teachingItems.forEach(item => {
    if (filter === 'all' || item.classList.contains(filter)) {
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
    });
});
});

const communityButtons = document.querySelectorAll('.community-filters .filter-btn');
const communityItems = document.querySelectorAll('.community-item');

communityButtons.forEach(button => {
button.addEventListener('click', () => {
    communityButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    communityItems.forEach(item => {
    if (filter === 'all' || item.classList.contains(filter)) {
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
    });
});
});