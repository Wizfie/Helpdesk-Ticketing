import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';
import jwt from 'jsonwebtoken';

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
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
        where: { id: Number(userId) },
        include: { role: true }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'Akun staf pengguna tidak ditemukan.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.code, email: user.email },
      process.env.JWT_SECRET || 'glotra_enterprise_helpdesk_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Audit Log: Perekaman aktivitas login (Sesuai MoM Poin 13)
    await logAuditEvent({
      userName: user.name,
      role: user.role.code,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: `USER-00${user.id}`,
      description: `Staf ${user.name} (${user.role.name}) berhasil masuk / beralih sesi ke sistem`,
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
    const { name, email, roleCode, phone, roleTitle, shift } = req.body;
    const actor = req.user;

    const role = await prisma.role.findUnique({
      where: { code: roleCode || 'ENGINEER' }
    });

    const parts = name.trim().split(' ');
    const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();

    const newUser = await prisma.user.create({
      data: {
        roleId: role.id,
        name,
        email,
        initials,
        phone,
        roleTitle: roleTitle || (roleCode === 'ADMIN' ? 'Operations Staff' : 'Support Engineer'),
        shift: shift || 'Standard Office Hours',
        isActive: true
      },
      include: { role: true }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: `USER-00${newUser.id}`,
      description: `Mendaftarkan staf baru: ${newUser.name} (Peran: ${role.name})`,
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
    const { name, email, roleCode, phone, roleTitle, shift, isActive } = req.body;
    const actor = req.user;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (roleTitle !== undefined) dataToUpdate.roleTitle = roleTitle;
    if (shift !== undefined) dataToUpdate.shift = shift;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    if (roleCode) {
      const role = await prisma.role.findUnique({ where: { code: roleCode } });
      if (role) dataToUpdate.roleId = role.id;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      include: { role: true }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'USER_UPDATED',
      entityType: 'USER',
      entityId: `USER-00${updatedUser.id}`,
      description: `Memperbarui data profil staf ${updatedUser.name}`,
      ipAddress: req.ip
    });

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui data staf.', error: error.message });
  }
}
