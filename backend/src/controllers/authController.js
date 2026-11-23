import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';
import jwt from 'jsonwebtoken';

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
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
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat profil pengguna.', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { userId, email } = req.body;
    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email }
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'Akun staf pengguna tidak ditemukan.' });
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
      description: `Staf ${user.name} (${user.role}) berhasil masuk / beralih sesi ke sistem`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      message: 'Login berhasil.',
      token,
      user
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

    return res.status(201).json(newUser);
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
      dataToUpdate.password = String(password).trim();
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

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui data staf.', error: error.message });
  }
}
