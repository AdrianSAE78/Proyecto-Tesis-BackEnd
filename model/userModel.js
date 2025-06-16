const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./roleModel');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'role',
      key: 'id_role'
    }
  },
  id_administrative: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'administratives',
      key: 'id_administrative'
    }
  },
  id_professor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'professors',
      key: 'id_professor'
    }
  },
  id_representative: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'legal_representatives',
      key: 'id_representative'
    }
  }
}, {
  tableName: 'user',
  timestamps: false
});

// Asociación: User pertenece a un Role
User.belongsTo(Role, { foreignKey: 'id_role', as: 'role' });


module.exports = User;
