exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const repo = process.env.GITHUB_REPO || "Dzbeatfbg/mhloc";
    const branch = process.env.GITHUB_BRANCH || "main";
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/cars.json?ref=${branch}`,
      { headers: { "Accept": "application/vnd.github.v3+json" } }
    );
    if (!res.ok) throw new Error("Fichier non trouvé: " + res.status);
    const data = await res.json();
    const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return { statusCode: 200, headers, body: content };
  } catch (err) {
    console.error("get-cars:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
