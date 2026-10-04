import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function auth(req,res,next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({message:"Authentication required"});
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    return res.status(401).json({message:"Invalid or expired token"});
  }
}
export function allow(...roles) {
  return (req,res,next) => roles.includes(req.user?.role)
    ? next()
    : res.status(403).json({message:"You do not have permission for this action"});
}
