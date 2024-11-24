module.exports = (sequelize, DataTypes) => {
    const Day = sequelize.define('Day', {
        id_day: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        day_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 31
            }
        },
        promotion_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        promotion_description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Day;
};
