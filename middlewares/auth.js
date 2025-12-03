import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ ok: false, msg: "No se envió token" });
  }

  // 🟢 Separa correctamente el token de "Bearer"
  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ ok: false, msg: "Formato de token inválido" });
  }

  const token = parts[1];

  try {
    // 🟢 Verificamos el JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Aseguramos que req.user SIEMPRE tenga id, email y rol
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol ?? "user" // si no viene rol, asigna user por defecto
    };

    return next();
  } catch (error) {
    console.error("Error verificando token:", error.message);
    return res.status(401).json({ ok: false, msg: "Token inválido o expirado" });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ ok: false, msg: "Acceso denegado: solo admin" });
  }
  next();
}
