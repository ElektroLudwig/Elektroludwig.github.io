/* ==================================================
   ELEKTRO LUDWIG
   JAZYKOVÝ SYSTÉM

   Texty stránky a projektov sú uložené samostatne v:
   languages/sk.js
   languages/en.js
   a neskôr v ďalších jazykových súboroch.
================================================== */

const languagePacks = window.elektroLudwigLanguages || {};


/* ==================================================
   PODPOROVANÉ JAZYKY
   Zoznam sa vytvorí automaticky z načítaných balíkov.
================================================== */

const supportedLanguages = {};
const siteTranslations = {};

const languageFlags = {
  sk: "🇸🇰",
  en: "🇬🇧",
  de: "🇩🇪",
  pl: "🇵🇱",
  fr: "🇫🇷",
  es: "🇪🇸",
  zh: "🇨🇳"
};

Object.entries(languagePacks).forEach(function([languageCode, languagePack]) {
  supportedLanguages[languageCode] =
    languagePack.name || languageCode.toUpperCase();

  siteTranslations[languageCode] = languagePack.ui || {};
});

const languageStorageKey = "elektroludwig.language";
let currentLanguage = "sk";

try {
  const saved = localStorage.getItem(languageStorageKey);

  if (
    saved &&
    Object.prototype.hasOwnProperty.call(supportedLanguages, saved)
  ) {
    currentLanguage = saved;
  }
} catch (_) {
  // Stránka funguje aj v prípade zablokovaného localStorage.
}


/* ==================================================
   PREKLAD JEDNODUCHÉHO TEXTU
================================================== */

function t(key) {
  return (
    siteTranslations[currentLanguage]?.[key] ??
    siteTranslations.sk?.[key] ??
    key
  );
}


/* ==================================================
   JAZYKOVÉ BALÍKY
================================================== */

function getCurrentLanguagePack() {
  return languagePacks[currentLanguage] || languagePacks.sk || {};
}

function getSlovakLanguagePack() {
  return languagePacks.sk || {};
}


/* ==================================================
   PREKLAD PROJEKTOV
================================================== */

function localizedProject(project) {
  if (!project) {
    return {};
  }

  if (
    typeof dalsieRealizacie !== "undefined" &&
    project === dalsieRealizacie
  ) {
    const slovakAdditional =
      getSlovakLanguagePack().additional || {};

    const selectedAdditional =
      getCurrentLanguagePack().additional || {};

    return {
      ...project,
      ...slovakAdditional,
      ...selectedAdditional
    };
  }

  const folder = project.priecinok;

  if (!folder) {
    return { ...project };
  }

  const slovakProject =
    getSlovakLanguagePack().projects?.[folder] || {};

  const selectedProject =
    getCurrentLanguagePack().projects?.[folder] || {};

  return {
    ...project,
    ...slovakProject,
    ...selectedProject
  };
}


/* ==================================================
   PREKLAD STATICKÉHO OBSAHU
================================================== */

function applyStaticTranslations() {
  const currentPack = getCurrentLanguagePack();

  document.documentElement.lang =
    currentPack.htmlLang || currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.innerHTML = t(element.dataset.i18n);
  });

  ["title", "alt", "placeholder", "aria-label"].forEach(attribute => {
    document
      .querySelectorAll("[data-i18n-" + attribute + "]")
      .forEach(element => {
        const key = element.getAttribute("data-i18n-" + attribute);
        element.setAttribute(attribute, t(key));
      });
  });

  document.querySelectorAll("#inquiryForm [placeholder]").forEach(element => {
    element.setAttribute("aria-label", element.placeholder);
  });

  const subject = document.querySelector("#inquiryForm select");

  if (subject) {
    subject.setAttribute("aria-label", t("text103"));
  }

  const currentLanguageLabel =
    document.querySelector(".language-current span");

  if (currentLanguageLabel) {
    const currentCode =
      currentPack.code || currentLanguage.toUpperCase();

    const currentFlag =
      languageFlags[currentLanguage] || "🌐";

    currentLanguageLabel.textContent =
      currentFlag + " " + currentCode;
  }

  const languageCurrent =
    document.querySelector(".language-current");

  if (languageCurrent) {
    languageCurrent.setAttribute(
      "aria-label",
      t("chooseLanguage")
    );
  }

  document.querySelectorAll("[data-language]").forEach(link => {
    const selected =
      link.dataset.language === currentLanguage;

    if (selected) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }

    const icon = link.querySelector("i");

    if (icon) {
      icon.className = selected
        ? "fas fa-check"
        : "fas fa-language";
    }
  });
}


