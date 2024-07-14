import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.mjs";
import offerRoutes from "./routes/offerRoutes.mjs";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.MONGO_URI,
    { dbName: "olgenerator", useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/api", offerRoutes);

app.get("*", (req, res) => {
  res.status(404).json({ info: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
