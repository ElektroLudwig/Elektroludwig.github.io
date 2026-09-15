/* ==================================================
   PRI OBNOVENÍ STRÁNKY VŽDY ZAČAŤ HORE
================================================== */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function() {

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

});


/* ==================================================
   ANIMÁCIE PRI SCROLLOVANÍ
================================================== */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    function(entries) {

      entries.forEach(function(entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }

      });

    },
    {
      threshold: 0.12
    }
  );

revealElements.forEach(function(element) {
  revealObserver.observe(element);
});


/* ==================================================
   AKTÍVNA POLOŽKA MENU
================================================== */

const sections = [
  document.getElementById("onas"),
  document.getElementById("oblasti-realizacie"),
  document.getElementById("projekty"),
  document.getElementById("kontakt")
];

const menuLinks =
  document.querySelectorAll(".menu [data-section]");


function updateActiveMenu() {

  let currentSection = "";

  sections.forEach(function(section) {

    if (!section) {
      return;
    }

    const rect =
      section.getBoundingClientRect();

    if (
      rect.top <= 220 &&
      rect.bottom >= 220
    ) {
      currentSection = section.id;
    }

  });


  menuLinks.forEach(function(link) {

    link.classList.remove("active");

    if (
      link.dataset.section === currentSection
    ) {
      link.classList.add("active");
    }

  });

}


window.addEventListener(
  "scroll",
  updateActiveMenu
);

updateActiveMenu();


/* ==================================================
   MOBILNÉ ROZBAĽOVACIE MENU
================================================== */

const realizationsDropdown =
  document.getElementById("realizationsDropdown");

const dropdownToggle =
  document.getElementById("dropdownToggle");