/* ==================================================
   PREKLAD PROJEKTOV BEZ ZATVORENIA DETAILU
   A BEZ OPÄTOVNÉHO NAČÍTANIA GALÉRIÍ
================================================== */

function refreshProjectsLanguage() {
  if (typeof projekty !== "undefined") {
    projekty.forEach((original, index) => {
      const project = localizedProject(original);

      const wrapper = document.getElementById(
        "project-detail-" + index
      )?.parentElement;

      if (!wrapper) {
        return;
      }

      wrapper.querySelectorAll("h2").forEach(element => {
        element.textContent = project.nazov || "";
      });

      const mainImage =
        wrapper.querySelector(".project-main-image img");

      if (mainImage) {
        mainImage.alt = project.nazov || "";
      }

      const location =
        wrapper.querySelector(".project-location");

      if (location) {
        location.innerHTML =
          '<i class="fas fa-location-dot"></i> ' +
          escapeProjectText(project.miesto);
      }

      const detailLocation = wrapper.querySelector(
        ".project-detail-location"
      );

      if (detailLocation) {
        detailLocation.innerHTML =
          '<i class="fas fa-location-dot"></i> ' +
          escapeProjectText(project.miesto) +
          (project.rok
            ? " · " + escapeProjectText(project.rok)
            : "");
      }

      wrapper
        .querySelectorAll(
          ".project-realization-for, .project-detail-realization-for"
        )
        .forEach(element => {
          element.innerHTML =
            "<strong>" +
            escapeProjectText(t("realizationFor")) +
            "</strong> " +
            escapeProjectText(project.realizaciaPre);
        });

      const shortDescription =
        wrapper.querySelector(".project-content > p");

      if (shortDescription) {
        shortDescription.textContent =
          project.kratkyPopis || "";
      }

      const detailDescription =
        wrapper.querySelector(".project-detail-description");

      if (detailDescription) {
        detailDescription.innerHTML =
          formatProjectDescription(project.popis);
      }

      const openButton =
        wrapper.querySelector(".project-open-button");

      if (openButton) {
        openButton.innerHTML =
          escapeProjectText(t("viewProject")) +
          ' <i class="fas fa-arrow-right"></i>';
      }

      const closeButton =
        wrapper.querySelector(".project-close-button");

      if (closeButton) {
        closeButton.setAttribute(
          "aria-label",
          t("closeProject")
        );
      }

      const galleryTitle =
        wrapper.querySelector(".project-gallery-title");

      if (galleryTitle) {
        galleryTitle.textContent = t("gallery");
      }

      wrapper.querySelectorAll(".project-gallery img").forEach(image => {
        const match = image
          .getAttribute("src")
          ?.match(/(\d+)\.jpeg$/);

        const number = match
          ? Number(match[1])
          : "";

        image.alt =
          (project.nazov || t("project")) +
          " – " +
          t("photo") +
          (number ? " " + number : "");
      });
    });
  }

  const additional =
    document.querySelector(".additional-realizations");

  if (
    additional &&
    typeof dalsieRealizacie !== "undefined"
  ) {
    const data =
      localizedProject(dalsieRealizacie);

    const heading =
      additional.querySelector("h2");

    if (heading) {
      heading.textContent =
        data.nazov || t("additionalTitle");
    }

    const label =
      additional.querySelector(
        ".additional-realizations-label"
      );

    if (label) {
      label.textContent =
        t("moreExperience");
    }

    const description =
      additional.querySelector(
        ".additional-realizations-description"
      );

    if (description) {
      description.innerHTML =
        formatProjectDescription(data.popis);
    }
  }

  if (lightbox) {
    const close =
      lightbox.querySelector(".lightbox-close");

    const previous =
      lightbox.querySelector(".lightbox-prev");

    const next =
      lightbox.querySelector(".lightbox-next");

    if (close) {
      close.setAttribute(
        "aria-label",
        t("closePhoto")
      );
    }

    if (previous) {
      previous.setAttribute(
        "aria-label",
        t("previousPhoto")
      );
    }

    if (next) {
      next.setAttribute(
        "aria-label",
        t("nextPhoto")
      );
    }

    updateLightbox();
  }
}


