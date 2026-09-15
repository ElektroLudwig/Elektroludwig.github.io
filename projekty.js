/* ==================================================
   ELEKTRO LUDWIG
   PROJEKTY / REFERENCIE

   Každý projekt má vlastný priečinok:

   images/projekty/nazov-projektu/

   V priečinku môže byť:

   hlavna.jpeg
   01.jpeg
   02.jpeg
   03.jpeg
   ...
   až
   50.jpeg

   Galéria sa vytvorí automaticky.
================================================== */


const projekty = [

  /* ==================================================
     TRANSGOURMET LEIPHEIM
  ================================================== */

  {
    datum: "2026-09",

    nazov: "Transgourmet Leipheim",

    miesto: "Leipheim, Nemecko",

    rok: "2026",

    priecinok: "transgourmet-leipheim",

    kratkyPopis:
      "Elektroinštalačné práce pri realizácii nového logistického a distribučného objektu Transgourmet v nemeckom Leipheime.",

    popis:
      "Na projekte Transgourmet Leipheim sa podieľame na realizácii elektroinštalácií v rozsiahlej logistickej a chladiarenskej prevádzke. Súčasťou našich prác je montáž káblových trás, príprava a ťahanie silnoprúdovej a slaboprúdovej kabeláže, montáž a zapájanie rozvádzačov, vedenie a zapájanie termostatov a ďalšie elektroinštalačné práce súvisiace s jednotlivými technológiami objektu. Práce realizujeme v rôznych častiach prevádzky vrátane hál, chladiacich a mraziacich priestorov a technologických častí objektu."
  }

];


/* ==================================================
   AUTOMATICKÉ ZORADENIE PROJEKTOV

   Najnovší projekt bude vždy hore.
================================================== */

projekty.sort(function(a, b) {

  return new Date(b.datum) - new Date(a.datum);

});
