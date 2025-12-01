import express from "express";
import usuarioController from "../controllers/usuarioController.js";

const router = express.Router();
const userController = new usuarioController();

// ================================
// Rutas de usuarios
// ================================

// Obtener todos los usuarios
router.get("/", (req, res) => userController.getUsuarios(req, res));

// Crear usuario (registrar)
router.post("/", (req, res) => userController.addUsuario(req, res));

// Obtener usuario por ID
router.get("/:id", (req, res) => userController.getUsuarioById(req, res));

// Actualizar usuario por ID
router.put("/:id", (req, res) => userController.updateUsuarioById(req, res));

// Eliminar usuario por ID
router.delete("/:id", (req, res) => userController.deleteUsuarioById(req, res));

export default router;
