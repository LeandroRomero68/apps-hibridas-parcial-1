import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // <-- IMPORTANTE
import { fileURLToPath } from "url";

// Rutas
import compraRoutes from "./routes/compraRoutes.js";
import cursoRoutes from "./routes/cursoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Modelos
import "./model/usuarioModel.js";
import "./model/cursoModel.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Necesario para usar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // <-- AGREGA ESTO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas de la API
app.use("/api/compras", compraRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proyectoDB")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
