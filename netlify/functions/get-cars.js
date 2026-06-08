exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/cars.json?ref=${branch}`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github.v3+json" }
    });
    if (!res.ok) throw new Error("Fichier non trouvé");
    const data = await res.json();
    const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return { statusCode: 200, headers, body: content };
  } catch (err) {
    console.error("get-cars:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
