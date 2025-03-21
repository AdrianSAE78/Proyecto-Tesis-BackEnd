const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

let Asistance = sequelize.define('Asistance', {
    id_asistance: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // id_student: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'Student',
    //         key: 'id_student'
    //     }
    // },
    // id_professor: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'Professor',
    //         key: 'id_professor'
    //     }
    // },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('presente', 'ausente'),
        allowNull: false
    },
    justification: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    
    news: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
}, {
    tableName: 'Asistance',
    timestamps: false 
});

module.exports = Asistance;