import { Request, Response } from "express";
import { Waitlist } from "../../models/waitlist";

/**
 * GET /users
 * Fetch users (example only)
 */
export async function waitlistCount(_req: Request, res: Response) {
  const count = Waitlist.count();

  return res.json({ count });
}
