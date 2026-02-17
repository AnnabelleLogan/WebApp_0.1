const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Serve your CSS/images
app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "w3irdMark75",
    database: "login_system",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL!");
});

// Serve HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Registration.html"));
});

// Handle registration
app.post("/register", (req, res) => {
    console.log("Register route hit");
    console.log("Data received:", req.body);

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("User inserted successfully");
        return res.json({ message: "Registration successful!" });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});