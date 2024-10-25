import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

//login user
router.post("/login", authController.loginUser);

export const authRoute = router;
