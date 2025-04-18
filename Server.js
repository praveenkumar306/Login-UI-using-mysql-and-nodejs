const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'my_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// REGISTER API
app.post('/register', async (req, res) => {
    const { email, password, mobileNumber } = req.body;

    try {
        // Check if email already exists
        const [existing] = await promisePool.execute('SELECT * FROM login_users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const regDate = new Date();
        await promisePool.execute(
            'INSERT INTO login_users (email, password, mobileNumber, regDate) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, mobileNumber, regDate]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in /register:', error); // Important!
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// LOGIN API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await promisePool.execute('SELECT * FROM login_users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
