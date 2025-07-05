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
const Role = require('./roleModel');
const Guard = require('./guardModel');
const UsedQRToken = require('./usedQrToken');

// LegalRepresentative ↔ Student (1:N)
LegalRepresentative.hasMany(Student, { foreignKey: 'id_legal_representative' });
Student.belongsTo(LegalRepresentative, { foreignKey: 'id_legal_representative' });

// Course ↔ Student (1:N)
Course.hasMany(Student, { foreignKey: 'id_course' });
Student.belongsTo(Course, { foreignKey: 'id_course' });

// Professor ↔ Course (N:M) a través de professor_courses ✅
Professor.belongsToMany(Course, {
  through: ProfessorCourse,
  foreignKey: 'id_professor',
  otherKey: 'id_course',
  as: 'courses'
});

Course.belongsToMany(Professor, {
  through: ProfessorCourse,
  foreignKey: 'id_course',
  otherKey: 'id_professor',
  as: 'professors'
});

// Relaciones directas para hacer include desde ProfessorCourse
ProfessorCourse.belongsTo(Professor, { foreignKey: 'id_professor', as: 'professor' });
ProfessorCourse.belongsTo(Course, { foreignKey: 'id_course', as: 'course' });

// Student ↔ Asistance (1:N)
Student.hasMany(Asistance, { foreignKey: 'id_student' });
Asistance.belongsTo(Student, { foreignKey: 'id_student' });

// Professor ↔ Asistance (1:N)
Professor.hasMany(Asistance, { foreignKey: 'id_professor' });
Asistance.belongsTo(Professor, { foreignKey: 'id_professor' });

// Student ↔ Incident (1:N)
Student.hasMany(Incident, { foreignKey: 'id_student' });
Incident.belongsTo(Student, { foreignKey: 'id_student' });

// Professor ↔ Incident (1:N)
Professor.hasMany(Incident, { foreignKey: 'id_professor' });
Incident.belongsTo(Professor, { foreignKey: 'id_professor' });

// User ↔ Administrative (1:1)
Administrative.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Administrative, { foreignKey: 'id_user' });

// User ↔ Professor (1:1)
Professor.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Professor, { foreignKey: 'id_user' });

// User ↔ Legal Representative (1:1)
LegalRepresentative.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(LegalRepresentative, { foreignKey: 'id_user' });

// User ↔ Guard (1:1)
Guard.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Guard, { foreignKey: 'id_user' });

// Relaciones Asistance
Asistance.belongsTo(Student, { foreignKey: 'id_student', as: 'asistedStudent' });
Asistance.belongsTo(Professor, { foreignKey: 'id_professor', as: 'asistanceProfessor' });

// Relaciones Incident
Incident.belongsTo(Student, { foreignKey: 'id_student' });
Incident.belongsTo(Professor, { foreignKey: 'id_professor' });

// Asociación: User pertenece a un Role
User.belongsTo(Role, { foreignKey: 'id_role', as: 'role' });

module.exports = { 
  Administrative,
  Student,
  LegalRepresentative,
  Course,
  Professor,
  Asistance,
  Incident,
  User,
  ProfessorCourse,
  Role,
  Guard,
  UsedQRToken
};
