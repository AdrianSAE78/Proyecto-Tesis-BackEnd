const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfessorCourse = sequelize.define('ProfessorCourse', {
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
    references: {
      model: 'courses',
      key: 'id_course'
    }
  }
}, {
  tableName: 'professor_courses',
  timestamps: false
});

module.exports = ProfessorCourse;
