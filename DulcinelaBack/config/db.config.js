module.exports = {
    host: 'dotteam.mysql.tools',
    user: 'dotteam_dulcinela',
    password: '8@us3bRA5-',
    database: 'dotteam_dulcinela',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },

}
