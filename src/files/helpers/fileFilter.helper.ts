import { Logger } from "@nestjs/common";
import { Request } from "express";


export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {

    const logger = new Logger("fileFilter");

    if (!file) return callback(new Error("File is empty"), false);

    const fileExtension = file.mimetype.split("/")[1];
    const validExtensions = ["jpg", "jpeg", "png", "gif", "pdf"];

    if (!validExtensions.includes(fileExtension)) {
        return callback(logger.error("Invalid file type. Only JPG, JPEG, PNG, PDF, GIF are allowed"), false);
    }

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true);
    }

    callback(null, true);

}