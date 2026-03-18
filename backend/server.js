require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const JWT_SECRET = process.env.JWT_SECRET;

//JWT AUTH MIDDLEWARE

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Token required." });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.id;

        next();

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token." });
        }

        return res.status(500).json({ message: "Authentication error." });
    }
};


app.post('/api/register', async (req, res) => {
    try {
      
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const checkUser = "SELECT id FROM users WHERE email = ?";
        const [existing] = await db.execute(checkUser, [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        
        
        await db.execute(sql, [name, email, hashedPassword]);

        
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: "Server error during registration" });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

       
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.execute(sql, [email]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // CREATE JWT TOKEN 
        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            id: user.id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
});


app.get('/api/tasks', verifyToken, async (req, res) => {
    try {
      
        const sql = "SELECT * FROM tasks WHERE user_id = ?";
        const [rows] = await db.execute(sql, [req.userId]);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching tasks" });
    }
});


app.post('/api/tasks', verifyToken, async (req, res) => {
    try {
        const { title } = req.body;

        
        if (!title) {
            return res.status(400).json({ message: "Please provide title" });
        }

    
        const sql = "INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?)";
        await db.execute(sql, [req.userId, title, false]);

        // Success!
        res.status(201).json({ message: "Task added successfully" });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error adding task" });
    }
});


app.put('/api/tasks/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (completed === undefined) {
            return res.status(400).json({ message: "Completed status is required" });
        }

        const sql = "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?";

        const [result] = await db.execute(sql, [completed ? 1 : 0, id, req.userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error updating task" });
    }
});


app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

        const [result] = await db.execute(sql, [id, req.userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error deleting task" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});