const { getStore } = require("@netlify/blobs");

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const store = getStore({ name: "mh-location", consistency: "strong" });
    const raw = await store.get("cars");

    if (!raw) {
      // Première fois : charge depuis data/cars.json
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../../data/cars.json");
      const fileData = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(fileData);
      // Sauvegarde dans Blobs pour la prochaine fois
      await store.set("cars", fileData);
      return { statusCode: 200, headers, body: fileData };
    }

    return { statusCode: 200, headers, body: raw };

  } catch (err) {
    console.error("get-cars error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Impossible de charger les véhicules", detail: err.message })
    };
  }
};
