import express from "express";
import compraController from "../controller/compraController.js";
import Compra from "../model/compraModel.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const controller = new compraController();

router.get("/mis-cursos", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id; 
    const compras = await Compra.find({ usuario: usuarioId })
      .populate("curso")
      .sort({ fechaCompra: -1 });

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

router.get("/usuario/:usuarioId", controller.getComprasByUsuario);
router.get("/:id", controller.getCompraById);
router.get("/", controller.getCompras);
router.post("/", controller.addCompra);
router.put("/:id", controller.updateCompraById);
router.delete("/:id", controller.deleteCompraById);

export default router;