if (
  realizationsDropdown &&
  dropdownToggle
) {

  dropdownToggle.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      realizationsDropdown.classList.toggle(
        "mobile-open"
      );

      const isOpen =
        realizationsDropdown.classList.contains(
          "mobile-open"
        );

      dropdownToggle.setAttribute(
        "aria-expanded",
        isOpen
      );

    }
  );


  const dropdownLinks =
    document.querySelectorAll(
      ".dropdown-menu a"
    );


  dropdownLinks.forEach(function(link) {

    link.addEventListener(
      "click",
      function() {

        realizationsDropdown.classList.remove(
          "mobile-open"
        );

        dropdownToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });


  document.addEventListener(
    "click",
    function(event) {

      if (
        !realizationsDropdown.contains(event.target)
      ) {

        realizationsDropdown.classList.remove(
          "mobile-open"
        );

        dropdownToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}


/* ==================================================
   PROJEKTY / REFERENCIE
================================================== */

const projectsList =
  document.getElementById("projectsList");

const projectsEmpty =
  document.getElementById("projectsEmpty");


/* ==================================================
   POMOCNÁ FUNKCIA
   BEZPEČNÉ VLOŽENIE TEXTU DO HTML
================================================== */

function escapeProjectText(value) {

  const element =
    document.createElement("div");

  element.textContent =
    value == null ? "" : String(value);

  return element.innerHTML;

}


/* ==================================================
   VYTVORENIE PROJEKTOV
================================================== */

function renderProjects() {

  if (!projectsList) {
    return;
  }


  /*
    Ak projekty.js neobsahuje žiadny projekt,
    zobrazíme informáciu, že referencie pripravujeme.
  */

  if (
    typeof projekty === "undefined" ||
    !Array.isArray(projekty) ||
    projekty.length === 0
  ) {

    projectsList.innerHTML = "";

    if (projectsEmpty) {
      projectsEmpty.classList.add("visible");
    }

    return;
  }


  if (projectsEmpty) {
    projectsEmpty.classList.remove("visible");
  }


  projectsList.innerHTML = "";


  projekty.forEach(function(project, projectIndex) {

    const projectWrapper =
      document.createElement("div");

    projectWrapper.className =
      "project-wrapper";


    /* ----------------------------------------------
       ÚDAJE PROJEKTU
    ---------------------------------------------- */

    const projectName =
      escapeProjectText(project.nazov || "");

    const projectLocation =
      escapeProjectText(project.miesto || "");

    const projectYear =
      escapeProjectText(project.rok || "");

    const projectShortDescription =
      escapeProjectText(
        project.kratkyPopis || ""
      );

    const projectDescription =
      escapeProjectText(
        project.popis || ""
      );

    const mainImage =
      project.hlavnaFotka || "";

    const galleryPhotos =
      Array.isArray(project.fotky)
        ? project.fotky
        : [];


    /* ----------------------------------------------
       GALÉRIA
    ---------------------------------------------- */

    let galleryHTML = "";


    if (galleryPhotos.length > 0) {

      galleryHTML = `
        <h3 class="project-gallery-title">
          Fotogaléria
        </h3>

        <div class="project-gallery">
      `;


      galleryPhotos.forEach(
        function(photo, photoIndex) {

          galleryHTML += `
            <div
              class="project-gallery-item"
              data-project-index="${projectIndex}"
              data-photo-index="${photoIndex}"
              role="button"
              tabindex="0"
              aria-label="Otvoriť fotografiu ${photoIndex + 1}"
            >
              <img
                src="${escapeProjectText(photo)}"
                alt="${projectName} - fotografia ${photoIndex + 1}"
                loading="lazy"
              >
            </div>
          `;

        }
      );


      galleryHTML += `
        </div>
      `;

    }


    /* ----------------------------------------------
       HLAVNÁ KARTA + DETAIL
    ---------------------------------------------- */

    projectWrapper.innerHTML = `

      <article class="project-card">

        <div class="project-main-image">

          <img
            src="${escapeProjectText(mainImage)}"
            alt="${projectName}"
            loading="lazy"
          >

          ${
            projectYear
              ? `
                <div class="project-year">
                  ${projectYear}
                </div>
              `
              : ""
          }

        </div>


        <div class="project-content">

          ${
            projectLocation
              ? `
                <div class="project-location">
                  <i class="fas fa-location-dot"></i>
                  ${projectLocation}
                </div>
              `
              : ""
          }

          <h2>
            ${projectName}
          </h2>

          <p>
            ${projectShortDescription}
          </p>

          <button
            type="button"
            class="project-open-button"
            data-project-open="${projectIndex}"
          >
            Zobraziť projekt
            <i class="fas fa-arrow-right"></i>
          </button>

        </div>

      </article>


      <div
        class="project-detail"
        id="project-detail-${projectIndex}"
      >

        <div class="project-detail-header">

          <div class="project-detail-heading">

            ${
              projectLocation
                ? `
                  <div class="project-detail-location">
                    <i class="fas fa-location-dot"></i>

                    ${projectLocation}

                    ${
                      projectYear
                        ? ` · ${projectYear}`
                        : ""
                    }

                  </div>
                `
                : ""
            }

            <h2>
              ${projectName}
            </h2>

          </div>


          <button
            type="button"
            class="project-close-button"
            data-project-close="${projectIndex}"
            aria-label="Zatvoriť projekt"
          >
            <i class="fas fa-xmark"></i>
          </button>

        </div>


        <div class="project-detail-description">

          <p>
            ${projectDescription}
          </p>

        </div>


        ${galleryHTML}

      </div>

    `;


    projectsList.appendChild(
      projectWrapper
    );

  });


  activateProjectButtons();
  activateGallery();

}


/* ==================================================
   OTVÁRANIE A ZATVÁRANIE DETAILU PROJEKTU
================================================== */

function activateProjectButtons() {

  const openButtons =
    document.querySelectorAll(
      "[data-project-open]"
    );

  const closeButtons =
    document.querySelectorAll(
      "[data-project-close]"
    );


  openButtons.forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        const projectIndex =
          button.dataset.projectOpen;

        const detail =
          document.getElementById(
            "project-detail-" + projectIndex
          );


        if (!detail) {
          return;
        }


        /*
          Najskôr zavrieme prípadný iný
          otvorený projekt.
        */

        document
          .querySelectorAll(".project-detail.open")
          .forEach(function(openDetail) {

            if (openDetail !== detail) {
              openDetail.classList.remove("open");
            }

          });


        detail.classList.add("open");


        /*
          Jemne posunieme stránku na detail.
        */

        setTimeout(function() {

          detail.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }, 50);

      }
    );

  });


  closeButtons.forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        const projectIndex =
          button.dataset.projectClose;

        const detail =
          document.getElementById(
            "project-detail-" + projectIndex
          );

        if (!detail) {
          return;
        }


        detail.classList.remove("open");


        const openButton =
          document.querySelector(
            `[data-project-open="${projectIndex}"]`
          );


        if (openButton) {

          setTimeout(function() {

            openButton.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }, 50);

        }

      }
    );

  });

}


