import express from "express";
import { databaseConnection } from "./database/connection.js";
import userRoutes from "./modules/users/user.controller.js";
import noteRoutes from "./modules/notes/note.controller.js";
export const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  await databaseConnection();
  app.use("/users", userRoutes);
  app.use("/notes", noteRoutes);
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
};
