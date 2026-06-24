const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';

function getToken(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  return parts[1];
}

const authenticate = {
  optional: (req, res, next) => {
    const token = getToken(req);
    if (!token) return next();
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.userId, role: payload.role, email: payload.email };
    } catch (e) {
      // ignore invalid token for optional
    }
    return next();
  },
  required: (req, res, next) => {
    const token = getToken(req);
    if (!token) return res.status(401).json({ erro: 'Token ausente' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.userId, role: payload.role, email: payload.email };
      return next();
    } catch (e) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
  }
};

function authorize(allowed) {
  // allowed can be string or array
  const allowedArr = Array.isArray(allowed) ? allowed : [allowed];
  return (req, res, next) => {
    // require token first
    const token = getToken(req);
    if (!token) return res.status(401).json({ erro: 'Token ausente' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.userId, role: payload.role, email: payload.email };
      if (!allowedArr.includes(req.user.role)) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      return next();
    } catch (e) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
  };
}

module.exports = { authenticate, authorize };
