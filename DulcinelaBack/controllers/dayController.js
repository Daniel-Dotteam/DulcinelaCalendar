const db = require('../models');
const Day = db.Day;

const addDay = async (req, res) => {
    try {
        const { name, date } = req.body;

        const existingDay = await Day.findOne({ where: { date } });
        if (existingDay) {
            return res.status(409).json({ message: 'Ziua cu aceasta data exista deja.' });
        }

        const day = await Day.create({ name, date });

        res.status(200).send(day);
        console.log('Zi adaugata:', day);
    } catch (error) {
        console.error('Eroare la adaugarea zilei:', error);
        res.status(500).json({ message: 'Eroare la adaugarea zilei', error: error.message });
    }
};

const getDay = async (req, res) => {
    try {
        const { date } = req.params;

        const day = await Day.findOne({ where: { date } });

        if (!day) {
            return res.status(404).json({ message: 'Ziua cu aceasta data nu a fost gasita.' });
        }

        res.status(200).send(day);
    } catch (error) {
        console.error('Eroare la gasirea zilei:', error);
        res.status(500).json({ message: 'Eroare la gasirea zilei:', error: error.message });
    }
};

const updateDay = async (req, res) => {
    try {
        const { date } = req.params;
        const updateData = req.body;

        const day = await Day.update(updateData, { where: { date } });

        if (day[0] === 0) {
            return res.status(404).json({ message: 'Ziua cu aceasta data nu a fost gasita.' });
        }

        res.status(200).send({ message: 'Zi actualizata cu succes!' });
    } catch (error) {
        console.error('Eroare la actualizarea zilei:', error);
        res.status(500).json({ message: 'Eroare la actualizarea zilei:', error: error.message });
    }
};

const getAllDays = async (req, res) => {
    try {
        const days = await Day.findAll();

        if (days.length === 0) {
            return res.status(404).json({ message: 'Nu exista zile înregistrate.' });
        }

        res.status(200).send(days);
    } catch (error) {
        console.error('Eroare la preluarea zilelor:', error);
        res.status(500).json({ message: 'Eroare la preluarea zilelor', error: error.message });
    }
};


module.exports = {
    addDay,
    getDay,
    updateDay,
    getAllDays
};
