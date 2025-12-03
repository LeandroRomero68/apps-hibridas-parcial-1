import Compra from "../model/compraModel.js";
import Response from "../classes/Response.js";
import mongoose from "mongoose";

class compraController {

    // Obtener todas las compras
    async getCompras(req, res) {
        const myRes = new Response();
        try {
            const compras = await Compra.find()
                .populate("usuario", "nombre email")
                .populate("curso");

            myRes.generateResponseTrue(res, 'Compras encontradas', compras);
        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudieron encontrar las compras', 'Error al obtener las compras', 500, err);
        }
    }

    // Crear compra
    async addCompra(req, res) {
        const myRes = new Response();

         console.log("BODY RECIBIDO EN BACK:", req.body);
        try {
            const { usuario, curso, metodoPago, estado } = req.body;

            if (!usuario || !curso || !metodoPago) {
                return myRes.generateResponseFalse(
                    res,
                    'Faltan campos',
                    'Debes completar todos los campos',
                    400
                );
            }

            const newCompra = new Compra({
                usuario,
                curso,
                metodoPago,
                estado: estado || "completado"
            });

            const dataSaved = await newCompra.save();
            myRes.generateResponseTrue(res, 'Compra creada', dataSaved);

        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudo crear la compra', 'Error al guardar la compra', 500, err);
        }
    }

    // Obtener compra por ID
    async getCompraById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return myRes.invalidId(res);
            }

            const compra = await Compra.findById(id)
                .populate("usuario", "nombre email")
                .populate("curso");

            if (!compra) {
                return myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }

            myRes.generateResponseTrue(res, 'Compra encontrada', compra);

        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar la compra', 'No se pudo buscar la compra', 500, err);
        }
    }

    // Actualizar compra por ID
    async updateCompraById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;
            const { usuario, curso, metodoPago, estado } = req.body;

            if (!usuario || !curso || !metodoPago) {
                return myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar todos los campos', 400);
            }

            const compraUpdated = await Compra.findByIdAndUpdate(
                id,
                { usuario, curso, metodoPago, estado },
                { new: true }
            );

            if (!compraUpdated) {
                return myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }

            myRes.generateResponseTrue(res, 'Compra actualizada', compraUpdated);

        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al actualizar la compra', 'No se pudo actualizar la compra', 500, err);
        }
    }

    // Eliminar compra por ID
    async deleteCompraById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return myRes.invalidId(res);
            }

            const compraDeleted = await Compra.findByIdAndDelete(id);

            if (!compraDeleted) {
                return myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }

            myRes.generateResponseTrue(res, 'Compra eliminada', compraDeleted);

        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al eliminar la compra', 'No se pudo eliminar la compra', 500, err);
        }
    }

    // Obtener compras por usuario
    async getComprasByUsuario(req, res) {
        const myRes = new Response();
        try {
            const { usuarioId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
                return myRes.invalidId(res);
            }

            const compras = await Compra.find({ usuario: usuarioId })
                .populate("curso");

            myRes.generateResponseTrue(res, 'Compras del usuario obtenidas', compras);

        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al obtener compras por usuario', 'No se pudo obtener las compras', 500, err);
        }
    }

}

export default compraController;
