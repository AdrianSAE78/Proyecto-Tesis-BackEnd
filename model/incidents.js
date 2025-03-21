const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    }
}, {
    tableName: 'incidents',
});

module.exports = Incident;