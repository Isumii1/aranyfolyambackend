const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "products");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const safeBaseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        cb(null, `${Date.now()}-${safeBaseName}${ext}`);
    }
});

function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Csak jpg, jpeg, png vagy webp kép tölthető fel."));
    }

    cb(null, true);
}

const uploadProductImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadProductImage;