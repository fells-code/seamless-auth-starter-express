import type { Request, NextFunction, Response } from "express";

import getLogger from "../lib/logger";
import { getSeamlessUser } from "@seamless-auth/express";
import { User } from "../../models/user";

const logger = getLogger("requireUser");

export interface RequireUserOptions {
  cookieSecret: string;
  authServerUrl: string;
  cookieName?: string;
}

export const requireUser =
  (opts: RequireUserOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const seamlessUser = await getSeamlessUser(req, opts);

      if (!seamlessUser) {
        logger.warn("Failed to resolve Seamless Auth user");
        return res.status(401).json({ message: "Not allowed." });
      }

      let user = await User.findOne({
        where: { id: seamlessUser.id },
      });

      if (!user) {
        logger.info(
          `No local user found for ${seamlessUser.id}. Creating user.`,
        );

        try {
          user = await User.create({
            id: seamlessUser.id,
            email: seamlessUser.email.toLowerCase(),
            phone: seamlessUser.phone,
          });
        } catch (error) {
          logger.error("Error creating local user", error);
          return res.status(400).json({
            message: "Failed to create user",
          });
        }
      }

      req.appUser = user;

      next();
    } catch (error) {
      logger.error("requireUser failed", error);
      res.status(401).json({ message: "Not allowed" });
    }
  };
