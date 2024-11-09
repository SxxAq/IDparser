import { ImageAnnotatorClient } from '@google-cloud/vision';
import sharp from 'sharp';

interface DocumentData {
  name: string;
  documentNumber: string;
  expirationDate: string;
}

const visionClient = new ImageAnnotatorClient();

const preprocessImage = async (inputPath: string): Promise<Buffer> => {
  return await sharp(inputPath)
    .grayscale()
    .normalize()
    .sharpen()
    .toBuffer();
};

const extractTextFromImage = async (filePath: string): Promise<string> => {
  try {
    const imageBuffer = await preprocessImage(filePath);
    const [result] = await visionClient.textDetection({
      image: { content: imageBuffer.toString('base64') }
    });
    const detections = result.textAnnotations;
    return detections?.[0]?.description || '';
  } catch (error) {
    console.error('Error in OCR processing:', error);
    throw error;
  }
};

const parseExtractedText = (text: string): DocumentData => {
  const lines = text.split('\n');
  
  let name = 'Not Found';
  let documentNumber = 'Not Found';
  let expirationDate = 'Not Found';
  
  console.log('Extracted Text:', text);

  // Process each line
  lines.forEach((line, index) => {
    // Look for Indian DL number format (e.g., TN99 20190000999)
    const dlNumberMatch = line.match(/([A-Z]{2}\d{2}\s?\d{11})|([A-Z]{2}\d{2}\s?\d{8,10})/);
    if (dlNumberMatch) {
      documentNumber = dlNumberMatch[0].trim();
    }

    // Look for name (now handles Indian format better)
    if (line.includes('Name')) {
      // Check next line for name
      if (lines[index + 1] && !lines[index + 1].includes(':')) {
        name = lines[index + 1].trim();
      }
    } else if (line.match(/^[A-Z\s]+$/)) {
      // Fallback: look for all caps names
      name = line.trim();
    }

    // Look for expiration date
    if (line.includes('Valid Till')) {
      const dateMatch = line.match(/\d{2}[-/]\d{2}[-/]\d{4}/);
      if (dateMatch) {
        expirationDate = dateMatch[0];
      } else if (lines[index + 1]) {
        // Check next line for date
        const nextLineDateMatch = lines[index + 1].match(/\d{2}[-/]\d{2}[-/]\d{4}/);
        if (nextLineDateMatch) {
          expirationDate = nextLineDateMatch[0];
        }
      }
    }
  });

  // Additional date format check
  const datePattern = /\d{2}[-/]\d{2}[-/]\d{4}/g;
  const allDates = text.match(datePattern) || [];
  
  // If we haven't found an expiration date yet, look for the latest date
  if (expirationDate === 'Not Found' && allDates.length > 0) {
    expirationDate = allDates.reduce((latest, current) => {
      return new Date(current) > new Date(latest) ? current : latest;
    });
  }

  // Handle cases where name includes "Son/Daughter/Wife of"
  if (name !== 'Not Found') {
    const relationMatch = name.match(/(.*?)\s+(?:Son|Daughter|Wife)\s+of\s+(.*)/i);
    if (relationMatch) {
      name = relationMatch[1].trim();
    }
  }

  return {
    name,
    documentNumber,
    expirationDate
  };
};

export { extractTextFromImage, parseExtractedText, DocumentData };