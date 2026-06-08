exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée" }) };

  try {
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    const token = process.env.GITHUB_TOKEN;

    let cars;
    try { cars = JSON.parse(event.body); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON invalide" }) }; }
    if (!Array.isArray(cars)) return { statusCode: 400, headers, body: JSON.stringify({ error: "Format invalide" }) };

    const url = `https://api.github.com/repos/${repo}/contents/data/cars.json`;

    // 1. Récupère le SHA du fichier actuel
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github.v3+json" }
    });
    const getData = await getRes.json();
    const sha = getData.sha;

    // 2. Met à jour le fichier
    const content = Buffer.from(JSON.stringify(cars, null, 2)).toString("base64");
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "MAJ véhicules via admin dashboard",
        content,
        sha,
        branch
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || "Erreur GitHub API");
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, count: cars.length }) };

  } catch (err) {
    console.error("save-cars error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
