const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2005',
    database: 'database_management'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
// Get all records
app.get('/api/records', (req, res) => {
    const sql = "SELECT * FROM records";
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching records" });
        }
        res.json(result);
    });
});

// Add new record
app.post('/api/records', (req, res) => {
    const { name, email, phone } = req.body;
    const sql = "INSERT INTO records (name, email, phone) VALUES (?, ?, ?)";
    db.query(sql, [name, email, phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error adding record" });
        }
        res.json({ id: result.insertId, message: "Record added successfully" });
    });
});
// Update record
app.put('/api/records/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const sql = "UPDATE records SET name=?, email=?, phone=? WHERE id=?";
    db.query(sql, [name, email, phone, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error updating record" });
        }
        res.json({ message: "Record updated successfully" });
    });
});

// Delete record
app.delete('/api/records/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM records WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting record" });
        }
        res.json({ message: "Record deleted successfully" });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
