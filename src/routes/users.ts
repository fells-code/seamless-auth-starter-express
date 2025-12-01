import { Router } from "express";
import { waitlistCount } from "../controllers/users.controller.js";

const router = Router();

// Get all users
router.get("/waitlist-count", waitlistCount);

export default router;
