/* ==================================================
   ELEKTRO LUDWIG
   PROJEKTY / REFERENCIE

   Sem budeme postupne pridávať jednotlivé stavby.
   Projekty sa automaticky zoradia od najnovšieho.
================================================== */


const projekty = [

  /*
  ==================================================
  VZOR PROJEKTU

  Tento vzor zatiaľ NIE JE reálny projekt.
  Keď budeme pridávať prvú stavbu, vytvoríme
  podľa neho skutočný záznam.

  {
    datum: "2026-09",

    nazov: "Názov projektu",

    miesto: "Mesto, Nemecko",

    rok: "2026",

    hlavnaFotka:
      "images/projekty/nazov-projektu/hlavna.jpg",

    kratkyPopis:
      "Krátky popis projektu, ktorý sa zobrazí priamo v zozname referencií.",

    popis:
      "Podrobnejší popis realizácie. Tu môžeme napísať, čo všetko sme na stavbe realizovali, akého typu bola stavba a aký bol rozsah našich elektroinštalačných prác.",

    fotky: [
      "images/projekty/nazov-projektu/01.jpg",
      "images/projekty/nazov-projektu/02.jpg",
      "images/projekty/nazov-projektu/03.jpg"
    ]
  }

  ==================================================
  KONIEC VZORU
  ==================================================
  */

];


/* ==================================================
   AUTOMATICKÉ ZORADENIE PROJEKTOV

   Najnovší projekt bude vždy hore.
================================================== */

projekty.sort(function(a, b) {

  return new Date(b.datum) - new Date(a.datum);

});
