module.exports = function (sequelize, DataTypes) {

    var Area = sequelize.define('Area', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING }
    });

    return Area;
}