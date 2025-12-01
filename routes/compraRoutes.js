import express from "express";
import compraController from "../controller/compraController.js";

const router = express.Router();
const controller = new compraController();

// IMPORTANTE: la ruta de usuario debe ir **antes** de la ruta por ID
router.get("/usuario/:usuarioId", controller.getComprasByUsuario);
router.get("/:id", controller.getCompraById);

router.get("/", controller.getCompras);
router.post("/", controller.addCompra);
router.put("/:id", controller.updateCompraById);
router.delete("/:id", controller.deleteCompraById);

export default router;