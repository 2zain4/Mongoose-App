import jwt from "jsonwebtoken";
const SECRET_KEY = "secretKey";
export const getUserIdFromToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid token");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
};