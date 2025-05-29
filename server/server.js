// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import convertPdfToImage from './processes/convertPdfToImage.js';
import { recognizeText } from './processes/ocr.js';
import cors from 'cors';

let lastClassCode = null; // Store the last received class code in memory
let ocrResults = []; // Store all parsed objects here

const app = express();

app.use(cors()); // Enable CORS for all routes

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

app.use(express.json()); // Add this to parse JSON bodies

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Convert PDF to images and save to pages directory
    const pdfPath = req.file.path;
    const outputDir = path.join('server/pages');
    const outputName = path.join(outputDir, 'page');
    await new Promise((resolve, reject) => {
      convertPdfToImage(pdfPath, outputName, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // OCR each image in the pages directory
    const files = await fs.readdir(outputDir);
    const pageImages = files.filter(f => f.match(/^page-\d+\.png$/)).sort((a, b) => {
      // Sort numerically by page number
      const getNum = s => parseInt(s.match(/(\d+)/)?.[0] || '0', 10);
      return getNum(a) - getNum(b);
    });
    ocrResults = [];
    for (const img of pageImages) {
      const text = await recognizeText(path.join(outputDir, img));
      // Use the improved parseExamSchedule logic
      const lines = text.split('\n').slice(1); // skip first line
      for (const line of lines) {
        const parts = line.split(',').map(part => part.trim());
        if (parts.length !== 6) continue;
        const [classCodeRaw, course, date, time, room, college] = parts;
        const normalizedClassCode = classCodeRaw.toLowerCase().replace(/[\s\-\/]/g, '');
        ocrResults.push({
          classCode: normalizedClassCode,
          course,
          date,
          time,
          room,
          college,
        });
      }
    }
    console.log('OCR Results:', JSON.stringify(ocrResults, null, 2)); // Print the array of objects after OCR
    return res.status(200).json({ success: true, message: 'File uploaded, converted, and OCR complete' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

app.post('/api/classcode', (req, res) => {
  try {
    const { classCode } = req.body;
    if (!classCode || typeof classCode !== 'string') {
      console.log('Class code missing or invalid:', req.body); // Debug
      return res.status(400).json({ success: false, message: 'Class code is required' });
    }
    lastClassCode = classCode; // Store in variable
    console.log('Received class code:', classCode, '| Raw body:', req.body); // Debug: log to server
    return res.status(200).json({ success: true, message: 'Class code received', classCode });
  } catch (err) {
    console.log('Error in /api/classcode:', err, '| Raw body:', req.body); // Debug
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

app.get('/api/ocr-results', (req, res) => {
  res.json({ success: true, data: ocrResults });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));