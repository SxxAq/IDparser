import { useState, ChangeEvent, FormEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

interface ParsedData {
  name: string;
  documentNumber: string;
  expirationDate: string;
  confidence: "high" | "low";
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setParsedData(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the document");
      }

      const result = await response.json();
      setParsedData(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              IDparser
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Document Information Extractor
            </h1>
            <p className="mt-2 text-gray-500">
              Upload a driver's license image to extract key
              information.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 max-w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={!file || loading}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  "Extract Information"
                )}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {parsedData && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Extracted Information
                </h2>
                <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Name</dt>
                    <dd className="text-gray-900">{parsedData.name}</dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Document Number</dt>
                    <dd className="text-gray-900">
                      {parsedData.documentNumber}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Expiration Date</dt>
                    <dd className="text-gray-900">
                      {parsedData.expirationDate}
                    </dd>
                  </div>
                  {/* <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Confidence</dt>
                    <dd
                      className={`${
                        parsedData.confidence === "high"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {parsedData.confidence.charAt(0).toUpperCase() + parsedData.confidence.slice(1)}
                    </dd>
                  </div> */}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
