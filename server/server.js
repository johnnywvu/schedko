// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';
import convertPdfToImage from './processes/convertPdfToImage.js';
import { recognizeText } from './processes/ocr.js';
import { normalizeClassCode } from './processes/utils.js';

let lastClassCode = null; // Store the last received class code in memory
let ocrResults = []; // Store all parsed objects here

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `unprocessedFile${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// --- Upload and OCR Route ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const pdfPath = req.file.path;

    const outputDir = path.join('server/pages');

    const outputName = path.join(outputDir, 'page');

    await new Promise((resolve, reject) => {

      convertPdfToImage(pdfPath, outputName, err => err ? reject(err) : resolve());

    });
    const files = await fs.readdir(outputDir);

    const pageImages = files.filter(f => f.match(/^page-\d+\.png$/)).sort((a, b) => {
      const getNum = s => parseInt(s.match(/(\d+)/)?.[0] || '0', 10);

      return getNum(a) - getNum(b);

    });

    ocrResults = [];
    let examSem = null;
    let academicYear = null;
    // Get examSem and academicYear from the first line of the first page
    if (pageImages.length > 0) {
      const firstPageText = await recognizeText(path.join(outputDir, pageImages[0]));
      const firstLine = firstPageText.split('\n')[0];
      // Example: "Midterm 2024-2025" or "Finals 2023-2024"
      // Extract examSem (m or f) and academicYear (20XX-20XX)
      const semMatch = firstLine.match(/midterm|finals/i);
      if (semMatch) {
        examSem = semMatch[0].toLowerCase().startsWith('m') ? 'm' : 'f';
      }
      const yearMatch = firstLine.match(/(20\d{2}-20\d{2})/);
      if (yearMatch) {
        academicYear = yearMatch[1];
      }
    }
    for (const img of pageImages) {
      const text = await recognizeText(path.join(outputDir, img));
      const lines = text.split('\n').slice(1); // skip first line
      for (const line of lines) {
        const parts = line.split(',').map(part => part.trim());
        if (parts.length !== 6) continue;
        const [classCodeRaw, course, date, time, room, college] = parts;
        const normalizedClassCode = normalizeClassCode(classCodeRaw);
        ocrResults.push({
          classCode: normalizedClassCode,
          course,
          date,
          time,
          room,
          college,
          examSem,
          academicYear
        });
      }
    }
    console.log(ocrResults);
    return res.status(200).json({ success: true, message: 'File uploaded, converted, and OCR complete' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// --- Class Code Route ---
app.post('/api/classcode', (req, res) => {
  try {
    const { classCode } = req.body;
    if (!classCode || typeof classCode !== 'string') {
      console.log('Class code missing or invalid:', req.body);
      return res.status(400).json({ success: false, message: 'Class code is required' });
    }
    const normalizedClassCode = normalizeClassCode(classCode);
    lastClassCode = normalizedClassCode;
    console.log('Received class code:', normalizedClassCode, '| Raw body:', req.body);
    return res.status(200).json({ success: true, message: 'Class code received', classCode: normalizedClassCode });
  } catch (err) {
    console.log('Error in /api/classcode:', err, '| Raw body:', req.body);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// --- OCR Results Route ---
app.get('/api/ocr-results', (req, res) => {
  res.json({ success: true, data: ocrResults });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));