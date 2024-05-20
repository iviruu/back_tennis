import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Saque = sequelize.define('Saque', {
  id_saque: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  type_saque: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
},{
  indexes: [{ unique: true, fields: ['type_saque'] }],
  timestamps: false 
});

export default Saque;
