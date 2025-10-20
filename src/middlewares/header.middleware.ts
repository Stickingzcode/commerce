import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/error.util";

const validateChannels = async (req: Request, res: Response, next: NextFunction) => {
    const APP_CHANNELS = process.env.APP_CHANNELS || '';
    const LG = req.headers.lg?.toString().trim().toLowerCase();
    const CH = req.headers.ch?.toString().trim().toLowerCase();

    if(!APP_CHANNELS) {
        return next(new ErrorResponse('security violation', 500, ['invalid app channels, contact support']));
    }
    if(!LG) {
        return next(new ErrorResponse('security violation', 403, ['no language specified']));
    }
    if(!CH) {
        return next(new ErrorResponse('security violation', 403, ['no channel specified']));
    }
    
    const channels = APP_CHANNELS.split(',');
    if(!channels.includes(CH)) {
        return next(new ErrorResponse('security violation', 403, ['invalid channel']));
    }
    req.channel = CH;
    req.language = LG;

    await console.log('HEADERS', req.headers);

    return next();

}

export { validateChannels };