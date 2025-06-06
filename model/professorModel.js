const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professor = sequelize.define('Professor', {
    id_professor: {
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
    identification: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    
}, {
    tableName: 'professors',
});

module.exports = Professor;

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
  
  module.exports = Professor;