/* ==================================================
   ZMENA A ZAPAMÄTANIE JAZYKA
================================================== */

function setLanguage(language) {
  if (
    !Object.prototype.hasOwnProperty.call(
      supportedLanguages,
      language
    )
  ) {
    return;
  }

  currentLanguage = language;

  try {
    localStorage.setItem(
      languageStorageKey,
      language
    );
  } catch (_) {
    // Bez úložiska funguje jazyk počas otvorenej stránky.
  }

  applyStaticTranslations();
  refreshProjectsLanguage();

  if (
    typeof formMessage !== "undefined" &&
    formMessage?.classList.contains("visible")
  ) {
    formMessage.textContent =
      t("formPending");
  }

  document
    .querySelectorAll(
      "#inquiryForm input, #inquiryForm select, #inquiryForm textarea"
    )
    .forEach(element => {
      element.setCustomValidity("");

      if (element.dataset.validationShown) {
        localizeValidation(element);
      }
    });
}


/* ==================================================
   LOKALIZÁCIA VALIDÁCIE FORMULÁRA
================================================== */

function localizeValidation(element) {
  element.setCustomValidity("");

  if (element.validity.valueMissing) {
    element.setCustomValidity(
      t(
        element.type === "checkbox"
          ? "consentRequired"
          : "requiredField"
      )
    );
  } else if (
    element.validity.typeMismatch &&
    element.type === "email"
  ) {
    element.setCustomValidity(
      t("invalidEmail")
    );
  }
}


/* ==================================================
   OVLÁDANIE JAZYKOVÉHO PREPÍNAČA
================================================== */

function initializeLanguageSwitcher() {
  const switcher =
    document.querySelector(".language-switcher");

  if (!switcher) {
    applyStaticTranslations();
    return;
  }

  const toggle =
    switcher.querySelector(".language-current");

  const menu =
    switcher.querySelector(".language-menu");

  if (!toggle || !menu) {
    applyStaticTranslations();
    return;
  }

  menu.innerHTML =
    Object.entries(supportedLanguages)
      .map(([code, name]) => {
        const pack =
          languagePacks[code] || {};

        const htmlLang =
          pack.htmlLang || code;

        const flag =
          languageFlags[code] || "🌐";

        return `
          <a
            href="#"
            data-language="${code}"
            lang="${htmlLang}"
          >
            <i
              class="fas fa-language"
              aria-hidden="true"
            ></i>
            <span
              class="language-flag"
              aria-hidden="true"
            >${flag}</span>
            <span class="language-name">${name}</span>
          </a>
        `;
      })
      .join("");

  function closeMenu() {
    switcher.classList.remove("is-open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  toggle.addEventListener("click", () => {
    const open =
      switcher.classList.toggle("is-open");

    toggle.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  toggle.addEventListener(
    "keydown",
    event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();

        switcher.classList.add("is-open");

        toggle.setAttribute(
          "aria-expanded",
          "true"
        );

        menu.querySelector("a")?.focus();
      }
    }
  );

  menu.addEventListener(
    "click",
    event => {
      const link =
        event.target.closest("[data-language]");

      if (!link) {
        return;
      }

      event.preventDefault();

      setLanguage(
        link.dataset.language
      );

      closeMenu();
      toggle.focus();
    }
  );

  document.addEventListener(
    "click",
    event => {
      if (!switcher.contains(event.target)) {
        closeMenu();
      }
    }
  );

  switcher.addEventListener(
    "focusout",
    event => {
      if (
        !switcher.contains(
          event.relatedTarget
        )
      ) {
        closeMenu();
      }
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        switcher.classList.contains("is-open")
      ) {
        closeMenu();
        toggle.focus();
      }
    }
  );

  document
    .querySelectorAll(
      "#inquiryForm input, #inquiryForm select, #inquiryForm textarea"
    )
    .forEach(element => {
      element.addEventListener(
        "invalid",
        () => {
          element.dataset.validationShown =
            "true";

          localizeValidation(element);
        }
      );

      element.addEventListener(
        "input",
        () => {
          element.setCustomValidity("");

          delete element.dataset
            .validationShown;
        }
      );

      element.addEventListener(
        "change",
        () => {
          element.setCustomValidity("");

          delete element.dataset
            .validationShown;
        }
      );
    });

  applyStaticTranslations();
}


