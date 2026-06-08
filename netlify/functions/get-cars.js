const { getStore } = require("@netlify/blobs");

const CARS_DEFAULT = [
  {id:"merecesa45s",name:"Mercedes A45s 2025",type:"sportive",pricePerDay:349,caution:"5 000€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/a45s/merco1.png","cars/a45s/merco2.png","cars/a45s/merco3.png","cars/a45s/merco4.png","cars/a45s/merco5.png","cars/a45s/merco6.png"]},
  {id:"audirs3sedan",name:"Audi RS3 Sedan 2025",type:"sportive",pricePerDay:349,caution:"5 000€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/rs3sedan/audi1.png","cars/rs3sedan/audi2.png","cars/rs3sedan/audi4.png","cars/rs3sedan/audi5.png","cars/rs3sedan/audi6.png","cars/rs3sedan/audi7.jpg","cars/rs3sedan/audi8.jpg"]},
  {id:"rs3hulk",name:"Audi RS3 Hulk 8Y 2023 — Pack Akra",type:"sportive",pricePerDay:249,caution:"4 500€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/rs3hulk/audi1.png","cars/rs3hulk/audi2.png","cars/rs3hulk/audi3.png","cars/rs3hulk/audi4.png","cars/rs3hulk/audi5.png","cars/rs3hulk/audi6.png","cars/rs3hulk/audi7.png","cars/rs3hulk/audi8.png"]},
  {id:"golfgtics",name:"Golf 8 GTI CS",type:"sportive",pricePerDay:149,caution:"3 500€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/golfgti/golf1.png","cars/golfgti/golf3.png","cars/golfgti/golf7.png","cars/golfgti/golf2.png","cars/golfgti/golf4.png","cars/golfgti/golf5.png","cars/golfgti/golf6.jpeg"]},
  {id:"golf8rline",name:"Golf 8 R-Line 2025",type:"citadine",pricePerDay:129,caution:"1 500€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/rlinenoir/rline1.png","cars/rlinenoir/rline2.png","cars/rlinenoir/rline3.png","cars/rlinenoir/rline4.png","cars/rlinenoir/rline5.png","cars/rlinenoir/rline6.png","cars/rlinenoir/rline7.jpeg","cars/rlinenoir/rline8.png"]},
  {id:"clio5alpine",name:"Clio 5 Alpine 2025",type:"citadine",pricePerDay:79,caution:"1 500€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/clio5noir/clio5-1.png","cars/clio5noir/clio5-2.png","cars/clio5noir/clio5-3.png","cars/clio5noir/clio5-4.png","cars/clio5noir/clio5-7.png","cars/clio5noir/clio5-5.png","cars/clio5noir/clio5-6.png","cars/clio5noir/clio5-8.jpg"]},
  {id:"clio5alpinegrise",name:"Clio 5 Alpine Gris Nardo 2025",type:"citadine",pricePerDay:79,caution:"1 500€",dispo:"dispo",gearbox:"Automatique",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/clio5gris/cliogris1.png","cars/clio5gris/cliogris2.png","cars/clio5gris/cliogris3.png","cars/clio5gris/cliogris4.png","cars/clio5gris/cliogris5.png","cars/clio5gris/cliogris6.png","cars/clio5gris/cliogris7.png","cars/clio5gris/cliogris8.jpg"]},
  {id:"clio5intense",name:"Clio 5 Intense — Boîte Manuelle",type:"citadine",pricePerDay:49,caution:"1 000€",dispo:"dispo",gearbox:"Manuel",fuel:"Essence",seats:"5 places",doors:"5 portes",conditions:"Permis valide / CNI / CB",km:"Selon offre",images:["cars/cliointense/cliointense1.png","cars/cliointense/cliointense2.png","cars/cliointense/cliointense3.png","cars/cliointense/cliointense4.png","cars/cliointense/cliointense5.png","cars/cliointense/cliointense6.png","cars/cliointense/cliointense7.jpg","cars/cliointense/cliointense8.jpg"]}
];

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    const store = getStore({ name: "mh-location", consistency: "strong" });
    const raw = await store.get("cars");

    if (!raw) {
      // Première fois : sauvegarde les données par défaut
      await store.set("cars", JSON.stringify(CARS_DEFAULT));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(CARS_DEFAULT)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: raw
    };

  } catch (err) {
    console.error("get-cars error:", err.message);
    // En cas d'erreur Blobs → retourne les données par défaut
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(CARS_DEFAULT)
    };
  }
};
