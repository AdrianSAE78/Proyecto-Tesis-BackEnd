const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsedQRToken = sequelize.define('UsedQRToken', {
  id_used_qr_token: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'used_qr_tokens',
  timestamps: true
});

module.exports = UsedQRToken;
