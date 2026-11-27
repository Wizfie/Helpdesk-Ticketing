import { cleanAllTransactionalData, seedCompleteEnterpriseData, getSystemStatus } from '../services/systemService.js';

export async function resetClean(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Operasi reset database dinonaktifkan di lingkungan produksi.'
    });
  }
  try {
    const result = await cleanAllTransactionalData(req.user);
    return res.json(result);
  } catch (error) {
    console.error('❌ Gagal membersihkan database:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membersihkan database tiket.',
      error: error.message
    });
  }
}

export async function resetSeed(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Operasi re-seed database dinonaktifkan di lingkungan produksi.'
    });
  }
  try {
    const result = await seedCompleteEnterpriseData(req.user);
    return res.json(result);
  } catch (error) {
    console.error('❌ Gagal seeding database:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat ulang data seeding tiket ke database.',
      error: error.message
    });
  }
}

export async function getStatus(req, res) {
  try {
    const status = await getSystemStatus();
    return res.json(status);
  } catch (error) {
    console.error('❌ Gagal memeriksa status sistem:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil status sistem database.',
      error: error.message
    });
  }
}
