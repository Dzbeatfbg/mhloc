exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  try {
    const body = JSON.parse(event.body);
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (body.password === ADMIN_PASSWORD) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, token: "ok", ghToken: process.env.GITHUB_TOKEN }) };
    } else {
      return { statusCode: 401, headers, body: JSON.stringify({ success: false }) };
    }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
