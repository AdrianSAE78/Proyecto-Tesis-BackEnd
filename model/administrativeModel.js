const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrative = sequelize.define('Administrative', {
    id_administrative: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'administratives',
    timestamps: false
});

module.exports = Administrative;
