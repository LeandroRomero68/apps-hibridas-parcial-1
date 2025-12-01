import express from "express";
import usuarioController from "../controller/usuarioController.js";

const router = express.Router();
const controller = new usuarioController();

router.get("/", controller.getUsuarios);
router.get("/:id", controller.getUsuarioById);
router.post("/", controller.addUsuario);
router.put("/:id", controller.updateUsuarioById);
router.delete("/:id", controller.deleteUsuarioById);

export default router;