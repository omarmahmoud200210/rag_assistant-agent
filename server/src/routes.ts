import express, { RequestHandler } from "express";
import multer from "multer";
import os from "os";
import { ingest } from "./ingest";
import { unlink } from "node:fs/promises";
import { runAgent } from "./agent";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const fileType = file.originalname.toLowerCase().endsWith("pdf");
    if (file.mimetype === "application/pdf" && fileType) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const handleUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await ingest(req.file.path);
    await unlink(req.file.path).catch(() => undefined);

    return res.json({ ok: true });
  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file?.path) {
      await unlink(req.file.path).catch(() => undefined);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ error: "No message provided" });

    const answer = await runAgent(message);
    const output = answer.output || "";

    if (!output || !output.trim()) {
      return res.json({
        message:
          "I apologize, but i couldn't generate a proper response. Please try again.",
      });
    }

    return res.json({ message: output });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/chat", handleChat);
router.post("/upload", upload.single("file"), handleUpload);
router.get("/health", (req, res) => {
  res.json({ status: "online" });
});

export default router;
