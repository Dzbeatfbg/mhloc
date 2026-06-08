const { getStore } = require("@netlify/blobs");

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  try {
    // Vérifie que le body est du JSON valide
    let cars;
    try {
      cars = JSON.parse(event.body);
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON invalide" }) };
    }

    // Vérifie que c'est bien un tableau
    if (!Array.isArray(cars)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Format invalide — tableau attendu" }) };
    }

    // Sauvegarde dans Netlify Blobs
    const store = getStore({ name: "mh-location", consistency: "strong" });
    await store.set("cars", JSON.stringify(cars));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, count: cars.length, saved_at: new Date().toISOString() })
    };

  } catch (err) {
    console.error("save-cars error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Impossible de sauvegarder", detail: err.message })
    };
  }
};
