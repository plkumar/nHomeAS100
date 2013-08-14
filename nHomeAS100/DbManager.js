var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

(function (DbManager) {
    var sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: 'db/nhomeasdb.db'
    });

    DbManager.User = sequelize.import(__dirname + "/models/User");

    DbManager.Area = sequelize.import(__dirname + "/models/Area");

    DbManager.Favourite = sequelize.import(__dirname + "/models/Favourite");

    DbManager.Device = sequelize.import(__dirname + "/models/Device");

    function initialize() {
        DbManager.User.hasMany(DbManager.Favourite, { as: 'Favourites' });

        DbManager.Favourite.sync({ force: true });

        DbManager.Area.hasMany(DbManager.Device);

        DbManager.User.sync({ force: true }).success(function () {
            var adminUser = DbManager.User.build({ userName: 'admin', password: 'admin', firstName: 'Lakshman', lastName: 'Peethani' });
            adminUser.save().success(function () {
                console.log('user added successfully');
            }).error(function (error) {
                console.log('failed to add user' + error);
            });

            var guestUser = DbManager.User.build({ userName: 'guest', password: 'guest', firstName: 'Guest', lastName: 'User' });
            guestUser.save();
        });

        DbManager.Area.sync({ force: true });

        DbManager.Device.sync({ force: true });

        DbManager.Device.enumerateDevices('/mnt/owfs');
    }
    DbManager.initialize = initialize;
})(exports.DbManager || (exports.DbManager = {}));
var DbManager = exports.DbManager;

exports.DbManager = DbManager;
DbManager.initialize();

