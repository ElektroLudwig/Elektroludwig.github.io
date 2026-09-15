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


/* ==================================================
   KONTAKTNÝ FORMULÁR
   ZATIAĽ BEZ SERVEROVÉHO ODOSIELANIA
================================================== */

const inquiryForm =
  document.getElementById("inquiryForm");

const formMessage =
  document.getElementById("formMessage");


inquiryForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    formMessage.textContent =
      "Formulár je pripravený. V ďalšom kroku ho pripojíme na odosielanie správ na e-mail.";

    formMessage.classList.add("visible");

  }
);
