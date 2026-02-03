import { Response } from "express";
import { UserRequest } from "../types";

export function getBetaContent(req: UserRequest, res: Response) {
  return res.json({
    message: "Welcome to the beta program!",
    access: "You have beta_user privileges.",
    user: req.user,
  });
}
