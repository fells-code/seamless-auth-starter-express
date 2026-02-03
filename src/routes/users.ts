import { Router } from "express";
import { waitlistCount } from "../controllers/users.controller.js";

const router = Router();

router.get("/waitlist-count", waitlistCount);

export default router;
