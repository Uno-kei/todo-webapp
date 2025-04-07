const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // Allow frontend to communicate with backend

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost', // Change if using an external DB
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'todo_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM data', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// Route to add a new task
app.post('/tasks', (req, res) => {
    const { category, tasks } = req.body;
    if (!category || !tasks) {
        return res.status(400).json({ error: 'Category and Task are required' });
    }

    const sql = 'INSERT INTO data (category, tasks) VALUES (?, ?)';
    db.query(sql, [category, tasks], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding task');
        } else {
            res.status(201).json({ id: result.insertId, category, tasks });
        }
    });
});

// Route to update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { category, tasks } = req.body;

    const sql = 'UPDATE data SET category = ?, tasks = ? WHERE id = ?';
    db.query(sql, [category, tasks, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating task');
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM data WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting task');
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
