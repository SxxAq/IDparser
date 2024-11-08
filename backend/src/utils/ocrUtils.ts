// src/utils/ocrUtils.ts
import { createWorker, createScheduler } from "tesseract.js";
import sharp from "sharp";
import * as fs from "fs/promises";
import * as path from "path";

const preprocessImage = async (inputPath: string, outputPath: string) => {
  await sharp(inputPath)
    .grayscale()
    .normalize()
    .toFile(outputPath);
};

const extractTextFromImage = async (filePath: string): Promise<string> => {
  const preprocessedPath = filePath.replace(/(\.\w+)$/, "_preprocessed$1");

  await preprocessImage(filePath, preprocessedPath);

  const scheduler = createScheduler();
  const worker1 = await createWorker('eng');
  const worker2 = await createWorker('eng');



  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);

  const { data: { text } } = await scheduler.addJob("recognize", preprocessedPath);

  await scheduler.terminate();
  await fs.unlink(preprocessedPath);

  return text;
};

const parseExtractedText = (text: string): Record<string, string> => {
  const nameMatch = text.match(/Name:\s*([A-Za-z\s]+)/i);
  const documentNumberMatch = text.match(/DL No\.\s*([A-Za-z0-9]+)/i);
  const issueDateMatch = text.match(/Date of Issue:\s*(\d{2}-\d{2}-\d{4})/i);
  const expirationDateMatch = text.match(/Valid Till:\s*(\d{2}-\d{2}-\d{4})/i);
  const dateOfBirthMatch = text.match(/Date of Birth:\s*(\d{2}-\d{2}-\d{4})/i);
  const bloodGroupMatch = text.match(/Blood Group:\s*([A-Z]+[+-])/i);
  const parentNameMatch = text.match(/Son\/Daughter\/Wife of\s*([A-Za-z\s]+)/i);

  return {
    name: nameMatch ? nameMatch[1].trim() : "Not Found",
    documentNumber: documentNumberMatch ? documentNumberMatch[1].trim() : "Not Found",
    issueDate: issueDateMatch ? issueDateMatch[1].trim() : "Not Found",
    expirationDate: expirationDateMatch ? expirationDateMatch[1].trim() : "Not Found",
    dateOfBirth: dateOfBirthMatch ? dateOfBirthMatch[1].trim() : "Not Found",
    bloodGroup: bloodGroupMatch ? bloodGroupMatch[1].trim() : "Not Found",
    parentName: parentNameMatch ? parentNameMatch[1].trim() : "Not Found",
  };
};

export { extractTextFromImage, parseExtractedText };
