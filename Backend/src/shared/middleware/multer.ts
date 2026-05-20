import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(__dirname, '../../Public/data/uploads');

// Ensure destination directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Multer configuration for file uploads.
 * Files are stored locally in the 'Public/data/uploads' directory.
 */
export const upload = multer({
    // Destination directory for uploaded files
    dest: uploadDir,
    // Limit file size to 10MB (approx)
    limits: { fileSize: 1e7 }, // 10MB
});
