import express, { Router, urlencoded } from "express";
import cors from 'cors'
import userRouter from "./routes/user.routes";
import storeRouter from "./routes/store.routes.js"
import foodItemRouter from "./routes/fooditem.routes.js"
import cookieParser from "cookie-parser";
import validateId from "./Middlewares/validateId.middleware.js";
const app = express();

app.use(cors({ origin: '*' }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

app.param("storeId", validateId);


app.use("/.netlify/functions/api/v1/user", userRouter);
app.use("/.netlify/functions/api/v1/store", storeRouter); // test stores owenership
app.use("/.netlify/functions/api/v1/store/:storeId/items", foodItemRouter);


export default app;