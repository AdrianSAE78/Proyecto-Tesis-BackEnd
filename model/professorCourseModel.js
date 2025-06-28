const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfessorCourse = sequelize.define('ProfessorCourse', {
  id_professor_courses:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
}, {
  tableName: 'professor_courses',
  timestamps: false
});

module.exports = ProfessorCourse;
