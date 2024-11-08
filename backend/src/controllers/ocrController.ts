// src/controllers/ocrController.ts
import { Request, Response } from "express";
import { extractTextFromImage, parseExtractedText } from "../utils/ocrUtils";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processOCR = async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);

  try {
    const text = await extractTextFromImage(filePath);
    const parsedData = parseExtractedText(text);
    res.json({ parsedData });

    // Delete the file after processing
    await fs.unlink(filePath);
    console.log("File deleted successfully");
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({ error: "Error processing the file" });
  }
};

export { processOCR };
