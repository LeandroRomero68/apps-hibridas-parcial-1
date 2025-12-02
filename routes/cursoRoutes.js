import express from "express";
import cursoController from "../controller/cursoController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const controller = new cursoController();

// Todos pueden ver
router.get("/", (req, res) => controller.getCursos(req, res));
router.get("/:id", (req, res) => controller.getCursoById(req, res));

// Solo admin puede crear
router.post("/", authMiddleware, adminMiddleware, (req, res) =>
  controller.addCurso(req, res)
);

// Solo admin puede editar
router.put("/:id", authMiddleware, adminMiddleware, (req, res) =>
  controller.updateCursoById(req, res)
);

// Solo admin puede eliminar
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) =>
  controller.deleteCursoById(req, res)
);

export default router;
