const express= require("express");
import { Request, Response } from "express";  
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());
app.get("/miko", (req: Request, res: Response) => {
  res.send("hiiee");
});

app.listen(4082, () => {
  console.log("Server is running on port 4081");
});