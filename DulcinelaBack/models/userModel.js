module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        number: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return User;
};
