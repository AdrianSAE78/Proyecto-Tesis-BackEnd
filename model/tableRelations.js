const sequelize = require('../config/database');

const Administrative = require('./administrativeModel');
const Asistance = require('./asistanceModel');
const Course = require('./courseModel');
const Incident = require('./incidentsMoldel');
const LegalRepresentative = require('./legalRepresentativeModel');
const Professor = require('./professorModel');
const Student = require('./studentModel');
const User = require('./userModel');

// Student - LegalRepresentative (One-to-Many)
LegalRepresentative.hasMany(Student, { foreignKey: 'id_LegalRepresentative' });
Student.belongsTo(LegalRepresentative, { foreignKey: 'id_LegalRepresentative' });

// Student - Course (Many-to-One)
Course.hasMany(Student, { foreignKey: 'id_course' });
Student.belongsTo(Course, { foreignKey: 'id_course' });

// Professor - Course (Many-to-Many through Professor_Course)
const ProfessorCourse = sequelize.define('Professor_Course', {}, { timestamps: false });
Professor.belongsToMany(Course, { through: ProfessorCourse, foreignKey: 'id_professor' });
Course.belongsToMany(Professor, { through: ProfessorCourse, foreignKey: 'id_course' });

// Student - Asistance (One-to-Many)
Student.hasMany(Asistance, { foreignKey: 'id_student' });
Asistance.belongsTo(Student, { foreignKey: 'id_student' });

// Student - Incident (One-to-Many)
Student.hasMany(Incident, { foreignKey: 'id_student' });
Incident.belongsTo(Student, { foreignKey: 'id_student' });

// Professor - Asistance (One-to-Many)
Professor.hasMany(Asistance, { foreignKey: 'id_professor' });
Asistance.belongsTo(Professor, { foreignKey: 'id_professor' });

// Professor - Incident (One-to-Many)
Professor.hasMany(Incident, { foreignKey: 'id_professor' });
Incident.belongsTo(Professor, { foreignKey: 'id_professor' });

// User - Administrative (One-to-One)
Administrative.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Administrative, { foreignKey: 'id_user' });

// User - Professor (One-to-One)
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
    User
};