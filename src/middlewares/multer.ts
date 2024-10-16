import multer, { StorageEngine } from 'multer';

const storage: StorageEngine = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;
