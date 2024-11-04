import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create", UserControllers.createUser);
router.get("/", auth(UserRole.ADMIN), UserControllers.getUsers);
router.get("/:id", UserControllers.getSingleUser);
router.patch("/:id", UserControllers.updateUser);
router.delete("/:id", auth(UserRole.ADMIN), UserControllers.deleteUser);

export const userRoutes = router;
