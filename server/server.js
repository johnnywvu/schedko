// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import convertPdfToImage from './processes/convertPdfToImage.js';
import 'dotenv/config';
import cors from 'cors';
import processExamSchedule from './processes/parseData.js';
import { validateExamFileHeader } from './processes/parseData.js';

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `unprocessedFile${ext}`);
  }
});

const upload = multer({ storage });

app.use(cors());


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Convert PDF to images and save to pages directory
    const pdfPath = req.file.path;
    const outputName = path.join('server/pages/page');
    await new Promise((resolve, reject) => {
      convertPdfToImage(pdfPath, outputName, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    return res.status(200).json({ success: true, message: 'File uploaded and converted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));