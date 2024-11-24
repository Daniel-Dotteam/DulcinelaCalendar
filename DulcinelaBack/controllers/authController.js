const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const login = async (req, res) => {
    const { email, parola } = req.body;
    try {
        const user = await db.user.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(401).json({ message: 'Email sau parola incorecte.' });
        }

        const isPasswordValid = await bcrypt.compare(parola, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email sau parola incorecte.' });
        }

        const accessToken = jwt.sign(
            { id: user.id_user, email: user.Email, firstname: user.name, lastname: user.last_name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            access_token: accessToken,
            user: {
                email: user.Email,
                firstname: user.name,
                lastname: user.last_name
            }
        });
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        res.status(500).json({ message: 'Eroare la autentificare.' });
    }
};

module.exports = {
    login,
};
