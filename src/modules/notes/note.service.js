import noteModel from "../../database/models/note.model.js";
import { getUserIdFromToken } from "../../utils/auth.js";
export const createNote = async (token, data) => {
    const userId = getUserIdFromToken(token);
    const note = await noteModel.create({ ...data, userId });
    return { message: "Note created", note };
};
export const updateNote = async (token, id, data) => {
    const userId = getUserIdFromToken(token);
    const note = await noteModel.findById(id);
    if (!note) throw new Error("Note not found");
    if (note.userId.toString() !== userId) throw new Error("You are not the owner");
    const updated = await noteModel.findByIdAndUpdate(id, data, { new: true });
    return { message: "Note updated", updated };
};
export const replaceNote = async (token, id, data) => {
    const userId = getUserIdFromToken(token);

    const note = await noteModel.findById(id);
    if (!note) throw new Error("Note not found");
    if (note.userId.toString() !== userId) throw new Error("You are not the owner");
    const replaced = await noteModel.findOneAndReplace(
        { _id: id },
        { ...data, userId },
        { new: true }
    );
    return replaced;
};
export const updateAllTitles = async (token, title) => {
    const userId = getUserIdFromToken(token);
    await noteModel.updateMany({ userId }, { title });
    return { message: "All notes updated" };
};
export const deleteNote = async (token, id) => {
    const userId = getUserIdFromToken(token);
    const note = await noteModel.findById(id);
    if (!note) throw new Error("Note not found");
    if (note.userId.toString() !== userId) throw new Error("You are not the owner");
    await note.deleteOne();
    return { message: "Note deleted" };
};
export const paginateNotes = async (token, page, limit) => {
    const userId = getUserIdFromToken(token);
    const notes = await noteModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return notes;
};
export const getNoteById = async (token, id) => {
    const userId = getUserIdFromToken(token);
    const note = await noteModel.findById(id);
    if (!note) throw new Error("Note not found");
    if (note.userId.toString() !== userId) throw new Error("You are not the owner");
    return note;
};
export const getNoteByContent = async (token, content) => {
    const userId = getUserIdFromToken(token);
    const note = await noteModel.findOne({ userId, content });
    if (!note) throw new Error("No note found");
    return note;
};
export const notesWithUser = async (token) => {
    const userId = getUserIdFromToken(token);
    return noteModel.find({ userId })
        .populate("userId", "email")
        .select("title userId createdAt");
};
export const aggregateNotes = async (token, title) => {
    const userId = getUserIdFromToken(token);
    return noteModel.aggregate([
        { $match: { userId, title: { $regex: title, $options: "i" } } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                title: 1,
                createdAt: 1,
                "user.name": 1,
                "user.email": 1
            }
        }
    ]);
};
export const deleteAllNotes = async (token) => {
    const userId = getUserIdFromToken(token);
    await noteModel.deleteMany({ userId });
    return { message: "Deleted" };
};