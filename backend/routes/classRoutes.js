import express from "express";
import { getAllClasses, getClasses, createClass, getClassById, deleteClass, updateClass } from "../controllers/classController.js";

import { getStudentsByClassId, createStudent, updateStudentGrades, updateStudent, deleteStudent } from "../controllers/studentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rotas das Turmas
router.get("/", authMiddleware, getAllClasses);
router.get("/:id", authMiddleware, getClassById);
router.post("/", authMiddleware, createClass);
router.delete("/:id", authMiddleware, deleteClass);
router.put("/:id", authMiddleware, updateClass);

// Rota da Instituição
router.get("/institution/:institutionId", authMiddleware, getClasses);

// Rotas de Alunos
router.get("/:id/students", authMiddleware, getStudentsByClassId);
router.post("/:id/students", authMiddleware, createStudent);
router.put("/:id/grades", authMiddleware, updateStudentGrades);
router.put("/:id/students/:studentId", authMiddleware, updateStudent);
router.delete("/:id/students/:studentId", authMiddleware, deleteStudent);



export default router;