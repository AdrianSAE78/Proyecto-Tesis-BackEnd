const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes');

const sequelize = require('./config/database');

const app = express();

const PORT = 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hola, mundo!');
});

// Iniciar el servidor
sequelize.sync().then(() => {
    console.log('Base de datos conectada!')
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.error('Error conectando la base de datos: ', error))