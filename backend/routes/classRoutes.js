import express from "express";
import { getClasses, createClass, getClassById } from "../controllers/classController.js";

import { getStudentsByClassId, createStudent, updateStudentGrades } from "../controllers/studentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, getClassById);
router.post("/", authMiddleware, createClass);

router.get("/institution/:institutionId", authMiddleware, getClasses);

router.get("/:id/students", authMiddleware, getStudentsByClassId);
router.post("/:id/students", authMiddleware, createStudent);
router.put("/:id/grades", authMiddleware, updateStudentGrades);

export default router;