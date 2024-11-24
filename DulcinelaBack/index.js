require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const allowedCors = [
    'http://localhost:3000',
    'http://localhost:3001',
];

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedCors.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// router
const routerUser = require('./routes/userRoutes.js');
const routerDay = require('./routes/dayRoutes.js');

// Rute
app.use('/api/Users', routerUser);
app.use('/api/Day', routerDay);

//testing api
app.get('/', (req, res) => {
    res.json({ message: "hello from Dulcinela" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);
