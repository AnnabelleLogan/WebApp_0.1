const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // serve CSS/images

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "w3irdMark75",
  database: "login_system",
  port: 3306
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL!");
});

// Serve the registration page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Registration.html"));
});

// Registration route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "All fields required" });

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      console.log("User inserted successfully");
      res.json({ message: "Registration successful!" });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));
