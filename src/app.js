import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { router as authRouter } from "./routes/auth.js";
import { router as cartRouter } from "./routes/cart.js";
import { router as ordersRouter } from "./routes/orders.js";
import { router as productRouter } from "./routes/products.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.join(__dirname, "client");

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api", cartRouter);
app.use("/api", ordersRouter);

// Swagger
const swaggerPath = path.join(process.cwd(), "src", "swagger", "openapi.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
app.get("/api-docs.json", (_req, res) => res.json(swaggerDoc));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// client
app.use("/assets", express.static(path.join(clientDir, "assets")));
app.use("/images", express.static(path.join(clientDir, "images")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});
app.get("/admin", (_req, res) => {
  res.sendFile(path.join(clientDir, "admin.html"));
});
app.get("/cart", (_req, res) => {
  res.sendFile(path.join(clientDir, "cart.html"));
});
app.get("/checkout", (_req, res) => {
  res.sendFile(path.join(clientDir, "checkout.html"));
});

app.get("/orders", (_req, res) => {
  res.sendFile(path.join(clientDir, "orders.html"));
});

app.get("/payment", (_req, res) => {
  res.sendFile(path.join(clientDir, "payment.html"));
});

app.get("/product", (_req, res) => {
  res.sendFile(path.join(clientDir, "product.html"));
});

app.get("/contact", (_req, res) => {
  res.sendFile(path.join(clientDir, "contact.html"));
});

app.get("/login", (_req, res) => {
  res.sendFile(path.join(clientDir, "login.html"));
});

app.get("/search", (_req, res) => {
  res.sendFile(path.join(clientDir, "search.html"));
});

export default app;
