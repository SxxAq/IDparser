import express from "express";
import ocrRoutes from "./routes/ocrRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", ocrRoutes);

app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});