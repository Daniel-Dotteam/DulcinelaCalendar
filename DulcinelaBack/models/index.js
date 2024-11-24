const dbConfig = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        port: dbConfig.port,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./userModel.js')(sequelize, DataTypes);
db.Day = require('./dayModel.js')(sequelize, DataTypes);

db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

module.exports = db;
