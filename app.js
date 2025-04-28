import express, { urlencoded } from "express";
import cors from 'cors'
import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js"
import foodItemRouter from "./routes/fooditem.routes.js"
import cookieParser from "cookie-parser";
import validateId from "./Middlewares/validateId.middleware.js";
import dotenv from "dotenv";
import cloudinary from 'cloudinary'

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());


app.param("storeId", validateId);
app.get("/", (req, res) => {
    res.send("App is running");
})

app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter); // test stores owenership
app.use("/api/v1/store/:storeId/items", foodItemRouter);


export default app;