/* ==================================================
   LIGHTBOX
================================================== */

let lightbox = null;
let lightboxImage = null;
let lightboxCounter = null;

let currentProjectIndex = 0;
let currentPhotoIndex = 0;


/* ==================================================
   VYTVORENIE LIGHTBOXU
================================================== */

function createLightbox() {

  if (lightbox) {
    return;
  }


  lightbox =
    document.createElement("div");

  lightbox.className =
    "project-lightbox";


  lightbox.innerHTML = `

    <button
      type="button"
      class="lightbox-close"
      aria-label="Zatvoriť fotografiu"
    >
      <i class="fas fa-xmark"></i>
    </button>


    <button
      type="button"
      class="lightbox-prev"
      aria-label="Predchádzajúca fotografia"
    >
      <i class="fas fa-chevron-left"></i>
    </button>


    <img
      class="project-lightbox-image"
      src=""
      alt=""
    >


    <button
      type="button"
      class="lightbox-next"
      aria-label="Nasledujúca fotografia"
    >
      <i class="fas fa-chevron-right"></i>
    </button>


    <div class="lightbox-counter"></div>

  `;


  document.body.appendChild(
    lightbox
  );


  lightboxImage =
    lightbox.querySelector(
      ".project-lightbox-image"
    );

  lightboxCounter =
    lightbox.querySelector(
      ".lightbox-counter"
    );


  const closeButton =
    lightbox.querySelector(
      ".lightbox-close"
    );

  const previousButton =
    lightbox.querySelector(
      ".lightbox-prev"
    );

  const nextButton =
    lightbox.querySelector(
      ".lightbox-next"
    );


  closeButton.addEventListener(
    "click",
    closeLightbox
  );


  previousButton.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();
      showPreviousPhoto();

    }
  );


  nextButton.addEventListener(
    "click",
    function(event) {

      event.stopPropagation();
      showNextPhoto();

    }
  );


  /*
    Kliknutie na čierne pozadie
    zatvorí fotografiu.
  */

  lightbox.addEventListener(
    "click",
    function(event) {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );

}


/* ==================================================
   AKTIVÁCIA FOTIEK V GALÉRII
================================================== */

function activateGallery() {

  const galleryItems =
    document.querySelectorAll(
      ".project-gallery-item"
    );


  galleryItems.forEach(function(item) {

    item.addEventListener(
      "click",
      function() {

        const projectIndex =
          Number(item.dataset.projectIndex);

        const photoIndex =
          Number(item.dataset.photoIndex);

        openLightbox(
          projectIndex,
          photoIndex
        );

      }
    );


    /*
      Enter alebo medzerník otvorí fotku
      aj pri ovládaní klávesnicou.
    */

    item.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          const projectIndex =
            Number(item.dataset.projectIndex);

          const photoIndex =
            Number(item.dataset.photoIndex);

          openLightbox(
            projectIndex,
            photoIndex
          );

        }

      }
    );

  });

}


/* ==================================================
   OTVORENIE LIGHTBOXU
================================================== */

