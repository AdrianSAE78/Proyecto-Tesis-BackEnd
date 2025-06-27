const isAdmin = (req, res, next) => {
  if (!['admin', 'administrative'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};
  
  module.exports = isAdmin;