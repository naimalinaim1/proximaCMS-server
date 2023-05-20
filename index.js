import express from "express";
import cors from "cors";

// app info
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// listen port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
