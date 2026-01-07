import express from "express";

import user_router from "./routes/user_route.js";
import CookieParser from "cookie-parser";
import { error_middleware } from "./middlewares/error_middleware.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.use("/api/v1/user", user_router);
app.use(error_middleware);

export { app };
