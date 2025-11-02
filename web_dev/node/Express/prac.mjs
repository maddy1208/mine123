// express=require('express')
// const path=require('path')
// const app=express()

// app.get("/",(req,res,next)=>{
// res.sendFile(path.join(__dirname,'package.json'));next()},
// (req1,res1,next1)=>{
//     console.log("function1 exec");next1()
// },(req1,res1)=>{
//     console.log("function2 exec")
// },
// ).listen('5000')

// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const INFO_FILE = path.join(process.cwd(), "info"); // file named "info" in project root

app.use(express.static("public")); // serves index.html from ./public

// Endpoint that the page calls; server will fetch https://myspi and append result to file
app.get("/", async (req, res) => {
  try {
    // Use global fetch (Node 18+) or fallback to node-fetch if needed
    const response = await fetch("https://api.woox.io/usercenter/account/v2/ip_info", {
      // you can add headers here if required, e.g. { "User-Agent": "MyAgent" }
      // mode and credentials don't apply to server-side fetch
    });

    const text = await response.text();

    // Try to parse JSON, but keep raw text if parsing fails
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = { parseError: true, raw: text };
    }

    // Prepare log entry: include timestamp and the fetched content
    const logEntry = {
      loggedAt: new Date().toISOString(),
      status: response.status,
      body: parsed
    };

    // Append to file as a single line (JSON) plus newline so every visit is preserved
    fs.appendFile(INFO_FILE, JSON.stringify(logEntry) + "\n", (err) => {
      if (err) {
        console.error("Failed to append to info file:", err);
      }

      // We respond to the client anyway
      res.setHeader("Content-Type", "application/json");
      res.status(200).sendFile(path.join("/home/maddy/techiee/web_dev/node/Express/sam.html"))
    });


  } catch (err) {
    console.error("Error fetching https://myspi:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
