import { Request } from "express";

const getFullURL = (req: Request)=>{
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`
}

export default getFullURL;