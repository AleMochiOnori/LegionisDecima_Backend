import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import reviewRoutes from "./routes/reviews.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connesso ✅"))
  .catch(err => console.error("Errore MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(process.env.PORT, () => console.log(`Server in esecuzione sulla porta ${process.env.PORT}`));
