const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'administrative') {
      return res.status(403).json({ message: 'Acceso restringido solo para administradores' });
    }
    next();
  };
  
  module.exports = isAdmin;
  