import express from "express";
import { getInstitution, createInstitution, getInstitutionById, updateInstitution, deleteInstitution } from "../controllers/institutionController.js";

import { getClasses } from "../controllers/classController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInstitution);
router.post("/", authMiddleware, createInstitution);
router.get("/:id", authMiddleware, getInstitutionById);
router.put("/:id", authMiddleware, updateInstitution);
router.delete("/:id", authMiddleware, deleteInstitution);

router.get("/:id/classes", authMiddleware, getClasses);

export default router;