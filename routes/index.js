import compraRoutes from "./compraRoutes.js";

export default function routerAPI(app) {
    app.use("/api/compras", compraRoutes);
    // Más rutas de otros controllers podrían ir acá
}