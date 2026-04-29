import express from "express";
import { getStudentsByClassId, createStudent, updateStudentGrades } from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/:classId", authMiddleware, getStudentsByClassId);
router.post("/:classId", authMiddleware, createStudent);
router.put("/grades/:classId", authMiddleware, updateStudentGrades)

export default router;