/* ==================================================
   PRI OBNOVENÍ STRÁNKY ZAČAŤ HORE
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
          entry.target.classList.add(
            "visible"
          );
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
  document.getElementById(
    "oblasti-realizacie"
  ),
  document.getElementById("projekty"),
  document.getElementById("kontakt")
];

const menuLinks =
  document.querySelectorAll(
    ".menu [data-section]"
  );

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
      currentSection =
        section.id;
    }
  });

  menuLinks.forEach(function(link) {
    link.classList.remove("active");

    if (
      link.dataset.section ===
      currentSection
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
  document.getElementById(
    "realizationsDropdown"
  );

const dropdownToggle =
  document.getElementById(
    "dropdownToggle"
  );

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
        !realizationsDropdown.contains(
          event.target
        )
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
  document.getElementById(
    "projectsList"
  );

const projectsEmpty =
  document.getElementById(
    "projectsEmpty"
  );


/* ==================================================
   BEZPEČNÉ VLOŽENIE TEXTU
================================================== */

function escapeProjectText(value) {
  const element =
    document.createElement("div");

  element.textContent =
    value == null
      ? ""
      : String(value);

  return element.innerHTML;
}


/* ==================================================
   FORMÁTOVANIE DLHÉHO TEXTU PROJEKTU
================================================== */

function formatProjectDescription(value) {
  const safeText =
    escapeProjectText(value || "");

  return safeText
    .split(/\n\s*\n/)
    .map(function(paragraph) {
      return `
        <p>
          ${paragraph.replace(
            /\n/g,
            "<br>"
          )}
        </p>
      `;
    })
    .join("");
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
      projectsEmpty.classList.add(
        "visible"
      );
    }

    return;
  }

  if (projectsEmpty) {
    projectsEmpty.classList.remove(
      "visible"
    );
  }

  projectsList.innerHTML = "";

  projekty.forEach(
    function(
      originalProject,
      projectIndex
    ) {
      const project =
        localizedProject(
          originalProject
        );

      const projectWrapper =
        document.createElement("div");

      projectWrapper.className =
        "project-wrapper";

      const projectName =
        escapeProjectText(
          project.nazov || ""
        );

      const projectLocation =
        escapeProjectText(
          project.miesto || ""
        );

      const projectYear =
        escapeProjectText(
          project.rok || ""
        );

      const projectRealizationFor =
        escapeProjectText(
          project.realizaciaPre || ""
        );

      const projectShortDescription =
        escapeProjectText(
          project.kratkyPopis || ""
        );

      const projectDescription =
        formatProjectDescription(
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

            <h2>${projectName}</h2>

            ${
              projectRealizationFor
                ? `
                  <div class="project-realization-for">
                    <strong>${escapeProjectText(
                      t("realizationFor")
                    )}</strong>
                    ${projectRealizationFor}
                  </div>
                `
                : ""
            }

            <p>${projectShortDescription}</p>

            <button
              type="button"
              class="project-open-button"
              data-project-open="${projectIndex}"
            >
              ${escapeProjectText(
                t("viewProject")
              )}
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

              <h2>${projectName}</h2>

              ${
                projectRealizationFor
                  ? `
                    <div class="project-detail-realization-for">
                      <strong>${escapeProjectText(
                        t("realizationFor")
                      )}</strong>
                      ${projectRealizationFor}
                    </div>
                  `
                  : ""
              }

            </div>

            <button
              type="button"
              class="project-close-button"
              data-project-close="${projectIndex}"
              aria-label="${escapeProjectText(
                t("closeProject")
              )}"
            >
              <i class="fas fa-xmark"></i>
            </button>

          </div>

          <div class="project-detail-description">
            ${projectDescription}
          </div>

          <div
            class="project-gallery-area"
            id="project-gallery-area-${projectIndex}"
          >

            <h3 class="project-gallery-title">
              ${escapeProjectText(
                t("gallery")
              )}
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
    }
  );

  renderAdditionalRealizations();
  activateProjectButtons();
}


