exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  try {
    const { password } = JSON.parse(event.body);

    // ── Mot de passe stocké dans les variables d'environnement Netlify ──
    // Va dans Netlify → Site settings → Environment variables
    // Ajoute : ADMIN_PASSWORD = ton_mot_de_passe_secret
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mhloc2026";

    if (password === ADMIN_PASSWORD) {
      // Génère un token de session simple
      const token = Buffer.from(Date.now() + ":mh-admin-ok").toString("base64");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, token })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: "Mot de passe incorrect" })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erreur serveur" })
    };
  }
};
