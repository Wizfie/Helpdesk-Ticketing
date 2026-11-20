import prisma from '../lib/prisma.js';

// ==========================================
// 1. Categories Master (Linked to kb_options)
// ==========================================
export async function getCategories(req, res) {
  try {
    const categories = await prisma.kbOption.findMany({
      where: { type: 'CATEGORY' },
      orderBy: { name: 'asc' }
    });
    const mapped = categories.map(c => ({
      id: c.id,
      name: c.name,
      code: c.name,
      desc: c.name
    }));
    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    const normalizedName = name.trim();
    const existing = await prisma.kbOption.findFirst({
      where: { type: 'CATEGORY', name: normalizedName }
    });
    if (existing) {
      return res.status(200).json({ success: true, data: { ...existing, code: existing.name, desc: existing.name } });
    }

    const newCategory = await prisma.kbOption.create({
      data: {
        type: 'CATEGORY',
        name: normalizedName
      }
    });

    res.status(201).json({ success: true, data: { ...newCategory, code: newCategory.name, desc: newCategory.name } });
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
  // Static SLA pause reasons: PART_INDENT, VENDOR, CUSTOMER
  const defaultReasons = [
    { code: 'PART_INDENT', name: 'Menunggu Pengadaan / Pengiriman Sparepart (Indent)' },
    { code: 'VENDOR', name: 'Eskalasi ke Principal / Vendor Pihak Ketiga' },
    { code: 'CUSTOMER', name: 'Menunggu Konfirmasi / Akses dari Customer' }
  ];
  return res.json({ success: true, data: defaultReasons });
}
