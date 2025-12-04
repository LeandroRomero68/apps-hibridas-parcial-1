import Curso from "../model/cursoModel.js";
import Response from "../classes/Response.js";

class cursoController {

    // Obtener todos los cursos
    async getCursos(req, res) {
        const myRes = new Response();
        try {
            const cursos = await Curso.find();
            myRes.generateResponseTrue(res, 'Cursos encontrados', cursos);
        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudieron encontrar los cursos', 'Error al obtener cursos', 500, err);
        }
    }

    // Crear un nuevo curso
    async addCurso(req, res) {
        const myRes = new Response();
        try {
            let { nombre, descripcion, categoria, modalidad, precio, duracion, fechaInicio, fechaFin } = req.body;

            // Validación básica
            if(!nombre || !descripcion || !categoria || !modalidad || !precio || !duracion) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar todos los campos obligatorios', 400);
                return;
            }

            const newCurso = new Curso({
                nombre,
                descripcion,
                categoria,
                modalidad,
                precio,
                duracion,
                fechaInicio: fechaInicio ?? null,
                fechaFin: fechaFin ?? null,
            });

            const savedCurso = await newCurso.save();
            myRes.generateResponseTrue(res, 'Curso creado', savedCurso);
        } catch (err) {
            myRes.generateResponseFalse(res, 'No se pudo crear el curso', 'Error al guardar el curso', 500, err);
        }
    }

    // Obtener curso por ID
    async getCursoById(req, res) {
        const myRes = new Response();
        try {
            const { id } = req.params;
            if(id.length !== 24) {
                myRes.invalidId(res);
                return;
            }
            const curso = await Curso.findById(id);
            if(curso) {
                myRes.generateResponseTrue(res, 'Curso encontrado', curso);
            } else {
                myRes.generateResponseFalse(res, 'Curso no encontrado', 'No se encontró el curso', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar el curso', 'No se pudo acceder al curso', 500, err);
        }
    }

    // Actualizar curso por ID
    async updateCursoById(req, res) {
        const myRes = new Response();
        try {
            const { id } = req.params;
            const { nombre, descripcion, categoria, modalidad, precio, duracion, fechaInicio, fechaFin } = req.body;

            if(!nombre || !descripcion || !categoria || !modalidad || !precio || !duracion) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes completar todos los campos obligatorios', 400);
                return;
            }

            const cursoUpdated = await Curso.findByIdAndUpdate(
                id,
                { nombre, descripcion, categoria, modalidad, precio, duracion, fechaInicio, fechaFin },
                { new: true }
            );

            if(cursoUpdated) {
                myRes.generateResponseTrue(res, 'Curso actualizado', cursoUpdated);
            } else {
                myRes.generateResponseFalse(res, 'Curso no encontrado', 'No se encontró el curso', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al actualizar el curso', 'No se pudo actualizar el curso', 500, err);
        }
    }

    // Eliminar curso por ID
    async deleteCursoById(req, res) {
        const myRes = new Response();
        try {
            const { id } = req.params;
            if(id.length !== 24) {
                myRes.invalidId(res);
                return;
            }
            const deletedCurso = await Curso.findByIdAndDelete(id);
            if(deletedCurso) {
                myRes.generateResponseTrue(res, 'Curso eliminado', deletedCurso);
            } else {
                myRes.generateResponseFalse(res, 'Curso no encontrado', 'No se encontró el curso', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al eliminar el curso', 'No se pudo eliminar el curso', 500, err);
        }
    }

    // Obtener cursos por categoría
    async getCursosByCategoria(req, res) {
        const myRes = new Response();
        try {
            const { categoria } = req.params;
            if(!categoria) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes indicar una categoría', 400);
                return;
            }
            const cursos = await Curso.find({ categoria: categoria.toLowerCase() });
            if(cursos.length > 0) {
                myRes.generateResponseTrue(res, 'Cursos encontrados por categoría', cursos);
            } else {
                myRes.generateResponseFalse(res, 'No se encontraron cursos', 'No hay cursos para esta categoría', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar cursos por categoría', 'No se pudieron obtener los cursos', 500, err);
        }
    }

    // Obtener cursos por modalidad (online, híbrido, presencial)
    async getCursosByModalidad(req, res) {
        const myRes = new Response();
        try {
            const { modalidad } = req.params;
            if(!modalidad) {
                myRes.generateResponseFalse(res, 'Faltan campos', 'Debes indicar una modalidad', 400);
                return;
            }
            const cursos = await Curso.find({ modalidad: modalidad.toLowerCase() });
            if(cursos.length > 0) {
                myRes.generateResponseTrue(res, 'Cursos encontrados por modalidad', cursos);
            } else {
                myRes.generateResponseFalse(res, 'No se encontraron cursos', 'No hay cursos para esta modalidad', 404);
            }
        } catch (err) {
            myRes.generateResponseFalse(res, 'Error al buscar cursos por modalidad', 'No se pudieron obtener los cursos', 500, err);
        }
    }
}

export default cursoController;