const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // 👈 Agrega esto para evitar el error del certificado
    }
  });
  

const sendCredentialsEmail = async (to, name, username, password) => {
  const mailOptions = {
    from: `"Unidad Educativa JN" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Credenciales App Unidad Educativa Jesus de Nazareth',
    html: `
      <p>Estimado/a:<br><strong>${name}</strong></p>
      <p>¡La Unidad Educativa Jesus de Nazareth te da la bienvenida!</p>
      <p><strong>Tus credenciales de acceso</strong> a la App de la institución son:</p>
      <ul>
        <li>Usuario: <strong>${username}</strong></li>
        <li>Contraseña: <strong>${password}</strong></li>
      </ul>
      <p>Por seguridad, se recomienda cambiar la clave.</p>
      <br>
      <p><strong>JN - Quito</strong><br>¡Soy Nazareno, soy triunfador!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};

module.exports = { sendCredentialsEmail };
