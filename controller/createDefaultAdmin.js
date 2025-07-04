const bcrypt = require('bcrypt');
const { User, Role, Administrative } = require('../model/tableRelations');

async function createDefaultAdmin() {
  try {
    // 1. Crear roles si no existen
    await Role.bulkCreate([
      { id_role: 1, role_name: 'administrative' },
      { id_role: 2, role_name: 'professor' },
      { id_role: 3, role_name: 'legal_representative' },
      { id_role: 4, role_name: 'guard' } 
    ], { ignoreDuplicates: true });
    console.log('✅ Roles creados o ya existentes');

    // 2. Verificar si el admin ya existe
    const existingAdmin = await User.findOne({ where: { user_name: 'admin' } });
    if (existingAdmin) return console.log('✅ Admin ya existe. No se creó nuevamente.');

    // 3. Crear usuario primero
    const plainPassword = '1726727546';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = await User.create({
      user_name: 'admin',
      password: hashedPassword,
      id_role: 1,
    });

    // 4. Luego crear el administrativo con el id_user recién generado
    await Administrative.create({
      firstName: 'Ariel',
      lastName: 'Umatambo',
      identification: plainPassword,
      email: 'admin@colegio.com',
      phone: '0998000597',
      id_user: newUser.id_user,
    });

    console.log('🎉 Usuario admin creado exitosamente');
  } catch (error) {
    console.error('❌ Error al crear admin por defecto:', error.message);
  }
}

module.exports = createDefaultAdmin;
