import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createSeamlessAuthServer, {
  requireAuth,
  requireRole,
} from "@seamless-auth/express";
import { connectToDb } from "./db";
import { initializeModels } from "../models";

import users from "./routes/users.js";
import beta from "./routes/beta.js";
import { requireUser } from "./middleware/requireUser";
import getLogger from "./lib/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;
const logger = getLogger("index");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5001", credentials: true }));

app.use(
  "/auth",
  createSeamlessAuthServer({
    authServerUrl: process.env.AUTH_SERVER_URL!,
    cookieDomain: "localhost",
  }),
);

app.use(
  requireAuth({
    cookieSecret: process.env.COOKIE_SIGNING_KEY ?? "",
  }),
);
app.use(requireUser);

app.use("/users", users);
app.use("/beta_users", requireRole("beta_user"), beta);

app.get("/", (_req, res) => res.send("Seamless API is running."));

const models = await initializeModels();

await connectToDb(models);

app.listen(PORT, () => {
  logger.info(`API running at http://localhost:${PORT}`);
});
