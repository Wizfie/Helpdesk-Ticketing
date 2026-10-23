import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Get upload path from .env with fallback
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists synchronously on startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage with UUID/Timestamp Renaming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

// MIME Type Whitelist Validator
const allowedMimes = (process.env.ALLOWED_MIME_TYPES || 'application/pdf,image/png,image/jpeg,image/svg+xml,text/plain').split(',');

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe berkas ${file.mimetype} tidak diizinkan. Hanya diizinkan: PDF, Gambar, dan Log Teks.`), false);
  }
};

const maxFileSize = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024;

export const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter
});
