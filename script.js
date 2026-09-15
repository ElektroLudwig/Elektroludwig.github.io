/* ==================================================
   ELEKTRO LUDWIG
   HLAVNÝ JAVASCRIPT
================================================== */


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
   BEZPEČNÉ VLOŽENIE TEXTU
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

    const projectFolder =
      escapeProjectText(
        project.priecinok || ""
      );


    const projectBasePath =
      "images/projekty/" +
      projectFolder +
      "/";


    const mainImage =
      projectBasePath +
      "hlavna.jpeg";


    projectWrapper.innerHTML = `

      <article class="project-card">

        <div class="project-main-image">

          <img
            src="${mainImage}"
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


        <div
          class="project-gallery-area"
          id="project-gallery-area-${projectIndex}"
        >

          <h3 class="project-gallery-title">
            Fotogaléria
          </h3>

          <div
            class="project-gallery"
            id="project-gallery-${projectIndex}"
          ></div>

        </div>

      </div>

    `;


    projectsList.appendChild(
      projectWrapper
    );


    createAutomaticGallery(
      project,
      projectIndex
    );

  });


  activateProjectButtons();

}


/* ==================================================
   AUTOMATICKÁ GALÉRIA

   Automaticky skúša:
   01.jpeg
   02.jpeg
   03.jpeg
   ...
   50.jpeg

   Existujúce fotky zobrazí.
   Neexistujúce fotky odstráni.
================================================== */

function createAutomaticGallery(
  project,
  projectIndex
) {

  const gallery =
    document.getElementById(
      "project-gallery-" + projectIndex
    );

  const galleryArea =
    document.getElementById(
      "project-gallery-area-" + projectIndex
    );


  if (
    !gallery ||
    !galleryArea
  ) {
    return;
  }


  const projectFolder =
    project.priecinok || "";


  const basePath =
    "images/projekty/" +
    projectFolder +
    "/";


  /*
    Na začiatku galériu skryjeme.
    Zobrazí sa hneď po nájdení
    prvej existujúcej fotografie.
  */

  galleryArea.style.display =
    "none";


  let foundPhotos = 0;


  for (
    let photoNumber = 1;
    photoNumber <= 50;
    photoNumber++
  ) {

    const formattedNumber =
      String(photoNumber).padStart(
        2,
        "0"
      );


    const photoPath =
      basePath +
      formattedNumber +
      ".jpeg";


    const galleryItem =
      document.createElement("div");


    galleryItem.className =
      "project-gallery-item";


    galleryItem.setAttribute(
      "role",
      "button"
    );


    galleryItem.setAttribute(
      "tabindex",
      "0"
    );


    galleryItem.setAttribute(
      "data-photo-path",
      photoPath
    );


    const image =
      document.createElement("img");


    image.alt =
      (project.nazov || "Projekt") +
      " - fotografia " +
      photoNumber;


    image.loading =
      "lazy";


    /*
      DÔLEŽITÉ:
      Najskôr nastavíme load/error
      a AŽ POTOM image.src.

      Takto nám prehliadač nepreskočí
      kontrolu ani pri fotke z cache.
    */

    image.onload =
      function() {

        foundPhotos++;

        galleryArea.style.display =
          "";

      };


    image.onerror =
      function() {

        galleryItem.remove();

      };


    /*
      Kliknutie na fotografiu.
    */

    galleryItem.addEventListener(
      "click",
      function() {

        openLightboxFromGallery(
          projectIndex,
          photoPath
        );

      }
    );


    /*
      Enter alebo medzerník.
    */

    galleryItem.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openLightboxFromGallery(
            projectIndex,
            photoPath
          );

        }

      }
    );


    galleryItem.appendChild(
      image
    );


    gallery.appendChild(
      galleryItem
    );


    /*
      SRC nastavujeme úplne nakoniec.
    */

    image.src =
      photoPath;

  }

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
            "project-detail-" +
            projectIndex
          );


        if (!detail) {
          return;
        }


        document
          .querySelectorAll(
            ".project-detail.open"
          )
          .forEach(function(openDetail) {

            if (openDetail !== detail) {

              openDetail.classList.remove(
                "open"
              );

            }

          });


        detail.classList.add(
          "open"
        );


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
            "project-detail-" +
            projectIndex
          );


        if (!detail) {
          return;
        }


        detail.classList.remove(
          "open"
        );


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

let currentGalleryPhotos = [];

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
   OTVORENIE FOTKY Z GALÉRIE
================================================== */

function openLightboxFromGallery(
  projectIndex,
  clickedPhoto
) {

  const gallery =
    document.getElementById(
      "project-gallery-" +
      projectIndex
    );


  if (!gallery) {
    return;
  }


  const loadedImages =
    gallery.querySelectorAll(
      ".project-gallery-item img"
    );


  currentGalleryPhotos = [];


  loadedImages.forEach(function(image) {

    if (
      image.complete &&
      image.naturalWidth > 0
    ) {

      currentGalleryPhotos.push(
        image.src
      );

    }

  });


  if (
    currentGalleryPhotos.length === 0
  ) {
    return;
  }


  const absoluteClickedPhoto =
    new URL(
      clickedPhoto,
      window.location.href
    ).href;


  currentPhotoIndex =
    currentGalleryPhotos.indexOf(
      absoluteClickedPhoto
    );


  if (currentPhotoIndex < 0) {
    currentPhotoIndex = 0;
  }


  createLightbox();

  updateLightbox();


  lightbox.classList.add(
    "open"
  );


  document.body.style.overflow =
    "hidden";

}


/* ==================================================
   AKTUALIZÁCIA LIGHTBOXU
================================================== */

function updateLightbox() {

  if (
    !lightbox ||
    currentGalleryPhotos.length === 0
  ) {
    return;
  }


  lightboxImage.src =
    currentGalleryPhotos[
      currentPhotoIndex
    ];


  lightboxCounter.textContent =
    (currentPhotoIndex + 1) +
    " / " +
    currentGalleryPhotos.length;


  const previousButton =
    lightbox.querySelector(
      ".lightbox-prev"
    );


  const nextButton =
    lightbox.querySelector(
      ".lightbox-next"
    );


  if (
    currentGalleryPhotos.length <= 1
  ) {

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

  if (
    currentGalleryPhotos.length === 0
  ) {
    return;
  }


  currentPhotoIndex--;


  if (currentPhotoIndex < 0) {

    currentPhotoIndex =
      currentGalleryPhotos.length - 1;

  }


  updateLightbox();

}


/* ==================================================
   NASLEDUJÚCA FOTKA
================================================== */

function showNextPhoto() {

  if (
    currentGalleryPhotos.length === 0
  ) {
    return;
  }


  currentPhotoIndex++;


  if (
    currentPhotoIndex >=
    currentGalleryPhotos.length
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


  lightbox.classList.remove(
    "open"
  );


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
      !lightbox.classList.contains(
        "open"
      )
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
