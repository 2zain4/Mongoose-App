import { Router } from "express";
import * as noteService from "./note.service.js";
const router = Router();
router.post("/create-note", async (req, res) => {
    try {
        const result = await noteService.createNote(
            req.headers.authorization,
            req.body
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.patch("/update-note/:id", async (req, res) => {
    try {
        const result = await noteService.updateNote(
            req.headers.authorization,
            req.params.id,
            req.body
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.put("/replace-note/:id", async (req, res) => {
    try {
        const result = await noteService.replaceNote(
            req.headers.authorization,
            req.params.id,
            req.body
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.patch("/update-all-titles", async (req, res) => {
    try {
        const result = await noteService.updateAllTitles(
            req.headers.authorization,
            req.body.title
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.delete("/delete-note/:id", async (req, res) => {
    try {
        const result = await noteService.deleteNote(
            req.headers.authorization,
            req.params.id
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.get("/paginate-sort", async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const result = await noteService.paginateNotes(
            req.headers.authorization,
            Number(page),
            Number(limit)
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.get("/note-with-user", async (req, res) => {
    try {
        const result = await noteService.notesWithUser(req.headers.authorization);
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.get("/aggregate", async (req, res) => {
    try {
        const result = await noteService.aggregateNotes(
            req.headers.authorization,
            req.query.title
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
router.delete("/delete-all-notes", async (req, res) => {
    try {
        const result = await noteService.deleteAllNotes(
            req.headers.authorization
        );
        res.json(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
export default router;