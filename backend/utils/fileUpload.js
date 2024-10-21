import multer from "multer";
// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;
