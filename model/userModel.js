const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

let User = sequelize.define('User', {
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
        type: DataTypes.ENUM('administrador', 'profesor', 'representante'),
        allowNull: false
    },
    // id_administrative: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: 'Administrative', 
    //         key: 'id_administrative'
    //     }
    // },
    // id_professor: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: 'Professor', 
    //         key: 'id_professor'
    //     }
    // },
    // id_legal_representative: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: 'LegalRepresentative', 
    //         key: 'id_legal_representative'
    //     }
    // }
}, {
    tableName: 'User',
    timestamps: false 
});

module.exports = User;