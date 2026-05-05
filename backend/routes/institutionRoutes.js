import express from "express";
import { getInstitution, createInstitution, getInstitutionById } from "../controllers/institutionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware, getInstitution);
router.post("/", authMiddleware, createInstitution);
router.get("/:id", authMiddleware, getInstitutionById)

export default router;