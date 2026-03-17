import userModel from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
const SECRET_KEY = "secretKey";
const ENC_KEY = "phoneEncryptKey";
export const signup = async (userData) => {
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    userData.password = await bcrypt.hash(userData.password, 10);

    userData.phone = CryptoJS.AES.encrypt(
        userData.phone,
        ENC_KEY
    ).toString();
    const user = await userModel.create(userData);
    return { message: "User created successfully" };
};
export const login = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Invalid email or password");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");
    const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
    return { message: "Login successful", token };
};
export const getLoggedInUser = async (token) => {
    const authHeader = token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid token");
    }
    const realToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(realToken, SECRET_KEY);
        const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
};
export const updateUser = async (token, userData) => {
    const authHeader = token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid token");
    }
    const realToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(realToken, SECRET_KEY);
        if (userData.email) {
        const emailExists = await userModel.findOne({ email: userData.email });
        if (emailExists && emailExists._id.toString() !== decoded.userId) {
            throw new Error("Email already exists");
        }
    }
    delete userData.password;
    const user = await userModel.findByIdAndUpdate(
        decoded.userId,
        userData,
        { new: true }
    );
    return { message: "User updated successfully", user };
};
export const deleteUser = async (token) => {
    const authHeader = token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid token");
        }
    const realToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(realToken, SECRET_KEY);
        await userModel.findByIdAndDelete(decoded.userId);
    return { message: "User deleted successfully" };
};