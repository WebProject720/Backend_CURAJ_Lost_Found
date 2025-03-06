import multer from "multer";
// Configure storage
const storage = multer.memoryStorage(); // or use diskStorage if needed
const upload = multer({ storage });

export {upload};
