import { Request,Response,NextFunction } from "express";
import config from "config";
const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{
	const statusCode = res.statusCode ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: config.get('NODE_ENV') === "production" ? null : err.stack
	});
};
export {errorHandler}