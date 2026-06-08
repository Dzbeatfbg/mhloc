exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  try {
    const { password } = JSON.parse(event.body);
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (password === ADMIN_PASSWORD) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: "Mot de passe incorrect" }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
