import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
   destination(req, file, callback) {
      fs.mkdir("./uploads/", (err) => {
         callback(null, "./uploads/");
      });
   },
   filename(req, file, callback) {
      const id = uuid();
      const extName = file.originalname.split(".").pop();
      callback(null, `${id}.${extName}`);
   },
});

export const singleUpload = multer({ storage }).single("photo");
