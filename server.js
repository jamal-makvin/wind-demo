const http = require("http");
const fs = require("fs");
const path = require("path");
const { readConfig } = require("./backend/hub88/config");
const logger = require("./backend/hub88/logger");
const SignatureService = require("./backend/hub88/services/SignatureService");
const Hub88Client = require("./backend/hub88/services/Hub88Client");
const ProviderService = require("./backend/hub88/services/ProviderService");
const GameService = require("./backend/hub88/services/GameService");
const GameSessionService = require("./backend/hub88/services/GameSessionService");
const TransactionService = require("./backend/hub88/services/TransactionService");
const WalletService = require("./backend/hub88/services/WalletService");

const config = readConfig();
const signatureService = new SignatureService(config);
const hub88Client = new Hub88Client(config, signatureService);
const providerService = new ProviderService(config, hub88Client);
const gameService = new GameService(config, hub88Client);
const sessionService = new GameSessionService(config, hub88Client, gameService);
const transactionService = new TransactionService(sessionService);
const walletService = new WalletService(signatureService, transactionService);

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

function platformFromRequest(query) {
  const value = query.get("platform");
  return value === "GPL_MOBILE" ? "GPL_MOBILE" : "GPL_DESKTOP";
}

function countryFromLang(lang) {
  return String(lang || "ru").toLowerCase() === "en" ? "US" : "RU";
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/hub88/providers") {
    const providers = await providerService.listProviders();
    return sendJson(res, 200, {
      mode: hub88Client.isMockMode() ? "mock" : "hub88",
      providers
    });
  }

  if (req.method === "GET" && url.pathname === "/api/hub88/products") {
    const products = await providerService.listProviders();
    return sendJson(res, 200, {
      mode: hub88Client.isMockMode() ? "mock" : "hub88",
      products
    });
  }

  if (req.method === "GET" && url.pathname === "/api/hub88/catalog") {
    const lang = url.searchParams.get("lang") || "ru";
    const filters = {
      country: url.searchParams.get("country") || countryFromLang(lang),
      platform: platformFromRequest(url.searchParams),
      search: url.searchParams.get("search") || "",
      provider: url.searchParams.get("provider") || "all"
    };
    const [providers, games] = await Promise.all([
      providerService.listProviders(),
      gameService.listGames(filters)
    ]);
    return sendJson(res, 200, {
      mode: hub88Client.isMockMode() ? "mock" : "hub88",
      providers,
      games
    });
  }

  if (req.method === "POST" && url.pathname === "/api/hub88/launch") {
    const { body } = await readBody(req);
    const language = body.language || body.lang || "ru";
    const result = await sessionService.launch({
      game_code: body.game_code,
      currency: body.currency,
      game_currency: body.game_currency || body.currency,
      balance: body.balance,
      rtp_mode: body.rtp_mode,
      language,
      country: body.country || countryFromLang(language),
      platform: body.platform || "GPL_DESKTOP",
      user: body.user
    });
    return sendJson(res, 200, result);
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
  const signature = req.headers["x-hub88-signature"];
  const response = walletService.handle(url.pathname, parsed.body, parsed.raw, signature);
  return sendJson(res, 200, response);
}

function serveStatic(req, res, url) {
  const decoded = decodeURIComponent(url.pathname);
  const safePath = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.resolve(config.rootDir, `.${safePath}`);
  if (!filePath.startsWith(config.rootDir)) {
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
    logger.error("request failed", { path: url.pathname, error: error.message, code: error.code });
    return sendJson(res, error.status || 500, {
      error: error.code || "SERVER_ERROR",
      message: error.message || "Internal server error"
    });
  }
});

server.listen(config.port, () => {
  logger.info("wind-demo server started", {
    port: config.port,
    mode: hub88Client.isMockMode() ? "mock" : "hub88"
  });
});
