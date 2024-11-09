# IDparser

IDparser is a modern web application that extracts key information from identification documents (passports and driver's licenses) using OCR technology. It provides a clean, user-friendly interface for document uploads and displays extracted information including names, document numbers, and expiration dates.

## Features

- 📷 Image upload and preview
- 🔍 OCR processing using Google Cloud Vision API
- 📝 Extracts key information:
  - Name
  - Document Number
  - Expiration Date
- ⚡ Real-time processing
- 🎯 Confidence scoring for extracted data
- 🖼️ Image preprocessing for better accuracy

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Google Cloud Vision API
- Sharp for image preprocessing
- Multer for file uploads

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Google Cloud Vision API credentials
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SxxAq/IDparser.git
   cd idparser

2. Install backend dependencies:

```shellscript
cd backend
npm install

```


3. Install frontend dependencies:

```shellscript
cd ../frontend
npm install

```


4. Set up environment variables:

1. Create a `.env` file in the backend directory
2. Add your Google Cloud Vision API credentials
3. Configure other necessary environment variables



### Running the Application

1. Start the backend server:

```shellscript
cd backend
npm start

```


2. Start the frontend development server:

```shellscript
cd frontend
npm run dev

```

The application will be available at:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)


## API Endpoints

### POST /api/upload

Uploads and processes an identification document.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'document' field containing the image file


**Response:**

```json
 {{
  "success": true,
  "data": {
    "name": "John Doe",
    "documentNumber": "ABC123456",
    "expirationDate": "2025-12-31"
  },
  "confidence": "high"
}}

```

## Usage

1. Open the application in your web browser.
2. Click on the "Upload a file" button or drag and drop an image of a passport or driver's license.
3. Once the image is uploaded, click on "Extract Information".
4. The application will process the image and display the extracted information.


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Cloud Vision API for OCR processing
- The React and Vite communities for excellent documentation
- All contributors who help improve this project


## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.


