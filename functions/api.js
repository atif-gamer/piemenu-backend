import dotenv from "dotenv";
import ServerlessHttp from "serverless-http";
import ConnectDb from "../db/db.js";
import app from "../app.js";

dotenv.config();

let serverHandler;

export const handler = async (event, context) => {
    if (!serverHandler) {

        try {
            await ConnectDb();
            serverHandler = ServerlessHttp(app);
            console.log("Database connected successfully");
        }
        catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Error connecting to database",
                }),
            }
        }
    }

    return serverHandler(event, context);
}