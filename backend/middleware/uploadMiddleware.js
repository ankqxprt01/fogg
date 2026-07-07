const multer = require("multer");
const path = require("path");


const uploadDir = path.join(__dirname, "../uploads");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for png, jpg, jpeg, pdf, txt
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",  // Added
    "image/jpg",   // Added
    "image/webp",
    "application/pdf",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, JPEG, PDF, TXT files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;