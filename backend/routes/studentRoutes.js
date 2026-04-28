import express from "express";
import { getStudentsByClassId, createStudent } from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/:classId", authMiddleware, getStudentsByClassId);
router.post("/:classId", authMiddleware, createStudent);

export default router;