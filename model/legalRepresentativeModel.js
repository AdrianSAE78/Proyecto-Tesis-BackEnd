const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LegalRepresentative = sequelize.define('LegalRepresentative', {
    id_representative: {
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
            len: [10, 10],         // exactamente 10 dígitos
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
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'legal_representatives',
});

module.exports = LegalRepresentative;