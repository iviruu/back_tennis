import Saque from '../models/saquesModel.js';
import Resultados from '../models/resultadosModel.js';
import User from '../models/userModel.js';


export const getSaques = async (req, res) => {
  try {
    const saques = await Saque.findAll();
    res.status(200).json({
      code: 1,
      message: 'Saques List',
      data: saques
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'An error occurred while obtaining the Saques'
    });
  }
}

export const getResultados = async (req, res) => {  
  try {
    const resultados = await Resultados.findAll();
    res.status(200).json({
      code: 1,
      message: 'resultados List',
      data: resultados
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'An error occurred while obtaining the Saques'
    });
  }
}

export const getResultadosByIdSaque = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Obtener el ID del saque según el tipo de saque
      const saque = await Saque.findByPk(id);
  
      if (!saque) {
        return res.status(404).json({
          code: -1,
          message: `No se encontró ningún saque con el id: ${id}`
        });
      }
  
      // Obtener todos los resultados relacionados con el ID del saque
      const resultados = await Resultados.findAll({
        where: {
          saque_id: saque.id_saque
        }
      });
  
      res.status(200).json({
        code: 1,
        message: 'Resultados list',
        data: resultados
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'An error occurred while obtaining the resultados'
      });
    }
  }

  export const createResultados = async (req, res) => {
    const { user_id, saque_id, velocidad, punteria } = req.body;
  
    try {
      // Verificar si el saque existe
      const saque = await Saque.findByPk(saque_id);
  
      if (!saque) {
        return res.status(404).json({
          code: -1,
          message: `No se encontró ningún saque con el id: ${saque_id}`
        });
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          code: -1,
          message: `No se encontró ningún usuario con el id: ${user_id}`
        });
      }
  
      // Crear un nuevo resultado
      const newResultado = await Resultados.create({
        user_id: user_id,
        saque_id: saque_id,
        velocidad: velocidad,
        punteria: punteria
      });
  
      res.status(201).json({
        code: 1,
        message: 'Resultado created',
        data: newResultado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: -100,
        message: 'An error occurred while creating the resultado'
      });
    }
  }