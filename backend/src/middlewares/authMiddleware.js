import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export async function authenticate(req, res, next) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const authHeader = req.headers.authorization;
    let user = null;

    if (!isProduction) {
      // Header simulasi hanya untuk pengembangan lokal non-produksi
      const simulatedUserId = req.headers['x-simulated-user-id'];
      if (simulatedUserId) {
        user = await prisma.user.findUnique({
          where: { id: Number(simulatedUserId) }
        });
        if (user) {
          const { password: _, ...safeUser } = user;
          req.user = safeUser;
          return next();
        }
      }
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'glotra_enterprise_helpdesk_secret_key_2026');
      user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      if (user && !user.isActive) {
        return res.status(403).json({ message: 'Akun pengguna berstatus non-aktif.' });
      }
    }

    if (!user && !isProduction) {
      // Fallback hanya aktif untuk pengembangan lokal non-produksi
      user = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Otentikasi diperlukan. Silakan masuk terlebih dahulu.' });
    }

    const { password: _, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesi otentikasi tidak valid atau telah berakhir.', error: error.message });
  }
}

export function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Akses ditolak: Data pengguna tidak terotentikasi.' });
    }

    const userRole = typeof req.user.role === 'string' ? req.user.role : req.user.role?.code;
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Akses ditolak: Peran ${userRole} tidak memiliki izin untuk tindakan ini.`,
        requiredRoles: allowedRoles 
      });
    }

    next();
  };
}
