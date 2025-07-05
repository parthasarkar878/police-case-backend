import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

import caseRoutes from "./routes/case.js";
app.use("/api/case", caseRoutes);


app.get("/", (req, res) => {
    res.send("API Running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

