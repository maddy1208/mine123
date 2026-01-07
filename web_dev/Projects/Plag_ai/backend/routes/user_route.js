import express from "express";
import {
  login_user,
  logout,
  password_reset,
  register_user,
} from "../controllers/user_controller.js";

const user_router = express.Router();

user_router.route("/register").post(register_user);
user_router.route("/login").post(login_user);
user_router.route("/logout").get(logout);
user_router.route("/password/forget").post(password_reset);

export default user_router;
