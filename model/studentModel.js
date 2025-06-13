const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const LegalRepresentative = require('./legalRepresentativeModel'); // Asegúrate de importar

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
  },
  id_legal_representative: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'legal_representatives',
      key: 'id_representative'
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
  tableName: 'students',
  timestamps: false
});

// 🔗 Asociación con LegalRepresentative
Student.belongsTo(LegalRepresentative, {
  foreignKey: 'id_legal_representative',
  targetKey: 'id_representative',
  onDelete: 'CASCADE'
});

module.exports = Student;
