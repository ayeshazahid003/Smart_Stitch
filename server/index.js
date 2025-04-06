import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { connectDb } from "./connection/connection.js";
import { initSocket } from "./socket.js";
import router from "./routes/routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 5000;

connectDb();

const httpServer = http.createServer(app);

initSocket(httpServer);

app.use("/", router);
app.use("/", uploadRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
