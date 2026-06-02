import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const isProduction = process.env.NODE_ENV === 'production';


const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  path: '/',
};

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}


// POST /api/auth/register

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validasi
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Email, password, dan nama wajib diisi.',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter.' });
    }

    // Cek duplikat
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    // Set cookie + response
    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      message: 'Registrasi berhasil',
      user,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}


// POST /api/auth/login

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email dan password wajib diisi.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.json({
      message: 'Login berhasil',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}


// POST /api/auth/logout

export async function logout(req, res) {
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
  return res.json({ message: 'Logout berhasil' });
}


// GET /api/auth/me  (Protected)

export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}
