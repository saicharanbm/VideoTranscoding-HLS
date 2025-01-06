import express from "express";
import "dotenv/config";
import multer from "multer";
import path from "path";
import cors from "cors";
import client from "./db";

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.originalname.split(".");
    cb(null, fileName[0] + "-" + uniqueSuffix + "." + fileName[1]);
  },
});
const upload = multer({ storage });

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening to port : ${process.env.PORT || 3000}`);
});

app.put("/upload", upload.single("file"), async (req, res) => {
  const { file } = req;
  if (!file) {
    res.status(400).json({ message: "Upload failed" });
    return;
  }
  const newUpload = await client.upload.create({
    data: {
      uploadUrl: path.join(__dirname, "uploads", file?.filename),
    },
  });
  res.json({ message: "Upload successful", uploadId: newUpload.id });
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const uploadFromDb = await client.upload.findFirst({
    where: { id },
  });

  if (!uploadFromDb) {
    res.status(404).json({ message: "File not found" });
    return;
  }

  res.json({
    status: uploadFromDb.status.toString(),
  });
});
