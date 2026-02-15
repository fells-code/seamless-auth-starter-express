import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import createSeamlessAuthServer, {
  requireAuth,
  requireRole,
  SeamlessAuthServerOptions,
} from "@seamless-auth/express";
import { connectToDb } from "./db";
import { initializeModels } from "../models";

import beta from "./routes/beta.js";
import { requireUser } from "./middleware/requireUser";
import getLogger from "./lib/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;
const logger = getLogger("index");

const rawOrigin = process.env.UI_ORIGIN;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    // The second host in this if block showcases that SSO options are offered. More documentation to follow soon.
    if (origin === rawOrigin || origin === "http://localhost:5002") {
      return callback(null, true);
    }

    logger.warn(`Unknown CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
};

const app = express();

const seamlessAuthOptions: SeamlessAuthServerOptions = {
  authServerUrl: process.env.AUTH_SERVER_URL!,
  cookieSecret: process.env.COOKIE_SIGNING_KEY!,
  serviceSecret: process.env.API_SERVICE_TOKEN!,
  issuer: process.env.APP_ORIGIN!,
  audience: process.env.AUTH_SERVER_URL!,
  jwksKid: process.env.JWKS_ACTIVE_KID!,
  cookieDomain: "localhost",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/auth", createSeamlessAuthServer(seamlessAuthOptions));

app.use(
  requireAuth({
    cookieSecret: seamlessAuthOptions.cookieSecret ?? "",
  }),
);

app.use(
  requireUser({
    cookieSecret: seamlessAuthOptions.cookieSecret,
    authServerUrl: seamlessAuthOptions.authServerUrl,
  }),
);
app.use("/beta_users", requireRole("betaUser"), beta);
app.get("/", (_req, res) => res.send("Seamless API is running."));

const models = await initializeModels();

await connectToDb(models);

app.listen(PORT, () => {
  logger.info(`API running at http://localhost:${PORT}`);
});
