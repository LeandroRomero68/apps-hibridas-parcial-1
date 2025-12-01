import express from "express";
import cursoController from "../controller/cursoController.js";

const router = express.Router();
const controller = new cursoController();

// Endpoints para cursos
router.get("/", controller.getCursos);               // Obtener todos los cursos
router.get("/:id", controller.getCursoById);        // Obtener curso por ID
router.post("/", controller.addCurso);              // Crear un nuevo curso
router.put("/:id", controller.updateCursoById);     // Actualizar curso por ID
router.delete("/:id", controller.deleteCursoById);  // Eliminar curso por ID

export default router;