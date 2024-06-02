import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';


const Alumnos = sequelize.define('Alumnos', {
    alumno_id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
    },
    teacher_id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
    },
    estado_relacion: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        allowNull: true,
    },
    relacion_id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        autoIncrement: true,
        unique: true,
    },

},{
    timestamps: true, // Activa la creación automática de createdAt y updatedAt
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

    User.hasMany(Alumnos, { foreignKey: 'alumno_id', as: 'AlumnoRelacion'});
    User.hasMany(Alumnos, { foreignKey: 'teacher_id', as : 'TeacherRelacion'});
    Alumnos.belongsTo(User, { foreignKey: 'alumno_id', as : 'Alumno'});
    Alumnos.belongsTo(User, { foreignKey: 'teacher_id', as : 'Teacher'});

export default Alumnos;