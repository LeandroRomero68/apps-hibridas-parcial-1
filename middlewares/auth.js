import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No se envió token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ⬅️ acá viene { id, email, rol }
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado, se requiere rol admin" });
  }
  next();
}
