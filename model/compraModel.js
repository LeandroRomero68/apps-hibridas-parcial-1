// backend/models/Compra.js
import mongoose from "mongoose";

const CompraSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },
    metodoPago: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["debe", "completado"], // opcional para validar estados
      default: "debe",
    },
    fechaCompra: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

const Compra = mongoose.model("Compra", CompraSchema);
export default Compra;
