import { Router } from "express";
import {
    signup,
    login,
    getLoggedInUser,
    updateUser,
    deleteUser
} from "./user.service.js";
const router = Router();
router.post("/signup", async (req, res) => {
    try {
        const result = await signup(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get("/logged-user", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const result = await getLoggedInUser(token);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.patch("/update-user", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const result = await updateUser(token, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete("/delete-user", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const result = await deleteUser(token);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
export default router;