function openLightbox(
  projectIndex,
  photoIndex
) {

  if (
    typeof projekty === "undefined" ||
    !projekty[projectIndex]
  ) {
    return;
  }


  const photos =
    Array.isArray(
      projekty[projectIndex].fotky
    )
      ? projekty[projectIndex].fotky
      : [];


  if (!photos[photoIndex]) {
    return;
  }


  createLightbox();


  currentProjectIndex =
    projectIndex;

  currentPhotoIndex =
    photoIndex;


  updateLightbox();


  lightbox.classList.add("open");

  document.body.style.overflow =
    "hidden";

}


/* ==================================================
   AKTUALIZÁCIA FOTKY V LIGHTBOXE
================================================== */

function updateLightbox() {

  const project =
    projekty[currentProjectIndex];

  if (!project) {
    return;
  }


  const photos =
    Array.isArray(project.fotky)
      ? project.fotky
      : [];


  if (photos.length === 0) {
    return;
  }


  lightboxImage.src =
    photos[currentPhotoIndex];

  lightboxImage.alt =
    (project.nazov || "Projekt") +
    " - fotografia " +
    (currentPhotoIndex + 1);


  lightboxCounter.textContent =
    (currentPhotoIndex + 1) +
    " / " +
    photos.length;


  const previousButton =
    lightbox.querySelector(
      ".lightbox-prev"
    );

  const nextButton =
    lightbox.querySelector(
      ".lightbox-next"
    );


  /*
    Ak je iba jedna fotografia,
    šípky nepotrebujeme.
  */

  if (photos.length <= 1) {

    previousButton.style.display =
      "none";

    nextButton.style.display =
      "none";

  } else {

    previousButton.style.display =
      "flex";

    nextButton.style.display =
      "flex";

  }

}


/* ==================================================
   PREDCHÁDZAJÚCA FOTKA
================================================== */

function showPreviousPhoto() {

  const project =
    projekty[currentProjectIndex];

  if (!project) {
    return;
  }


  const photos =
    Array.isArray(project.fotky)
      ? project.fotky
      : [];


  if (photos.length === 0) {
    return;
  }


  currentPhotoIndex--;


  if (currentPhotoIndex < 0) {
    currentPhotoIndex =
      photos.length - 1;
  }


  updateLightbox();

}


/* ==================================================
   NASLEDUJÚCA FOTKA
================================================== */

function showNextPhoto() {

  const project =
    projekty[currentProjectIndex];

  if (!project) {
    return;
  }


  const photos =
    Array.isArray(project.fotky)
      ? project.fotky
      : [];


  if (photos.length === 0) {
    return;
  }


  currentPhotoIndex++;


  if (
    currentPhotoIndex >=
    photos.length
  ) {

    currentPhotoIndex = 0;

  }


  updateLightbox();

}


/* ==================================================
   ZATVORENIE LIGHTBOXU
================================================== */

function closeLightbox() {

  if (!lightbox) {
    return;
  }


  lightbox.classList.remove("open");

  document.body.style.overflow =
    "";

}


/* ==================================================
   OVLÁDANIE LIGHTBOXU KLÁVESNICOU
================================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      !lightbox ||
      !lightbox.classList.contains("open")
    ) {
      return;
    }


    if (event.key === "Escape") {

      closeLightbox();

    }


    if (event.key === "ArrowLeft") {

      showPreviousPhoto();

    }


    if (event.key === "ArrowRight") {

      showNextPhoto();

    }

  }
);


/* ==================================================
   SPUSTENIE PROJEKTOV
================================================== */

renderProjects();


/* ==================================================
   KONTAKTNÝ FORMULÁR
   ZATIAĽ BEZ SERVEROVÉHO ODOSIELANIA
================================================== */

const inquiryForm =
  document.getElementById("inquiryForm");

const formMessage =
  document.getElementById("formMessage");


if (
  inquiryForm &&
  formMessage
) {

  inquiryForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      formMessage.textContent =
        "Formulár je pripravený. V ďalšom kroku ho pripojíme na odosielanie správ na e-mail.";

      formMessage.classList.add(
        "visible"
      );

    }
  );

}
