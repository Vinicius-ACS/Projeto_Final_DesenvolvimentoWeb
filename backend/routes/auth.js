const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/auth').authenticate;
const authorize = require('../middlewares/auth').authorize;

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '7d';

// Register: if no users exist, allow creation of initial admin without auth.
// Otherwise registration requires ADMIN role.
router.post('/register', authenticate.optional, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ erro: 'Usuário já existe' });

    const usersCount = await prisma.user.count();
    // if users exist, registration requires ADMIN
    if (usersCount > 0) {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ erro: 'Registro restrito a administradores' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, role: role || 'VIEWER' } });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao autenticar' });
  }
});

module.exports = router;
