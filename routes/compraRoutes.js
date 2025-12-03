import express from "express";
import compraController from "../controller/compraController.js";
import Compra from "../model/compraModel.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const controller = new compraController();

/**
 * ⭐ Obtener cursos comprados por el usuario logueado
 * Endpoint → GET /api/compras/mis-cursos
 */
router.get("/mis-cursos", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id; // viene desde el token JWT

    const compras = await Compra.find({ usuario: usuarioId })
      .populate("curso") // Trae toda la información del curso comprado
      .sort({ fechaCompra: -1 }); // Última compra primero

    return res.json({
      ok: true,
      compras
    });
  } catch (error) {
    console.error("[ERROR] en GET /mis-cursos:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las compras del usuario"
    });
  }
});

/**
 * 📌 Rutas ya existentes
 */
router.get("/usuario/:usuarioId", controller.getComprasByUsuario);
router.get("/:id", controller.getCompraById);
router.get("/", controller.getCompras);
router.post("/", controller.addCompra);
router.put("/:id", controller.updateCompraById);
router.delete("/:id", controller.deleteCompraById);

export default router;
