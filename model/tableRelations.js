const sequelize = require('../config/database');

const Administrative = require('./administrativeModel');
const Asistance = require('./asistanceModel');
const Course = require('./courseModel');
const Incident = require('./incidentsModel');
const LegalRepresentative = require('./legalRepresentativeModel');
const Professor = require('./professorModel');
const ProfessorCourse = require('./professorCourseModel');
const Student = require('./studentModel');
const User = require('./userModel');

LegalRepresentative.hasMany(Student, { foreignKey: 'id_legal_representative' });
Student.belongsTo(LegalRepresentative, { foreignKey: 'id_legal_representative' });


Course.hasMany(Student, { foreignKey: 'id_course' });
Student.belongsTo(Course, { foreignKey: 'id_course' });

// Relación muchos a muchos entre Professor y Course a través de la tabla intermedia ProfessorCourse
Professor.belongsToMany(Course, { through: ProfessorCourse, foreignKey: 'id_professor', as: 'courses'});
Course.belongsToMany(Professor, { through: ProfessorCourse, foreignKey: 'id_course', as: 'professors'});

Student.hasMany(Asistance, { foreignKey: 'id_student' });
Asistance.belongsTo(Student, { foreignKey: 'id_student' });

Student.hasMany(Incident, { foreignKey: 'id_student' });
Incident.belongsTo(Student, { foreignKey: 'id_student' });

Professor.hasMany(Asistance, { foreignKey: 'id_professor' });
Asistance.belongsTo(Professor, { foreignKey: 'id_professor' });

Professor.hasMany(Incident, { foreignKey: 'id_professor' });
Incident.belongsTo(Professor, { foreignKey: 'id_professor' });

Administrative.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Administrative, { foreignKey: 'id_user' });

Professor.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Professor, { foreignKey: 'id_user' });

module.exports = { 
  Administrative,
  Student,
  LegalRepresentative,
  Course,
  Professor,
  Asistance,
  Incident,
  User,
  ProfessorCourse
};
