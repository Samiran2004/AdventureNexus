import multer from "multer";
import path from "path";

export const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 1e7 }  //30mb:  30*1024*1024
});