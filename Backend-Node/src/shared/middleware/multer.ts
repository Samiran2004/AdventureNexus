import multer from 'multer';
import path from 'path';

/**
 * Multer configuration for file uploads.
 * Files are stored locally in the 'Public/data/uploads' directory.
 */
export const upload = multer({
    // Destination directory for uploaded files
    dest: path.resolve(__dirname, '../../Public/data/uploads'),
    // Limit file size to 10MB (approx)
    limits: { fileSize: 1e7 }, // 10MB
});
