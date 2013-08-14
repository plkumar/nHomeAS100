var fs = require("fs");

module.exports = function (sequelize, DataTypes) {

    var Device = sequelize.define('Device', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        DeviceId: { type: DataTypes.STRING(16), allowNull: false },
        Name: { type: DataTypes.STRING, allowNull: false },
        Family: { type: DataTypes.STRING(2), allowNull: false },
        CRC: { type: DataTypes.STRING(5), allowNull: false },
        Address: { type: DataTypes.STRING(16), allowNull: false },
        Type: { type: DataTypes.STRING(12), allowNull: false },
        Alias: { type: DataTypes.STRING, allowNull: false },
        DevicePath: { type: DataTypes.STRING, allowNull: false },
        New: { type: DataTypes.BOOLEAN }
    }, {
        instanceMethods: {
            toString: function () {
                //console.log('Device : ' + this.Name);
                return this.Name;
            }
        },
        classMethods: {
            loadFromPath: function (path) {
                var _devicepath=path;
                return Device.build({
                    //DeviceId: fs.readFileSync(this._devicepath + "/id", 'ascii'),
                    Name: _devicepath,
                    //Family: fs.readFileSync(this._devicepath + "/family", 'ascii'),
                    //CRC: fs.readFileSync(this._devicepath + "/crc8", 'ascii'),
                    //Address: fs.readFileSync(this._devicepath + "/address", 'ascii'),
                    //Type: fs.readFileSync(this._devicepath + "/type", 'ascii'),
                    //Alias: fs.readFileSync(this._devicepath + "/alias", 'ascii'),
                    DevicePath : _devicepath
                });
            }
        }
    });

    return Device;
}
