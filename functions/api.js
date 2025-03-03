import express, { Router } from "express";

const serverless = require("serverless-http");

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/.netlify/functions/api", router);

export const handler = serverless(api);