import { exec } from 'child_process';
import fs from 'fs';

// Convert PDF to PNG images and save to outputDir/page-XX.png
const convertPdfToImage = (pdfPath, outputName, callback) => {
  // Ensure output directory exists
  const outputDir = outputName.substring(0, outputName.lastIndexOf('/'));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const cmd = `pdftoppm -png -r 300 "${pdfPath}" "${outputName}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Conversion error:', stderr);
      if (callback) callback(error);
    } else {
      console.log('PDF converted to PNGs in', outputDir);
      if (callback) callback(null);
    }
  });
};

export default convertPdfToImage;
