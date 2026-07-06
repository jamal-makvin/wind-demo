const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rootDir = __dirname;
const port = Number.parseInt(process.env.PORT || "3000", 10);

const walletPaths = new Set([
  "/user/info",
  "/user/balance",
  "/transaction/bet",
  "/transaction/win",
  "/transaction/rollback"
]);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

const mockGames = [
  ["Sweet Bonanza", "Pragmatic", "SB", "Video Slots"],
  ["Gates Olympus", "Pragmatic", "GO", "Video Slots"],
  ["Wanted Wild", "Hacksaw", "WW", "Video Slots"],
  ["Sugar Rush", "Pragmatic", "SR", "Video Slots"],
  ["Big Bass", "PlaynGO", "BB", "Video Slots"],
  ["The Dog House", "Pragmatic", "DH", "Video Slots"],
  ["Le Bandit", "Hacksaw", "LB", "Video Slots"],
  ["Zeus Hades", "Nolimit", "ZH", "Video Slots"],
  ["Fruit Party", "Pragmatic", "FP", "Video Slots"],
  ["Starlight Princess", "PG Soft", "SP", "Video Slots"],
  ["Aviator Demo", "Spribe", "AV", "Crash"],
  ["Mines Pro", "Spribe", "MP", "Minigame"],
  ["Plinko X", "Spribe", "PX", "Plinko"],
  ["Tower+", "PG Soft", "T+", "Casual Games"],
  ["Crash Turbo", "Nolimit", "CT", "Crash"]
].map(([name, provider, symbol, category], index) => ({
  id: `mock-${index}`,
  name,
  game_code: `wind_mock_${index}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
  provider,
  product: provider,
  category,
  symbol,
  url_thumb: "",
  url_background: "",
  thumbnails: [],
  backgrounds: [],
  demo_game_support: true,
  enabled: true,
  rtp: "96.00",
  volatility: 3,
  platforms: ["GPL_DESKTOP", "GPL_MOBILE"],
  mobile_support: true,
  desktop_support: true,
  languages: ["eng", "rus"],
  blocked_countries: [],
  restricted_countries: [],
  popular: index < 10
}));

const mockProviders = [...new Set(mockGames.map((game) => game.provider))].map((provider) => ({
  name: provider,
  code: provider,
  logo: "",
  enabled_currencies: ["RUB", "USD", "EUR"]
}));

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({ raw, body: {} });
      try {
        resolve({ raw, body: JSON.parse(raw) });
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function filterGames(query) {
  const search = String(query.get("search") || "").trim().toLowerCase();
  const provider = String(query.get("provider") || "all");
  return mockGames.filter((game) => {
    if (provider !== "all" && game.provider !== provider) return false;
    if (search && !`${game.name} ${game.provider}`.toLowerCase().includes(search)) return false;
    return true;
  });
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/hub88/providers") {
    return sendJson(res, 200, { mode: "mock", providers: mockProviders });
  }

  if (req.method === "GET" && url.pathname === "/api/hub88/products") {
    return sendJson(res, 200, { mode: "mock", products: mockProviders });
  }

  if (req.method === "GET" && url.pathname === "/api/hub88/catalog") {
    return sendJson(res, 200, {
      mode: "mock",
      providers: mockProviders,
      games: filterGames(url.searchParams)
    });
  }

  if (req.method === "POST" && url.pathname === "/api/hub88/launch") {
    const { body } = await readBody(req);
    const game = mockGames.find((item) => item.game_code === body.game_code || item.id === body.game_code) || mockGames[0];
    const token = crypto.randomUUID();
    const currency = String(body.currency || "RUB").toUpperCase();
    return sendJson(res, 200, {
      url: `about:blank#hub88-mock-${encodeURIComponent(game.game_code)}`,
      token,
      user: body.user || `wind_demo_${token.replace(/-/g, "").slice(0, 20)}`,
      session_id: token,
      balance: Math.round(Number.parseFloat(body.balance || "0") * 100000),
      currency,
      rtp_mode: body.rtp_mode === "standard" ? "standard" : "100",
      game,
      mock: true
    });
  }

  return sendJson(res, 404, { error: "not found" });
}

async function handleWallet(req, res, url) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "method not allowed" });
  let parsed;
  try {
    parsed = await readBody(req);
  } catch {
    return sendJson(res, 200, {
      user: "",
      status: "RS_ERROR_WRONG_SYNTAX",
      request_uuid: "",
      balance: 0
    });
  }
  return sendJson(res, 200, {
    user: parsed.body.user || "",
    status: "RS_OK",
    request_uuid: parsed.body.request_uuid || "",
    balance: parsed.body.balance || 10000000000,
    path: url.pathname
  });
}

function serveStatic(req, res, url) {
  const decoded = decodeURIComponent(url.pathname);
  const safePath = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.resolve(rootDir, `.${safePath}`);
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": contentTypes[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/hub88/")) {
      return await handleApi(req, res, url);
    }
    if (walletPaths.has(url.pathname)) {
      return await handleWallet(req, res, url);
    }
    return serveStatic(req, res, url);
  } catch (error) {
    return sendJson(res, 500, {
      error: "SERVER_ERROR",
      message: error.message || "Internal server error"
    });
  }
});

server.listen(port, () => {
  console.log(`wind-demo static server started on ${port}`);
});