/* ==================================================
   ĎALŠIE REALIZÁCIE A SPOLUPRÁCE
================================================== */

function renderAdditionalRealizations() {
  if (
    !projectsList ||
    typeof dalsieRealizacie ===
      "undefined" ||
    !dalsieRealizacie
  ) {
    return;
  }

  const additionalData =
    localizedProject(
      dalsieRealizacie
    );

  const additionalSection =
    document.createElement(
      "section"
    );

  additionalSection.className =
    "additional-realizations";

  const additionalName =
    escapeProjectText(
      additionalData.nazov ||
        t("additionalTitle")
    );

  const additionalProjects =
    Array.isArray(
      dalsieRealizacie.projekty
    )
      ? dalsieRealizacie.projekty
      : [];

  const additionalDescription =
    formatProjectDescription(
      additionalData.popis || ""
    );

  const projectTags =
    additionalProjects
      .map(function(projectName) {
        return `
          <span class="additional-project-tag">
            ${escapeProjectText(
              projectName
            )}
          </span>
        `;
      })
      .join("");

  additionalSection.innerHTML = `
    <div class="additional-realizations-inner">

      <div class="additional-realizations-heading">

        <span class="additional-realizations-label">
          ${escapeProjectText(
            t("moreExperience")
          )}
        </span>

        <h2>${additionalName}</h2>

      </div>

      ${
        projectTags
          ? `
            <div class="additional-projects-list">
              ${projectTags}
            </div>
          `
          : ""
      }

      <div class="additional-realizations-description">
        ${additionalDescription}
      </div>

    </div>
  `;

  projectsList.appendChild(
    additionalSection
  );
}


/* ==================================================
   AUTOMATICKÁ GALÉRIA

   Skúša fotografie 01.jpeg až 50.jpeg.
   Existujúce zobrazí, neexistujúce odstráni.
================================================== */

function createAutomaticGallery(
  project,
  projectIndex
) {
  const gallery =
    document.getElementById(
      "project-gallery-" +
        projectIndex
    );

  const galleryArea =
    document.getElementById(
      "project-gallery-area-" +
        projectIndex
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
      (project.nazov ||
        t("project")) +
      " – " +
      t("photo") +
      " " +
      photoNumber;

    image.onload = function() {
      foundPhotos++;
      galleryArea.style.display =
        "";
    };

    image.onerror = function() {
      galleryItem.remove();
    };

    galleryItem.addEventListener(
      "click",
      function() {
        openLightboxFromGallery(
          projectIndex,
          photoPath
        );
      }
    );

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

    galleryItem.appendChild(image);
    gallery.appendChild(galleryItem);

    image.src = photoPath;
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

  openButtons.forEach(
    function(button) {
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
            .forEach(
              function(openDetail) {
                if (
                  openDetail !== detail
                ) {
                  openDetail.classList.remove(
                    "open"
                  );
                }
              }
            );

          detail.classList.add(
            "open"
          );

          setTimeout(
            function() {
              detail.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            },
            50
          );
        }
      );
    }
  );

  closeButtons.forEach(
    function(button) {
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
            setTimeout(
              function() {
                openButton.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });
              },
              50
            );
          }
        }
      );
    }
  );
}


/* ==================================================
   LIGHTBOX
================================================== */

let lightbox = null;
let lightboxImage = null;
let lightboxCounter = null;

