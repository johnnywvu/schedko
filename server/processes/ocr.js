// ===== parseData.js (Fixed version) =====
import 'dotenv/config';
import { createWorker } from 'tesseract.js';
import { insertExamSchedules, closeConnection, findExamSchedule } from './dbService.js';
import fs from 'fs/promises';

// ------------------- OCR -------------------
export const recognizeText = async (imagePath) => {
  const worker = await createWorker();
  try {
    const { data: { text } } = await worker.recognize(imagePath);
    return text;
  } catch (error) {
    throw new Error(`OCR failed for ${imagePath}: ${error.message}`);
  } finally {
    await worker.terminate();
  }
};
