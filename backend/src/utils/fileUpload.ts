import path from 'path';

export const validateFileType = (file: Express.Multer.File, cb: Function) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only PDF and Word documents are allowed!');
  }
};