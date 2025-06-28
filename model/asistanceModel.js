const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Asistance = sequelize.define('Asistance', {
    id_asistance: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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


module.exports = Asistance;