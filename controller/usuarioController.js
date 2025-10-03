import User from "../model/usuarioModel.js"; // tu modelo de usuario
import Response from "../classes/Response.js";
import PassManager from "../classes/passManager.js"; // si querés hashear passwords

class usuarioController {

    // Obtener todos los usuarios
    async getUsuarios(req, res) {
        const myRes = new Response();
        try {
            const usuarios = await User.find();
            myRes.generateResponseTrue(res, 'Usuarios encontrados', usuarios);
        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudieron encontrar los usuarios', 'Error al obtener usuarios', 500, err);
        }
    }

    // Crear un nuevo usuario
    async addUsuario(req, res) {
        const myRes = new Response();
        try {
            const { nombre, email, password } = req.body;

            if (!nombre || !email || !password) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar nombre, email y password', 400);
                return;
            }

            const passMan = new PassManager(10);
            const hashedPassword = passMan.hashPassword(password);

            const newUser = new User({ nombre, email, password: hashedPassword });
            const dataSaved = await newUser.save();

            myRes.generateResponseTrue(res, 'Usuario creado', dataSaved);
        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudo crear el usuario', 'Error al guardar usuario', 500, err);
        }
    }

    // Obtener usuario por ID
    async getUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;
            if (id.length !== 24) {
                myRes.invalidId(res);
                return;
            }
            const usuario = await User.findById(id);
            if (usuario) {
                myRes.generateResponseTrue(res, 'Usuario encontrado', usuario);
            } else {
                myRes.generateResponseFalse(res, 'Usuario no encontrado', 'No se encontró el usuario', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar usuario', 'No se pudo buscar el usuario', 500, err);
        }
    }

    // Actualizar usuario por ID
    async updateUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;
            const { nombre, password } = req.body;

            if (!nombre || !password) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar nombre y password', 400);
                return;
            }

            const passMan = new PassManager(10);
            const hashedPassword = passMan.hashPassword(password);

            const usuarioUpdated = await User.findByIdAndUpdate(
                id,
                { nombre, password: hashedPassword },
                { new: true }
            );

            if (usuarioUpdated) {
                myRes.generateResponseTrue(res, 'Usuario actualizado', usuarioUpdated);
            } else {
                myRes.generateResponseFalse(res, 'Usuario no encontrado', 'No se encontró el usuario', 404);
            }

        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al actualizar usuario', 'No se pudo actualizar el usuario', 500, err);
        }
    }

    // Eliminar usuario por ID
    async deleteUsuarioById(req, res) {
        const myRes = new Response();
        try {
            const id = req.params.id;
            if (id.length !== 24) {
                myRes.invalidId(res);
                return;
            }
            const usuarioDeleted = await User.findByIdAndDelete(id);
            if (usuarioDeleted) {
                myRes.generateResponseTrue(res, 'Usuario eliminado', usuarioDeleted);
            } else {
                myRes.generateResponseFalse(res, 'Usuario no encontrado', 'No se encontró el usuario', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al eliminar usuario', 'No se pudo eliminar el usuario', 500, err);
        }
    }
}

export default usuarioController;