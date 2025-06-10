const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const studentRoute = require('./routes/studentRoute');
const administrativeRoute = require('./routes/administrativeRoute');
const courseRoute = require('./routes/courseRoute');
const userRoutes = require('./routes/userRoutes');
const asistanceRoutes = require('./routes/asistanceRoute');
const incidentsRoute = require('./routes/incidentsRoute');
const legalRepresentativeRoute = require('./routes/legalRepresentativeRoute');
const professorRoute = require('./routes/professorRoute');
const roleRoute = require('./routes/roleRoute');
const authRoute = require('./routes/authRoute');

const app = express();
const PORT = 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/api', studentRoute);
app.use('/api', administrativeRoute);
app.use('/api', courseRoute);
app.use('/api/asistances', asistanceRoutes);
app.use('/api', userRoutes);
app.use('/api', professorRoute);
app.use('/api', legalRepresentativeRoute);
app.use('/api', incidentsRoute)
app.use('/api', roleRoute);
app.use('/api/auth', authRoute);

// Iniciar el servidor
sequelize.sync().then(() => {
    console.log('Base de datos conectada!');
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.error('Error conectando la base de datos:', error));
