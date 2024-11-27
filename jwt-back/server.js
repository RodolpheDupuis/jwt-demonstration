const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Secret key for JWT
const SECRET_KEY = 'your-secret-key';

// Mock user database
const users = [
    { id: 1, email: 'user@user.com', password: bcrypt.hashSync('aw3$0m3AndHaRdPwD!', 10), role: 'user' },
    { id: 2, email: 'admin@admin.com', password: bcrypt.hashSync('aw3$0m3AndHaRdPwDButAdm1n!', 10), role: 'admin' },
];

function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
}

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Set as httpOnly cookie
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in successfully' });
});

app.get('/api/protected', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Welcome to the protected route!', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
});

// Example: Admin-only route
app.get('/api/admin', authorizeRoles(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});