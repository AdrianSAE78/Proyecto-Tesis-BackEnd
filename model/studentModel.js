const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./courseModel');
const Representative = require('./representativeModel');

const Student = sequelize.define('Student', {
    id_student: {
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
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    identityCard: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    }
}, {
    tableName: 'students',
    timestamps: false
});

// Definimos las relaciones con otras entidades
Student.belongsTo(Course, { foreignKey: 'id_course' });
Student.belongsTo(Representative, { foreignKey: 'id_representative' });

module.exports = Student;
