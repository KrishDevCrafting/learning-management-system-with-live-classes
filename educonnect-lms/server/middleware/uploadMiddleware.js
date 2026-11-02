import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/videos";
const thumbnailDir = "uploads/thumbnails";

if (!fs.existsSync(upload)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const cleanalname = file.originalname.replace(/\s+/g, "_");
    cb(null, `video-${uniqueSuffix}-${cleanFileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/mkv",
    "video/quicktime",
    "video/webm",
    "video/x-matroska",
  ];
  if (allowedMimeTypes.includes(FileReader.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only video files (MP4,MKV,MOV,WebM) are allowed",
      ),
      false,
    );
  }
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
});
