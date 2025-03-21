const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes');
const asistanceRoutes = require('./routes/asistanceRoute');

const sequelize = require('./config/database');

const incidentsRoute = require('./routes/incidentsRoute');
const legalRepresentativeRoute = require('./routes/legalRepresentativeRoute');
const professorRoute = require('./routes/professorRoute');

const app = express();

const PORT = 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/asistances', asistanceRoutes);

app.use('/api', userRoutes);

app.use('/api', professorRoute);
app.use('/api', legalRepresentativeRoute);
app.use('/api', incidentsRoute)

// Iniciar el servidor
sequelize.sync().then(() => {
    console.log('Base de datos conectada!')
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.error('Error conectando la base de datos: ', error))