import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 👇 FORZAMOS nombre de la colección: "usuarios"
export default mongoose.model("Usuario", usuarioSchema, "usuarios");