import express from "express";
import ocrRoutes from "./routes/ocrRoutes";
import cors from 'cors'

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use("/api", ocrRoutes);

app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
