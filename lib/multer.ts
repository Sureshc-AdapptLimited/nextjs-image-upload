// lib/multer.ts
import multer from 'multer';
import path from 'path';

// Configure storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname || `${Date.now()}-${file.originalname}`);
  }
});

// Initialize multer with the configured storage
const upload = multer({ storage });

export default upload;
