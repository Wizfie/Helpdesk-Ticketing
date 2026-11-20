import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

// Import Routes
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import slaRoutes from './routes/slaRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import kbRoutes from './routes/kbRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Upload Storage Directory from .env
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Global Middlewares
app.use(cors({
  origin: '*', // Allow frontend development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-simulated-user-id']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static file serving for uploads (Read-only security)
app.use('/uploads', express.static(uploadDir));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Helpdesk Ticketing API PT Glotra',
    environment: process.env.NODE_ENV || 'development',
    uploadStoragePath: uploadDir,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/sla', slaRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/system', systemRoutes);
app.use('/api', masterRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Express Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan internal pada server backend.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Helpdesk REST API PT Glotra Aktif di Port ${PORT}`);
  console.log(`📡 URL API: http://localhost:${PORT}/api`);
  console.log(`📁 Upload Storage: ${uploadDir}`);
  console.log('====================================================');
});

export default app;
