import express from "express";
import { getClasses, createClass } from "../controllers/classController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getClasses);
router.post("/", authMiddleware, createClass);

export default router;