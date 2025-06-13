const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfessorCourse = sequelize.define('ProfessorCourse', {
    id_professor: {
      type: DataTypes.INTEGER,
      references: {
        model: 'professors',
        key: 'id_professor'
      },
      onDelete: 'CASCADE'
    },
    id_course: {
      type: DataTypes.INTEGER,
      references: {
        model: 'courses',
        key: 'id_course'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'professor_courses',
    timestamps: false
  });
  
  module.exports = ProfessorCourse;