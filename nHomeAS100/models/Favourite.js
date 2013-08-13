module.exports = function (sequelize, DataTypes) {

    var Favourite = sequelize.define('Favourite', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING }
    });

    return Favourite;
}