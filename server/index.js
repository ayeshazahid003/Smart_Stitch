import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDb } from "./connection/connection.js";
import { initSocket } from "./socket.js"; // Import socket setup


import router from "./routes/routes.js";
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();
const app = express();

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true })); 
app.use(cors());

const PORT = process.env.PORT || 5000;

connectDb();

const httpServer = http.createServer(app);

initSocket(httpServer);

app.use('/', router);
app.use('/', uploadRoutes)

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
