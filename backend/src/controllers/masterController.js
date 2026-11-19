import prisma from '../lib/prisma.js';

// ==========================================
// 1. Categories Master
// ==========================================
export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, code, desc } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name dan Code kategori wajib diisi.' });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        desc: desc || null
      }
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ==========================================
// 2. Principals Master
// ==========================================
export async function getPrincipals(req, res) {
  try {
    const principals = await prisma.principal.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: principals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createPrincipal(req, res) {
  try {
    const { name, code, category, specialist, supportEmail, supportPhone, portalUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama Principal wajib diisi.' });
    }

    const principalCode = code || name.replace(/[^A-Za-z0-9]/g, '').slice(0, 10).toUpperCase();

    const principal = await prisma.principal.upsert({
      where: { code: principalCode },
      update: {
        name,
        category: category || null,
        specialist: specialist || null,
        supportEmail: supportEmail || null,
        supportPhone: supportPhone || null,
        portalUrl: portalUrl || null,
        isActive: true
      },
      create: {
        name,
        code: principalCode,
        category: category || null,
        specialist: specialist || null,
        supportEmail: supportEmail || null,
        supportPhone: supportPhone || null,
        portalUrl: portalUrl || null,
        isActive: true
      }
    });

    res.status(201).json({ success: true, data: principal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ==========================================
// 3. Quick Presets & Hold Reasons Master
// ==========================================
export async function getQuickPresets(req, res) {
  // Quick presets has been deprecated and cleaned
  return res.json({ success: true, data: [] });
}

export async function getHoldReasons(req, res) {
  try {
    const reasons = await prisma.slaHoldReason.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' }
    });
    res.json({ success: true, data: reasons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
