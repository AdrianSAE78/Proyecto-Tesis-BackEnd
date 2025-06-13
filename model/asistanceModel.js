const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const students = require('./studentModel'); 

const Asistance = sequelize.define('Asistance', {
    id_asistance: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_student: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id_student'
        }
    },
    id_professor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'professors',
            key: 'id_professor'
        }
    },
    id_course: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'courses',
            key: 'id_course'
        }
    },

    date: { 
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
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
    tableName: 'asistance',
    timestamps: false 
});

Asistance.belongsTo(students, { foreignKey: 'id_student' });

module.exports = Asistance;