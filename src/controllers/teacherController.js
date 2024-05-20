import Alumnos from "../models/alumnosModel.js";
import User from "../models/userModel.js";




export const createRelacionAlumnoProfesor = async (req, res) => {
    const { alumno_id, teacher_id, estado_relacion } = req.body;
  
    try {
      // Verificar si el alumno existe
      const alumno = await User.findByPk(alumno_id);
      if (!alumno) {
        return res.status(404).json({
          code: -1,
          message: `No se encontró ningún alumno con el ID: ${alumno_id}`
        });
      }
  
      // Verificar si el profesor existe
      const profesor = await User.findByPk(teacher_id);
      if (!profesor) {
        return res.status(404).json({
          code: -1,
          message: `No se encontró ningún profesor con el ID: ${teacher_id}`
        });
      }
  
      // Crear la nueva relación
      const newRelacion = await Alumnos.create({
        alumno_id,
        teacher_id,
        estado_relacion
      });
  
      res.status(201).json({
        code: 1,
        message: 'Relación creada exitosamente',
        data: newRelacion
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ocurrió un error al crear la relación'
      });
    }
  };


  export const getAlumnosByProfesor = async (req, res) => {
    const { teacher_id } = req.params;
  
    try {
      // Obtener todas las relaciones donde el profesor sea el indicado
      const relaciones = await Alumnos.findAll({
        where: { teacher_id },
        include: [{ model: User, as: 'Alumno', attributes: ['name', 'surname']  }]
      });
  
      res.status(200).json({
        code: 1,
        message: 'Lista de alumnos obtenida exitosamente',
        data: relaciones
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'Ocurrió un error al obtener la lista de alumnos'
      });
    }
  };