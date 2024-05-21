import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Roles = sequelize.define('Roles', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
},{
  timestamps: false, // Activa la creación automática de createdAt y updatedAt
});

export default Roles;