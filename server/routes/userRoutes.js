import express from "express";
import { checkAuth, login, signup } from "../controllers/userController.js";
import { protectRoute } from "../middleWare/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
