import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Saque from './saquesModel.js';

const Resultados = sequelize.define('Resultados', {
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: false,

  },
  saque_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: false,

  },
  velocidad: {
    type: DataTypes.DECIMAL(5,2).UNSIGNED,
    allowNull: false,
  },
  punteria: {
    type: DataTypes.DECIMAL(5,2).UNSIGNED,
    allowNull: false,
  }
},{
  timestamps: true, // Activa la creación automática de createdAt y updatedAt
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
User.hasMany(Resultados, { foreignKey: 'user_id' });
Resultados.belongsTo(User, { foreignKey: 'user_id' });
Saque.hasMany(Resultados, { foreignKey: 'saque_id' });
Resultados.belongsTo(Saque, { foreignKey: 'saque_id' });

export default Resultados;
