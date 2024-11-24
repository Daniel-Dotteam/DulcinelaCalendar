const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.User;
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(409).json({ message: 'Email deja folosit de catre un utilizator' });
        }

        const password = req.body.password.trim();
        console.log('Registration - Original password:', password);
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Registration - Hashed password:', hashedPassword);

        let info = {
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email.trim().toLowerCase(),
            number: req.body.number,
            password: hashedPassword,
            birth_date: req.body.birth_date
        };

        const user = await User.create(info);
        console.log('User created successfully:', {
            id: user.id_user,
            email: user.email,
            hashedPassword: user.password
        });

        res.status(200).send({
            id: user.id_user,
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            number: user.number,
            birth_date: user.birth_date
        });
    } catch (error) {
        console.error('Eroare la inregistrarea utilizatorului:', error);
        res.status(500).json({ message: 'Eroare la inregistrarea utilizatorului', error: error.message });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password.trim();
        
        console.log('Login attempt - Email:', email);
        console.log('Login attempt - Password:', password);

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: `Utilizatorul cu emailul ${email} nu a fost gasit` });
        }

        console.log('Found user:', {
            id: user.id_user,
            email: user.email,
            storedHash: user.password
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Parola incorecta' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set!');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign(
            { 
                id: user.id_user, 
                email: user.email,
                name: user.name,
                last_name: user.last_name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Autentificat cu succes!',
            access_token: token,
            user: {
                id: user.id_user,
                email: user.email,
                name: user.name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Eroare la autentificare', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        let email = req.params.email;
        let user = await User.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'lastName', 'email', 'number', 'birthDate']
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul cu acest email nu a fost gasit.' });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error('Eroare la gasirea utilizatorului: ', error);
        res.status(500).json({ message: 'Eroare la gasirea utilizatorului:', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.user.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la obtinerea utilizatorilor' });
    }
};


module.exports = {
    addUser,
    authenticateUser,
    getUser,
    getAllUsers
};
