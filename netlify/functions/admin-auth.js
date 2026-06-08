exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };

  try {
    const body = JSON.parse(event.body);
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mhloc2026";
    const GH_TOKEN = process.env.GITHUB_TOKEN;

    // Login normal
    if (body.password && !body.getToken) {
      if (body.password === ADMIN_PASSWORD) {
        const token = Buffer.from(Date.now() + ":mh-admin-ok").toString("base64");
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, token }) };
      } else {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false }) };
      }
    }

    // Récupération du token GitHub (session valide requise)
    if (body.getToken) {
      const sessionToken = body.password;
      // Vérifie que le token de session est valide (contient "mh-admin-ok")
      try {
        const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
        if (decoded.includes("mh-admin-ok")) {
          return { statusCode: 200, headers, body: JSON.stringify({ ghToken: GH_TOKEN }) };
        }
      } catch(e) {}
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Session invalide" }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Requête invalide" }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
