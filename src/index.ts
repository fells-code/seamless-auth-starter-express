import express from "express";
import cors from "cors";
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

const app = express();

const seamlessAuthOptions: SeamlessAuthServerOptions = {
  authServerUrl: process.env.AUTH_SERVER_URL!,
  cookieSecret: process.env.COOKIE_SIGNING_KEY!,
  serviceSecret: process.env.API_SERVICE_TOKEN!,
  cookieDomain: "localhost",
};

app.use(express.json());
app.use(cors({ origin: "http://localhost:5001", credentials: true }));
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
