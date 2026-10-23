import prisma from '../lib/prisma.js';

export async function logAuditEvent({ userName, role, action, entityType, entityId, description, ipAddress = '127.0.0.1' }) {
  try {
    return await prisma.auditLog.create({
      data: {
        userName: userName || 'System Admin',
        role: role || 'ADMIN',
        action,
        entityType: entityType || null,
        entityId: entityId ? String(entityId) : null,
        description: description || '',
        ipAddress: ipAddress || '127.0.0.1',
        timestampUtc: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Gagal mencatat audit log:', error);
    return null;
  }
}
