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

/* =========================================================
   GLOBAL LAYOUT LOADER
   Header + Footer → baru Main JS
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  try {

    /* =====================================================
       LOAD HEADER & FOOTER BERSAMAAN
    ===================================================== */

    const [headerResponse, footerResponse] = await Promise.all([
      fetch("/assets/html/header.html"),
      fetch("/assets/html/footer.html")
    ]);

    if (!headerResponse.ok) {
      throw new Error(
        `Failed to load header: ${headerResponse.status}`
      );
    }

    if (!footerResponse.ok) {
      throw new Error(
        `Failed to load footer: ${footerResponse.status}`
      );
    }

    const [headerHTML, footerHTML] = await Promise.all([
      headerResponse.text(),
      footerResponse.text()
    ]);


    /* =====================================================
       INSERT HEADER
    ===================================================== */

    const oldHeader =
      document.querySelector("#header");

    if (oldHeader) {

      oldHeader.outerHTML = headerHTML;

    } else {

      document.body.insertAdjacentHTML(
        "afterbegin",
        headerHTML
      );

    }


    /* =====================================================
       INSERT FOOTER
    ===================================================== */

    const oldFooter =
      document.querySelector("#footer");

    if (oldFooter) {

      oldFooter.outerHTML = footerHTML;

    } else {

      const scrollTop =
        document.querySelector("#scroll-top");

      if (scrollTop) {

        scrollTop.insertAdjacentHTML(
          "beforebegin",
          footerHTML
        );

      } else {

        document.body.insertAdjacentHTML(
          "beforeend",
          footerHTML
        );

      }

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    let currentPage =
      window.location.pathname
        .split("/")
        .pop();

    if (
      !currentPage ||
      currentPage === ""
    ) {
      currentPage = "index.html";
    }

    document
      .querySelectorAll("#navmenu a")
      .forEach(link => {

        link.classList.remove("active");
        link.removeAttribute("aria-current");

        const href =
          link.getAttribute("href");

        if (href === currentPage) {

          link.classList.add("active");

          link.setAttribute(
            "aria-current",
            "page"
          );

        }

      });


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const headerToggle =
      document.querySelector(".header-toggle");

    if (headerToggle) {

      headerToggle.addEventListener(
        "click",
        () => {

          document.body.classList.toggle(
            "mobile-nav-active"
          );

          headerToggle.classList.toggle(
            "bi-list"
          );

          headerToggle.classList.toggle(
            "bi-x"
          );

        }
      );

    }


    /* =====================================================
       LOAD MAIN.JS SETELAH HEADER SUDAH ADA
    ===================================================== */

    const mainScript =
      document.createElement("script");

    mainScript.src =
      "assets/js/main.js";

    mainScript.onload = () => {

      console.log(
        "Main JS loaded after layout."
      );

      /* Kalau window load sudah terlewat,
         pastikan preloader tetap hilang */
      const preloader =
        document.querySelector("#preloader");

      if (preloader) {
        preloader.remove();
      }

    };

    mainScript.onerror = () => {

      console.error(
        "Failed to load main.js"
      );

      /* Jangan biarkan loading berputar terus */
      const preloader =
        document.querySelector("#preloader");

      if (preloader) {
        preloader.remove();
      }

    };

    document.body.appendChild(mainScript);


  } catch (error) {

    console.error(
      "Layout could not be loaded:",
      error
    );

    /* Emergency fallback */
    const preloader =
      document.querySelector("#preloader");

    if (preloader) {
      preloader.remove();
    }

  }

});

/* =====================================================
   LOAD MAIN.JS SETELAH HEADER SUDAH ADA
===================================================== */

const mainScript = document.createElement("script");

mainScript.src = "/assets/js/main.js";

mainScript.onload = () => {

  console.log(
    "Header, footer, and main.js loaded successfully."
  );


  /* Trigger event load untuk fungsi bawaan main.js */
  window.dispatchEvent(new Event("load"));


  /* Pastikan AOS aktif */
  if (typeof AOS !== "undefined") {

    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });

    AOS.refreshHard();

  }


  /* Hapus preloader */
  const preloader =
    document.querySelector("#preloader");

  if (preloader) {
    preloader.remove();
  }

};

mainScript.onerror = () => {

  console.error("Failed to load main.js");

  const preloader =
    document.querySelector("#preloader");

  if (preloader) {
    preloader.remove();
  }

};

document.body.appendChild(mainScript);