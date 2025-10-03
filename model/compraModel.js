import mongoose from "mongoose";

const Schema = mongoose.Schema;

const compraSchema = new Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
    metodoPago: { type: String, required: true }, // ej. 'tarjeta', 'mercado pago', 'efectivo'
    estado: { type: String, required: true }, // ej. 'pendiente', 'completado', 'cancelado'
    fechaCompra: { type: Date, default: Date.now }
});

const Compra = mongoose.model('Compra', compraSchema);

export default Compra;