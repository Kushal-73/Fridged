import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import path from "path";

import auth from "./routes/auth.js";
import crud from "./routes/crud.js";

import { connectDB } from "./lib/db.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/crud", crud);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../fontend/dist")));

  app.get('/*splat',(req,res)=>{
        res.sendFile(path.join(__dirname, "../fontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});