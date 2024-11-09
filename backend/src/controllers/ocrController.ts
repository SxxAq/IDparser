import { Request, Response } from "express";
import { extractTextFromImage, parseExtractedText } from "../utils/ocrUtils";
import * as fs from "fs/promises";

export const processOCR = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const filePath = req.file.path;

  try {
    // Extract text from image
    const text = await extractTextFromImage(filePath);
    
    // Parse the extracted text
    const parsedData = parseExtractedText(text);

    // Add confidence check
    const isDataComplete = Object.values(parsedData).every(value => value !== 'Not Found');

    // Send response
    res.json({ 
      success: true,
      data: parsedData,
      confidence: isDataComplete ? 'high' : 'low'
    });

  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ 
      success: false,
      error: "Error processing document" 
    });
  } finally {
    // Cleanup: Delete uploaded file
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};