let currentGalleryPhotos = [];
let currentPhotoIndex = 0;
let currentLightboxProjectIndex = null;


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
      aria-label="${escapeProjectText(
        t("closePhoto")
      )}"
    >
      <i class="fas fa-xmark"></i>
    </button>

    <button
      type="button"
      class="lightbox-prev"
      aria-label="${escapeProjectText(
        t("previousPhoto")
      )}"
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
      aria-label="${escapeProjectText(
        t("nextPhoto")
      )}"
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

  loadedImages.forEach(
    function(image) {
      if (
        image.complete &&
        image.naturalWidth > 0
      ) {
        currentGalleryPhotos.push(
          image.src
        );
      }
    }
  );

  if (
    currentGalleryPhotos.length ===
    0
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

  currentLightboxProjectIndex =
    Number(projectIndex);

  createLightbox();
  updateLightbox();

  lightbox.classList.add("open");

  document.body.style.overflow =
    "hidden";
}


/* ==================================================
   AKTUALIZÁCIA LIGHTBOXU
================================================== */

function updateLightbox() {
  if (
    !lightbox ||
    currentGalleryPhotos.length ===
      0
  ) {
    return;
  }

  lightboxImage.src =
    currentGalleryPhotos[
      currentPhotoIndex
    ];

  const galleryImage =
    Array.from(
      document.querySelectorAll(
        "#project-gallery-" +
          currentLightboxProjectIndex +
          " img"
      )
    ).find(
      image =>
        image.src ===
        currentGalleryPhotos[
          currentPhotoIndex
        ]
    );

  lightboxImage.alt =
    galleryImage?.alt ||
    t("photo") +
      " " +
      (currentPhotoIndex + 1);

  lightboxCounter.textContent =
    currentPhotoIndex +
    1 +
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
    currentGalleryPhotos.length <=
    1
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
   PREDCHÁDZAJÚCA A NASLEDUJÚCA FOTKA
================================================== */

function showPreviousPhoto() {
  if (
    currentGalleryPhotos.length ===
    0
  ) {
    return;
  }

  currentPhotoIndex--;

  if (currentPhotoIndex < 0) {
    currentPhotoIndex =
      currentGalleryPhotos.length -
      1;
  }

  updateLightbox();
}

function showNextPhoto() {
  if (
    currentGalleryPhotos.length ===
    0
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
   ODOSIELANIE CEZ WEB3FORMS
================================================== */

const inquiryForm =
  document.getElementById(
    "inquiryForm"
  );

const formMessage =
  document.getElementById(
    "formMessage"
  );

if (
  inquiryForm &&
  formMessage
) {
  inquiryForm.addEventListener(
    "submit",
    async function(event) {
      event.preventDefault();

      if (!inquiryForm.checkValidity()) {
        inquiryForm.reportValidity();
        return;
      }

      const submitButton =
        inquiryForm.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        submitButton.disabled = true;
      }

      formMessage.textContent =
        t("formSending");

      formMessage.classList.remove(
        "success",
        "error"
      );

      formMessage.classList.add(
        "visible"
      );

      try {
        const formData =
          new FormData(inquiryForm);

        const response =
          await fetch(
            "https://api.web3forms.com/submit",
            {
              method: "POST",
              body: formData
            }
          );

        const result =
          await response.json();

        if (
          response.ok &&
          result.success
        ) {
          formMessage.innerHTML =
            t("formSuccess");

          formMessage.classList.add(
            "success"
          );

          inquiryForm.reset();

          inquiryForm
            .querySelectorAll(
              "input, select, textarea"
            )
            .forEach(element => {
              element.setCustomValidity("");
              delete element.dataset
                .validationShown;
            });
        } else {
          throw new Error(
            result.message ||
              "Web3Forms submission failed."
          );
        }
      } catch (error) {
        console.error(
          "Web3Forms:",
          error
        );

        formMessage.innerHTML =
          t("formError");

        formMessage.classList.add(
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );
}


/* ==================================================
   SPUSTENIE JAZYKOVÉHO PREPÍNAČA
================================================== */

initializeLanguageSwitcher();
