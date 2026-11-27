import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const PLACEHOLDER_HASH = '$2a$10$defaultPlaceholderHash2026';

function sanitizeUser(user) {
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { id: 'asc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data staf pengguna.', error: error.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Pengguna belum terotentikasi.' });
    }
    return res.json(sanitizeUser(req.user));
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat profil pengguna.', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { userId, email, password } = req.body;
    let user = null;

    if (email) {
      const normalizedEmail = String(email).trim().toLowerCase();
      user = await prisma.user.findFirst({
        where: { email: normalizedEmail }
      });
    } else if (userId && process.env.NODE_ENV !== 'production') {
      user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Email atau kata sandi tidak sesuai. Periksa kembali kredensial Anda.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Akun staf berstatus non-aktif. Silakan hubungi Administrator.' });
    }

    const requirePasswordCheck = Boolean(email) || password !== undefined || process.env.NODE_ENV === 'production';
    if (requirePasswordCheck) {
      const hasCustomPassword = Boolean(user.password && user.password !== PLACEHOLDER_HASH);
      let isPasswordValid = false;

      if (!password) {
        isPasswordValid = false;
      } else if (!hasCustomPassword) {
        isPasswordValid = password === 'password123';
      } else if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isPasswordValid = bcrypt.compareSync(String(password), user.password);
      } else {
        isPasswordValid = user.password === String(password);
      }

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email atau kata sandi tidak sesuai. Periksa kembali kredensial Anda.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'glotra_enterprise_helpdesk_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Audit Log: Perekaman aktivitas login (Sesuai MoM Poin 13)
    await logAuditEvent({
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: `USER-00${user.id}`,
      description: `Staf ${user.name} (${user.role}) berhasil masuk ke sistem`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: 'Login berhasil.',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat otentikasi login.', error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, role, roleCode, phone } = req.body;
    const actor = req.user;
    const targetRole = role || roleCode || 'ENGINEER';

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: targetRole,
        phone,
        isActive: true
      }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: `USER-00${newUser.id}`,
      description: `Mendaftarkan staf baru: ${newUser.name} (Peran: ${targetRole})`,
      ipAddress: req.ip
    });

    return res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan staf baru.', error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, roleCode, phone, isActive, password } = req.body;
    const actor = req.user;

    const targetUser = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!targetUser) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    const dataToUpdate = {};
    if (phone !== undefined) dataToUpdate.phone = phone ? phone.trim() : null;
    if (password && String(password).trim().length >= 6) {
      dataToUpdate.password = bcrypt.hashSync(String(password).trim(), 10);
    }

    // Hanya ADMIN yang boleh mengubah nama, email, role, dan status aktif
    if (actor?.role === 'ADMIN') {
      if (name) dataToUpdate.name = name.trim();
      if (email) dataToUpdate.email = email.trim();
      if (isActive !== undefined) dataToUpdate.isActive = isActive;
      if (role || roleCode) dataToUpdate.role = role || roleCode;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate
    });

    const isPasswordChange = !!password;
    await logAuditEvent({
      userName: actor?.name || updatedUser.name,
      role: actor?.role || updatedUser.role,
      action: isPasswordChange ? 'USER_PASSWORD_CHANGED' : 'USER_UPDATED',
      entityType: 'USER',
      entityId: `USER-00${updatedUser.id}`,
      description: isPasswordChange 
        ? `Pengguna ${updatedUser.name} memperbarui kata sandi akun.`
        : `Pengguna ${updatedUser.name} memperbarui informasi kontak profil (No. Telp: ${updatedUser.phone || '-'}).`,
      ipAddress: req.ip
    });

    return res.json(sanitizeUser(updatedUser));
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui data staf.', error: error.message });
  }
}
