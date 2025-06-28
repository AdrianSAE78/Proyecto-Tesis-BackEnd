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
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;
