/* =========================================================
   FILTER FUNCTION
========================================================= */

function initFilter(buttonSelector, itemSelector) {

  const buttons = document.querySelectorAll(buttonSelector);
  const items = document.querySelectorAll(itemSelector);

  if (!buttons.length || !items.length) {
    return;
  }

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      /* Remove active dari semua button */
      buttons.forEach(btn => {
        btn.classList.remove("active");
      });

      /* Active button yang diklik */
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      items.forEach(item => {

        if (
          filter === "all" ||
          item.classList.contains(filter)
        ) {

          item.style.display = "block";

        } else {

          item.style.display = "none";

        }

      });

    });

  });

}


/* =========================================================
   GLOBAL LAYOUT LOADER
   Header + Footer → Main JS
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  /* =======================================================
     INITIALIZE FILTER
  ======================================================= */

  initFilter(
    ".research-filters .filter-btn",
    ".research-item"
  );

  initFilter(
    ".teaching-filters .filter-btn",
    ".teaching-item"
  );

  initFilter(
    ".community-filters .filter-btn",
    ".community-item"
  );


  try {

    /* =====================================================
       LOAD HEADER & FOOTER
    ===================================================== */

    const [headerResponse, footerResponse] = await Promise.all([

      fetch("/assets/html/header.html"),

      fetch("/assets/html/footer.html")

    ]);


    /* =====================================================
       CHECK RESPONSE
    ===================================================== */

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


    /* =====================================================
       CONVERT RESPONSE TO HTML
    ===================================================== */

    const [headerHTML, footerHTML] = await Promise.all([

      headerResponse.text(),

      footerResponse.text()

    ]);


    /* =====================================================
       INSERT HEADER
    ===================================================== */

    const oldHeader = document.querySelector("#header");

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

    const oldFooter = document.querySelector("#footer");

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

    let currentPath = window.location.pathname;

    /*
     * Jika URL:
     *
     * https://rifqiabdillah.my.id/
     *
     * dianggap sama dengan:
     *
     * /index.html
     */

    if (
      currentPath === "/" ||
      currentPath === ""
    ) {

      currentPath = "/index.html";

    }


    document
      .querySelectorAll("#navmenu a")
      .forEach(link => {

        /* Reset */
        link.classList.remove("active");
        link.removeAttribute("aria-current");


        /*
         * Convert href menjadi pathname
         *
         * /index.html
         * /about.html
         * /research.html
         * dst.
         */

        let linkPath = new URL(
          link.href,
          window.location.origin
        ).pathname;


        /* Root URL = index.html */

        if (
          linkPath === "/" ||
          linkPath === ""
        ) {

          linkPath = "/index.html";

        }


        /* Active page */

        if (linkPath === currentPath) {

          link.classList.add("active");

          link.setAttribute(
            "aria-current",
            "page"
          );

        }

      });


    /* =====================================================
       LOAD MAIN.JS
       HANYA SATU KALI
    ===================================================== */

    loadMainJS();


  } catch (error) {

    console.error(
      "Layout could not be loaded:",
      error
    );


    /* =====================================================
       EMERGENCY FALLBACK
    ===================================================== */

    const preloader =
      document.querySelector("#preloader");

    if (preloader) {

      preloader.remove();

    }

  }

});


/* =========================================================
   MAIN JS LOADER
========================================================= */

function loadMainJS() {

  /*
   * Hindari main.js dimuat dua kali
   */

  if (
    document.querySelector(
      'script[data-main-script="true"]'
    )
  ) {

    return;

  }


  const mainScript =
    document.createElement("script");


  /*
   * Gunakan absolute path.
   *
   * Jangan:
   *
   * assets/js/main.js
   *
   * karena kalau halaman berada dalam folder,
   * browser bisa mencari:
   *
   * /folder/assets/js/main.js
   */

  mainScript.src =
    "/assets/js/main.js";


  /* Identifier */
  mainScript.dataset.mainScript = "true";


  /* =======================================================
     MAIN JS SUCCESS
  ======================================================= */

  mainScript.onload = () => {

    console.log(
      "Header, footer, and main.js loaded successfully."
    );


    /*
     * main.js BootstrapMade biasanya memiliki
     * beberapa fungsi yang menunggu event:
     *
     * window.load
     *
     * Karena main.js dimuat secara dynamic,
     * window.load mungkin sudah terjadi.
     */

    if (document.readyState === "complete") {

      window.dispatchEvent(
        new Event("load")
      );

    }


    /* =====================================================
       AOS REFRESH
    ===================================================== */

    if (typeof AOS !== "undefined") {

      /*
       * Tidak perlu init berkali-kali.
       * Refresh setelah header/footer masuk.
       */

      AOS.refreshHard();

    }


    /* =====================================================
       PRELOADER FALLBACK
    ===================================================== */

    setTimeout(() => {

      const preloader =
        document.querySelector("#preloader");

      if (preloader) {

        preloader.remove();

      }

    }, 300);

  };


  /* =======================================================
     MAIN JS ERROR
  ======================================================= */

  mainScript.onerror = () => {

    console.error(
      "Failed to load main.js"
    );


    const preloader =
      document.querySelector("#preloader");

    if (preloader) {

      preloader.remove();

    }

  };


  /* =======================================================
     APPEND MAIN JS
  ======================================================= */

  document.body.appendChild(
    mainScript
  );

}