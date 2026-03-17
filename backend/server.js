const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const bcrypt = require('bcrypt'); 


const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // Put your password here
    database: 'task_manager'
});


app.post('/api/register', async (req, res) => {
    try {
      
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
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

       
        const sql = "SELECT * FROM users WHERE email = ?;
        const [rows] = await db.execute(sql, [email]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
});


app.get('/api/tasks/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

      
        const sql = "SELECT * FROM tasks WHERE user_id = ?";
        const [rows] = await db.execute(sql, [userId]);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching tasks" });
    }
});


app.post('/api/tasks', async (req, res) => {
    try {
        const { user_id, title } = req.body;

        
        if (!user_id || !title) {
            return res.status(400).json({ message: "Please provide user_id and title" });
        }

    
        const sql = "INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, ?)";
        await db.execute(sql, [user_id, title, false]);

        // Success!
        res.status(201).json({ message: "Task added successfully" });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error adding task" });
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (completed === undefined) {
            return res.status(400).json({ message: "Completed status is required" });
        }

        const sql = "UPDATE tasks SET completed = ? WHERE id = ?";

        const [result] = await db.execute(sql, [completed ? 1 : 0, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error updating task" });
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM tasks WHERE id = ?";

        const [result] = await db.execute(sql, [id]);

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
