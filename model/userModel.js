const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

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
    rol: {
        type: DataTypes.ENUM('administrative', 'professor', 'legalRepresentative'),
        allowNull: false
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

module.exports = User;