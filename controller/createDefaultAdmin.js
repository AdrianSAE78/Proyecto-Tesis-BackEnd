const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Role = require('../model/roleModel');
const Administrative = require('../model/administrativeModel');

async function createDefaultAdmin() {
  try {
    // 1. Crear los roles si no existen (usando bulkCreate)
    await Role.bulkCreate([
      { id_role: 1, role_name: 'administrative' },
      { id_role: 2, role_name: 'professor' },
      { id_role: 3, role_name: 'legal_representative' }
    ], { ignoreDuplicates: true });
    console.log('✅ Roles creados o ya existentes');

    // 2. Verificar si ya existe el usuario admin
    const existingAdmin = await User.findOne({ where: { user_name: 'admin' } });
    if (existingAdmin) return console.log('✅ Admin ya existe. No se creó nuevamente.');

    // 3. Crear entidad administrativa
    const administrative = await Administrative.create({
      firstName: 'Super',
      lastName: 'Admin',
      identification: '1726727546',
      email: 'admin@colegio.com',
      phone: '0999999999'
    });

    // 4. Crear usuario admin con id_role = 1 directamente
    const hashedPassword = await bcrypt.hash('12345678', 10);
    await User.create({
      user_name: 'admin',
      password: hashedPassword,
      id_administrative: administrative.id_administrative,
      id_role: 1
    });

    console.log('🎉 Usuario admin creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear admin por defecto:', error.message);
  }
}

module.exports = createDefaultAdmin;
