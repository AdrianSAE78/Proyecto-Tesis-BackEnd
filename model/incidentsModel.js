const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./studentModel');

const Incident = sequelize.define('Incident', {
    id_incident: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('disciplinary', 'academic', 'medical', 'security'),
        allowNull: false
    },
    description: { 
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: { 
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: { 
        type: DataTypes.ENUM('pending', 'resolved'),
        allowNull: false,
        defaultValue: 'pending'
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
        allowNull: true,
        references: {
            model: 'professors',
            key: 'id_professor'
        }
    }
}, {
    tableName: 'incidents',
});

Incident.belongsTo(Student, { foreignKey: 'id_student', as: 'student' });

module.exports = Incident;