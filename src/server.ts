require('dotenv').config();
import express from "express";
import { router } from "./routes";
import "reflect-metadata";
import "./database";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log("Running on port: "+ PORT);
});
