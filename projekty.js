/* ==================================================
   ELEKTRO LUDWIG
   PROJEKTY – SPOLOČNÉ DÁTA

   Texty projektov sú uložené v:
   languages/sk.js
   languages/en.js
   languages/de.js
   languages/pl.js
   languages/fr.js
   languages/es.js
   languages/zh.js

   Tento súbor obsahuje iba údaje,
   ktoré sú spoločné pre všetky jazyky.
================================================== */


/* ==================================================
   HLAVNÉ PROJEKTY
================================================== */

const projekty = [

  {
    datum: "2026-09",
    rok: "2026",
    priecinok: "transgourmet-leipheim"
  },

  {
    datum: "2026-07",
    rok: "2026",
    priecinok: "uw-ragow"
  },

  {
    datum: "2026-04",
    rok: "2026",
    priecinok: "palm-eltmann"
  },

  {
    datum: "2025-08",
    rok: "2022–2026",
    priecinok: "tgw-logistika"
  },

  {
    datum: "2025-05",
    rok: "2025",
    priecinok: "transnetbw-leingarten"
  },

  {
    datum: "2023-06",
    rok: "2023",
    priecinok: "andritz-linz"
  },

  {
    datum: "2022-10",
    rok: "2022–2023",
    priecinok: "mm-holz-leoben"
  },

  {
    datum: "2021-09",
    rok: "2021–2022",
    priecinok: "schule-freising"
  },

  {
    datum: "2021-04",
    rok: "2021",
    priecinok: "bmw-krauthausen"
  },

  {
    datum: "2019-06",
    rok: "2019–2020",
    priecinok: "eecv-europoort"
  },

  {
    datum: "2018-09",
    rok: "2018–2019",
    priecinok: "skoda-mlada-boleslav"
  }

];


/* ==================================================
   ZORADENIE PROJEKTOV
   Najnovšie projekty sa zobrazia ako prvé.
================================================== */

projekty.sort(function (a, b) {
  return new Date(b.datum) - new Date(a.datum);
});


/* ==================================================
   ĎALŠIE REALIZÁCIE

   Aj ich názvy a popisy sú uložené
   v jednotlivých jazykových súboroch.
================================================== */

const dalsieRealizacie = {

  projekty: [
    "Jungheinrich Moosburg",
    "GALILEO München",
    "Porsche Leipzig",
    "Wellpappe Alzenau"
  ]

};


/* ==================================================
   POMOCNÁ FUNKCIA
   Vráti text projektu pre aktuálny jazyk.
================================================== */

function getProjectTranslation(project, language) {

  const languages =
    window.elektroLudwigLanguages || {};

  const selectedLanguage =
    languages[language] || languages.sk;

  if (!selectedLanguage || !selectedLanguage.projects) {
    return {};
  }

  return (
    selectedLanguage.projects[project.priecinok] ||
    (languages.sk &&
      languages.sk.projects &&
      languages.sk.projects[project.priecinok]) ||
    {}
  );

}


/* ==================================================
   POMOCNÁ FUNKCIA
   Spojí spoločné dáta projektu s jeho prekladom.
================================================== */

function getLocalizedProject(project, language) {

  const translation =
    getProjectTranslation(project, language);

  return {
    ...project,
    ...translation
  };

}


/* ==================================================
   VŠETKY PROJEKTY PRE ZVOLENÝ JAZYK
================================================== */

function getLocalizedProjects(language) {

  return projekty.map(function (project) {
    return getLocalizedProject(project, language);
  });

}


/* ==================================================
   ĎALŠIE REALIZÁCIE PRE ZVOLENÝ JAZYK
================================================== */

function getLocalizedAdditionalRealizations(language) {

  const languages =
    window.elektroLudwigLanguages || {};

  const selectedLanguage =
    languages[language] || languages.sk;

  const translation =
    (selectedLanguage && selectedLanguage.additional) ||
    (languages.sk && languages.sk.additional) ||
    {};

  return {
    ...dalsieRealizacie,
    ...translation
  };

}
