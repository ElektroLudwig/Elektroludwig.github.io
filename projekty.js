/* ==================================================
   ELEKTRO LUDWIG
   PROJEKTY / REFERENCIE

   Sem budeme postupne pridávať jednotlivé stavby.
   Projekty sa automaticky zoradia od najnovšieho.
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

    hlavnaFotka:
      "images/projekty/transgourmet-leipheim/hlavna.jpeg",

    kratkyPopis:
      "Elektroinštalačné práce pri realizácii nového logistického a distribučného objektu Transgourmet v nemeckom Leipheime.",

    popis:
      "Na projekte Transgourmet Leipheim sa podieľame na realizácii elektroinštalácií v rozsiahlej logistickej a chladiarenskej prevádzke. Súčasťou našich prác je montáž káblových trás, príprava a ťahanie silnoprúdovej a slaboprúdovej kabeláže, montáž a zapájanie rozvádzačov, vedenie a zapájanie termostatov a ďalšie elektroinštalačné práce súvisiace s jednotlivými technológiami objektu. Práce realizujeme v rôznych častiach prevádzky vrátane hál, chladiacich a mraziacich priestorov a technologických častí objektu.",

    fotky: [
      "images/projekty/transgourmet-leipheim/01.jpeg",
      "images/projekty/transgourmet-leipheim/02.jpeg"
    ]
  }

];


/* ==================================================
   AUTOMATICKÉ ZORADENIE PROJEKTOV

   Najnovší projekt bude vždy hore.
================================================== */

projekty.sort(function(a, b) {

  return new Date(b.datum) - new Date(a.datum);

});
