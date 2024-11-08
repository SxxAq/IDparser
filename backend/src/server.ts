import express from "express";
import ocrRoutes from "./routes/ocrRoutes";
import config from "./config/default";


const app = express();
const port = config.port;

app.use("/api", ocrRoutes);


app.listen(port, () => {
  console.log(`Server running on Port : ${port}`);
});
