// middlewares/isAuth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function isAuth(req, res, next) {
  try {
    // procura o token no header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("📌 Token recebido:", token);
    // verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // busca o usuário no banco (sem senha)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // injeta usuário no req
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
