import Compra from "../model/compraModel.js"; // Modelo de compras
import Response from "../classes/Response.js";
import mongoose from "mongoose";

class compraController {

    // Obtener todas las compras
    async getCompras(req, res) {
        const myRes = new Response();
        try {
            const comprasRaw = await Compra.find(); // Solo sin populate
            console.log("Compras crudas:", comprasRaw);

            const compras = await Compra.find()
                .populate("usuario")
                .populate("curso");

            console.log("Compras con populate:", compras);

            myRes.generateResponseTrue(res, 'Compras encontradas', compras);
        } catch (err) {
            console.error("Error real:", err); // Mostramos error completo en consola
            myRes.generateResponseFalse(res, 'No se pudieron encontrar las compras', 'Error al obtener las compras', 500, err);
        }
    }

    // Crear una nueva compra
    async addCompra(req, res) {
        const myRes = new Response();
        try {
            console.log("Body recibido en el servidor:", req.body);

            const { usuario, curso, metodoPago, estado } = req.body;

            if (!usuario || !curso || !metodoPago || !estado) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar todos los campos', 400);
                return;
            }

            const newCompra = new Compra({ usuario, curso, metodoPago, estado });
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
                myRes.invalidId(res);
                return;
            }
            const compra = await Compra.findById(id).populate("usuario").populate("curso");
            if(compra) {
                myRes.generateResponseTrue(res, 'Compra encontrada', compra);
            } else {
                myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }
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

            if (!usuario || !curso || !metodoPago || !estado) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar todos los campos', 400);
                return;
            }

            const compraUpdated = await Compra.findByIdAndUpdate(
                id,
                { usuario, curso, metodoPago, estado },
                { new: true }
            );

            if(compraUpdated) {
                myRes.generateResponseTrue(res, 'Compra actualizada', compraUpdated);
            } else {
                myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }
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
                myRes.invalidId(res);
                return;
            }
            const compraDeleted = await Compra.findByIdAndDelete(id);
            if(compraDeleted) {
                myRes.generateResponseTrue(res, 'Compra eliminada', compraDeleted);
            } else {
                myRes.generateResponseFalse(res, 'Compra no encontrada', 'No se encontró la compra', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al eliminar la compra', 'No se pudo eliminar la compra', 500, err);
        }
    }

    // Obtener compras por usuario
    async getComprasByUsuario(req, res) {
        const myRes = new Response();
        try {
            const usuarioId = req.params.usuarioId;
            if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
                myRes.invalidId(res);
                return;
            }
            const compras = await Compra.find({ usuario: usuarioId }).populate("curso");
            if(compras.length > 0) {
                myRes.generateResponseTrue(res, 'Compras del usuario encontradas', compras);
            } else {
                myRes.generateResponseFalse(res, 'No se encontraron compras para este usuario', 'El usuario no tiene compras', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar compras del usuario', 'No se pudieron obtener las compras', 500, err);
        }
    }
}

export default compraController;