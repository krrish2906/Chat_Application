import upload from "../config/multerConfig.js";

export const singleUploader = upload.single('image');
export const multiUploader = upload.array('images');