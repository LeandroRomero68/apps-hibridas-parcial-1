// usuarioController.js
import User from "../model/usuarioModel.js";
import Response from "../classes/Response.js";
import PassManager from "../classes/passManager.js";
import jwt from "jsonwebtoken";

class usuarioController {

    // ============================
    // Obtener todos los usuarios
    // ============================
    async getUsuarios(req, res) {
        const myRes = new Response();
        try {
            const usuarios = await User.find();
            myRes.generateResponseTrue(res, "Usuarios encontrados", usuarios);
        } catch (err) {
            myRes.generateResponseFalse(
                res,
                "No se pudieron obtener los usuarios",
                "Error al obtener usuarios",
                500,
                err
            );
        }
    }

    // ============================
    // Crear usuario (Registro)
    // ============================
    async addUsuario(req, res) {
        const myRes = new Response();
        try {
            const { nombre, email, password, rol } = req.body;

            if (!nombre || !email || !password) {
                return myRes.generateResponseFalse(
                    res,
                    "Faltan campos",
                    "Debes completar nombre, email y password",
                    400
                );
            }

            // Verificar si el email ya existe
            const existe = await User.findOne({ email });
            if (existe) {
                return myRes.generateResponseFalse(
                    res,
                    "Email ya registrado",
                    "Este correo ya está en uso",
                    400
                );
            }

            // Hash del password
            const passMan = new PassManager(10);
            const hashedPassword = await passMan.hashPassword(password);

            const newUser = new User({
                nombre,
                email,
                password: hashedPassword,
                rol: rol ?? "user"  // ← por defecto es "user"
            });

            const savedUser = await newUser.save();
            return myRes.generateResponseTrue(res, "Usuario creado correctamente", savedUser);

        } catch (err) {
            return myRes.generateResponseFalse(
                res,
                "No se pudo crear el usuario",
                "Error al guardar usuario",
                500,
                err
            );
        }
    }

    // ============================
    // Login de usuario
    // ============================
    async login(req, res) {
        const myRes = new Response();
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return myRes.generateResponseFalse(
                    res,
                    "Faltan campos",
                    "Debes completar email y password",
                    400
                );
            }

            const user = await User.findOne({ email });

            if (!user) {
                return myRes.generateResponseFalse(
                    res,
                    "Usuario no encontrado",
                    "Email no registrado",
                    404
                );
            }

            const passMan = new PassManager(10);
            const validPassword = await passMan.comparePassword(password, user.password);

            if (!validPassword) {
                return myRes.generateResponseFalse(
                    res,
                    "Contraseña incorrecta",
                    "Password incorrecto",
                    401
                );
            }

            // 🔥 CREAR JWT REAL CON ROL
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    rol: user.rol ?? "user",
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // 🔥 Enviar solo lo necesario al frontend
            return myRes.generateResponseTrue(res, "Login exitoso", {
                user: {
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol ?? "user",
                },
                token,
            });

        } catch (err) {
            return myRes.generateResponseFalse(
                res,
                "Error al iniciar sesión",
                "Error interno del servidor",
                500,
                err
            );
        }
    }

    // ============================
    // Obtener usuario por ID
    // ============================
    async getUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;

            if (!id || id.length !== 24) {
                return myRes.invalidId(res);
            }

            const usuario = await User.findById(id);
            if (!usuario) {
                return myRes.generateResponseFalse(
                    res,
                    "Usuario no encontrado",
                    "No existe un usuario con ese ID",
                    404
                );
            }

            return myRes.generateResponseTrue(res, "Usuario encontrado", usuario);

        } catch (err) {
            return myRes.generateResponseFalse(
                res,
                "Error al buscar usuario",
                "No se pudo buscar el usuario",
                500,
                err
            );
        }
    }

    // ============================
    // Actualizar usuario por ID
    // ============================
    async updateUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;
            const { nombre, password } = req.body;

            if (!id || id.length !== 24) {
                return myRes.invalidId(res);
            }

            if (!nombre || !password) {
                return myRes.generateResponseFalse(
                    res,
                    "Faltan campos",
                    "Debes completar nombre y password",
                    400
                );
            }

            const passMan = new PassManager(10);
            const hashedPassword = await passMan.hashPassword(password);

            const updated = await User.findByIdAndUpdate(
                id,
                { nombre, password: hashedPassword },
                { new: true }
            );

            if (!updated) {
                return myRes.generateResponseFalse(
                    res,
                    "Usuario no encontrado",
                    "No existe un usuario con ese ID",
                    404
                );
            }

            return myRes.generateResponseTrue(res, "Usuario actualizado", updated);

        } catch (err) {
            return myRes.generateResponseFalse(
                res,
                "Error al actualizar usuario",
                "No se pudo actualizar el usuario",
                500,
                err
            );
        }
    }

    // ============================
    // Eliminar usuario por ID
    // ============================
    async deleteUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;

            if (!id || id.length !== 24) {
                return myRes.invalidId(res);
            }

            const deleted = await User.findByIdAndDelete(id);

            if (!deleted) {
                return myRes.generateResponseFalse(
                    res,
                    "Usuario no encontrado",
                    "No existe un usuario con ese ID",
                    404
                );
            }

            return myRes.generateResponseTrue(res, "Usuario eliminado", deleted);

        } catch (err) {
            return myRes.generateResponseFalse(
                res,
                "Error al eliminar usuario",
                "No se pudo eliminar el usuario",
                500,
                err
            );
        }
    }
}

export default usuarioController;
