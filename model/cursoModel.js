import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    modalidad: { type: String, required: true }, // online, híbrido, presencial
    precio: { type: Number, required: true },
    duracion: { type: Number, required: true }, // en horas o semanas
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
}, { timestamps: true });

export default mongoose.model("Curso", cursoSchema);