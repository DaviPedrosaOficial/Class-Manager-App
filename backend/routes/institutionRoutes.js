import express from "express";
import { getInstitution, createInstitution } from "../controllers/institutionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware, getInstitution);
router.post("/", authMiddleware, createInstitution);

export default router;