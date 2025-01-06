import express from "express";
import "dotenv/config";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening to port : ${process.env.PORT || 3000}`);
});
