const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guard = sequelize.define('Guard', {
    id_guard: {
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
    identification: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            len: [10, 10],
            isNumeric: true }

    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    }
}, {
    tableName: 'guards',
});

module.exports = Guard;