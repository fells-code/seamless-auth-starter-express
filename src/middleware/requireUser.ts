import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import type { UserRequest } from "../types";
import getLogger from "../lib/logger";
import { getSeamlessUser } from "@seamless-auth/express";
import { getSecret } from "../lib/secretsStore";
import { User } from "../../models/user";

const logger = getLogger("requireUser");

export const requireUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies["api-access"];

  if (!accessToken) {
    logger.error(`Failed to validate, missing access token`);
    res.status(401).json({ message: "Not allowed." });
    return;
  }

  try {
    const COOKIE_SECRET = await getSecret("COOKIE_SIGNING_KEY");

    if (!COOKIE_SECRET) {
      logger.warn("Missing COOKIE_SIGNING_KEY env var!");
    }

    const decodedToken = jwt.verify(
      accessToken,
      COOKIE_SECRET,
    ) as jwt.JwtPayload;
    let user = await User.findOne({
      where: {
        seamlessAuthUid: decodedToken.sub,
      },
    });

    if (!user) {
      logger.info(`No user found for ${decodedToken.sub}. Creating user.`);

      const seamlessUserData = await getSeamlessUser(
        req,
        process.env.AUTH_SERVER_URL!,
      );

      if (decodedToken.sub !== seamlessUserData.id) {
        logger.error(
          `Supicous activitiy for mismatching ids when creating a seamless portal user from seamless auth. Cookie ID: ${decodedToken.sub}. Seamless ID: ${seamlessUserData}`,
        );
        return res.status(401).json({ message: "Not allowed" });
      }

      try {
        user = await User.create({
          email: seamlessUserData.email.toLowerCase(),
          phone: seamlessUserData.phone,
          seamlessAuthUid: seamlessUserData.id,
        });
      } catch (error) {
        logger.error(`An error occured creating a user ${error}`);
        res
          .status(400)
          .json({ message: "Failed to get user information", user: {} });
        return;
      }
    }

    req.user = user;
    next();
    return;
  } catch (error) {
    logger.error("Failed to validate internal JWT token. Error: ", error);
  }

  res.status(401).json({ message: "Not allowed" });
  return;
};
