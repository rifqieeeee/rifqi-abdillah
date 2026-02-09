let teachingIsotope = null;
let activityIsotope = null;

fetch("database/teaching/data.json")
  .then(res => res.json())
  .then(data => {
    loadTeaching(data.teaching);
    loadActivities(data.activities);
  })
  .catch(err => console.error("Failed to load teaching data:", err));

function loadTeaching(items) {
  const container = document.querySelector("#teaching .row");
  container.innerHTML = "";

  items.forEach(item => {
    container.innerHTML += `
      <div class="col-lg-6 teaching-item ${item.level} ${item.type}">
        <div class="teaching-box">
          <h3>${item.title}</h3>

          <p class="teaching-meta">
            <span>
              <i class="bi bi-mortarboard"></i>
              ${capitalize(item.level)}
            </span>
            <span>
              <i class="bi ${getTeachingIcon(item.type)}"></i>
              ${capitalize(item.type)}
            </span>
            <span>
              <i class="bi bi-calendar-event"></i>
              ${item.semester}
            </span>
          </p>

          <p>${item.description}</p>

          <ul class="teaching-info">
            <li><strong>Role:</strong> ${item.role}</li>
            <li><strong>Department:</strong> ${item.department}</li>
            <li><strong>Credits:</strong> ${item.credits}</li>
            <li><strong>Number of Classes:</strong> ${item.classes}</li>
          </ul>
        </div>
      </div>
    `;
  });

  initTeachingFilters();
}

function initTeachingFilters() {
  const grid = document.querySelector("#teaching .row");

  // destroy jika reload
  if (teachingIsotope) {
    teachingIsotope.destroy();
  }

  teachingIsotope = new Isotope(grid, {
    itemSelector: ".teaching-item",
    layoutMode: "fitRows"
  });

  const filterButtons = document.querySelectorAll(
    "#teaching .filter-btn"
  );

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      teachingIsotope.arrange({
        filter: filterValue === "all" ? "*" : `.${filterValue}`
      });
    });
  });
}

function loadActivities(items) {
  const container = document.querySelector("#activities .row");
  container.innerHTML = "";

  items.forEach(item => {
    container.innerHTML += `
      <div class="col-lg-6 teaching-item ${item.category}">
        <div class="teaching-box">
          <h3>${item.title}</h3>

          <p class="teaching-meta">
            <span>
              <i class="bi ${getActivityIcon(item.category)}"></i>
              ${capitalize(item.category)}
            </span>
            <span>
              <i class="bi bi-building"></i>
              ${item.institution}
            </span>
            <span>
              <i class="bi bi-calendar-event"></i>
              ${item.date}
            </span>
          </p>

          <p>${item.description}</p>

          <ul class="teaching-info">
            <li><strong>Organizer:</strong> ${item.organizer}</li>
            <li><strong>Audience:</strong> ${item.audience}</li>
            <li><strong>Venue:</strong> ${item.venue}</li>
            <li><strong>Mode:</strong> ${item.mode}</li>
          </ul>
        </div>
      </div>
    `;
  });

  initActivityFilters();
}

function initActivityFilters() {
  const grid = document.querySelector("#activities .row");

  // destroy jika sudah pernah dibuat
  if (activityIsotope) {
    activityIsotope.destroy();
  }

  activityIsotope = new Isotope(grid, {
    itemSelector: ".teaching-item",
    layoutMode: "fitRows"
  });

  const filterButtons = document.querySelectorAll(
    "#activities .filter-btn"
  );

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      activityIsotope.arrange({
        filter: filterValue === "all" ? "*" : `.${filterValue}`
      });
    });
  });
}


function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getTeachingIcon(type) {
  const icons = {
    theory: "bi-book",
    practical: "bi-tools"
  };
  return icons[type] || "bi-easel";
}

function getActivityIcon(category) {
  const icons = {
    speaker: "bi-mic",
    workshop: "bi-tools",
    webinar: "bi-camera-video"
  };
  return icons[category] || "bi-calendar-event";
}
