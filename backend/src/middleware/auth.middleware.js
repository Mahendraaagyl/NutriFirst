import jwt from 'jsonwebtoken';

/**
 * Middleware untuk verifikasi JWT di HttpOnly cookie.
 * - Memblokir request tanpa token (401)
 * - Memblokir request dengan token kadaluarsa atau invalid (401)
 * - Inject req.user = { userId, email } kalau valid
 */
export function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: 'Tidak terautentikasi. Silakan login terlebih dahulu.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Sesi kadaluarsa. Silakan login ulang.' });
    }
    return res.status(401).json({ message: 'Token tidak valid.' });
  }
}
