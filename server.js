const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔵 Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",               // your MySQL username
    password: "w3irdMark75",  // your MySQL password
    database: "login_system"    // the database you created
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// ✅ Register Route
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(400).json({ error: "User already exists" });
            }
            res.json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Server error" });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid password" });

        res.json({ message: "Login successful" });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});