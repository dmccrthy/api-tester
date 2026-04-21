/**
 * A example REST API written with Express.js. Provides endpoints
 * that accept GET, POST, PUT, etc. for testing the actually app.
 *
 * @author Dan McCarthy
 */

import express from "express";

const app = express();
const PORT = 9000;

// app.get("/api", (req, res) => {

// })

// app.post("/api", (req, res) => {

// })

app.listen(PORT, () => {
  console.log(`Running on PORT=${PORT}`);
});
