// -------------------- IMPORTACIONES --------------------
const express = require('express');
const morgan = require('morgan');                   // Para logs de peticiones en consola
const cors = require('cors');                       // Para permitir solicitudes de diferentes dominios
const bodyParser = require('body-parser');          // Para leer datos en formato JSON
const sequelize = require('./config/database');     // Conexión a la base de datos

// -------------------- RUTAS --------------------
const studentRoute = require('./routes/studentRoute');
const administrativeRoute = require('./routes/administrativeRoute');
const courseRoute = require('./routes/courseRoute');
const userRoutes = require('./routes/userRoutes');
const asistanceRoutes = require('./routes/asistanceRoute');
const incidentsRoute = require('./routes/incidentsRoute');
const legalRepresentativeRoute = require('./routes/legalRepresentativeRoute');
const professorRoute = require('./routes/professorRoute');
const roleRoute = require('./routes/roleRoute');
const authRoute = require('./routes/authRoute');    // Rutas de login y (posiblemente) registro

// -------------------- CONFIGURACIÓN --------------------
const app = express();
const PORT = 3000;

// -------------------- MIDDLEWARES --------------------
app.use(morgan('dev'));               // Muestra detalles de cada request en consola
app.use(bodyParser.json());           // Permite interpretar JSON en las peticiones
app.use(cors());                      // Habilita CORS para cualquier dominio

// -------------------- RUTAS API --------------------
// Rutas agrupadas bajo /api o subrutas específicas
app.use('/api', studentRoute);
app.use('/api', administrativeRoute);
app.use('/api/courses', courseRoute);
app.use('/api/asistances', asistanceRoutes);
app.use('/api', userRoutes);
app.use('/api', professorRoute);
app.use('/api/legal-representatives', legalRepresentativeRoute);
app.use('/api/incidents', incidentsRoute);
app.use('/api', roleRoute);
app.use('/api/auth', authRoute); // 👈 Aquí va tu login y (posiblemente) register

// -------------------- INICIO DEL SERVIDOR --------------------
// Sincroniza los modelos con la BD (usa alter para evitar duplicados/conflictos)
//sequelize.sync({ force: true }) --> Para eliminar todos los datos de mi DB
sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Base de datos conectada!');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('❌ Error conectando la base de datos:', error);
});
