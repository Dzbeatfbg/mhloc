exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  try {
    // Parse le body
    let cars;
    try {
      cars = JSON.parse(event.body);
    } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON invalide" }) };
    }

    if (!Array.isArray(cars)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Format invalide" }) };
    }

    // Import dynamique pour éviter les erreurs de chargement
    const { getStore } = require("@netlify/blobs");
    const store = getStore({ name: "mh-location", consistency: "strong" });
    await store.set("cars", JSON.stringify(cars));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, count: cars.length })
    };

  } catch (err) {
    console.error("save-cars error:", err.message, err.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
