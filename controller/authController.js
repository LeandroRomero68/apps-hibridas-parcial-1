// backend/controllers/authController.js
import Usuario from "../model/usuarioModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registro de usuario
export async function register(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ msg: "Faltan datos" });

    const existingUser = await Usuario.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "El email ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || "user",
    });

    await user.save();
    res.status(201).json({ msg: "Usuario registrado", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
}

// Login de usuario
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, nombre: user.nombre, rol: user.rol },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
}
