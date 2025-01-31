import { 
  Request, 
  Response, 
  NextFunction 
} from "express";

import { ApiError } from "../errors/api-error";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();

  if (err instanceof ApiError) {
    return res.status(400).json({
      code: err.code,
      message: err.message,
      details: err.details,
      timestamp,
    });
  }

  // fallback for unexpected errors
  console.error(err); // log for debugging
  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
    timestamp,
  });
}
