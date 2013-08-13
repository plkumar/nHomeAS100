module.exports = function (sequelize, DataTypes) {

    var Device = sequelize.define('Device', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING }
    });

    return Device;
}