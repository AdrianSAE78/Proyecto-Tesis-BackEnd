const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Professor = require('./professorModel'); 

const Course = sequelize.define('Course', {
    id_course: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'courses',
    timestamps: false
});

Course.belongsTo(Professor, { foreignKey: 'id_professor' });

module.exports = Course;
