var Sequelize = require('sequelize-sqlite').sequelize;
var sqlite = require('sequelize-sqlite').sqlite;

(function (DbManager) {
    function initialize() {
        var sequelize = new Sequelize('database', 'username', 'password', {
            dialect: 'sqlite',
            storage: 'db/nhomeasdb.db'
        });

        var User = sequelize.import(__dirname + "/models/User");

        var Area = sequelize.import(__dirname + "/models/Area");

        var Favourite = sequelize.import(__dirname + "/models/Favourite");

        User.hasMany(Favourite, { as: 'Favourites' });

        var Device = sequelize.import(__dirname + "/models/Device");

        Favourite.sync({ force: true });

        Area.hasMany(Device);

        User.sync({ force: true }).success(function () {
            var adminUser = User.build({ userName: 'admin', password: 'admin', firstName: 'Lakshman', lastName: 'Peethani' });
            adminUser.save().success(function () {
                console.log('user added successfully');
            }).error(function (error) {
                console.log('failed to add user' + error);
            });
        });

        Area.sync({ force: true });

        Device.sync({ force: true });
    }
    DbManager.initialize = initialize;
})(exports.DbManager || (exports.DbManager = {}));
var DbManager = exports.DbManager;

exports.DbManager = DbManager;

DbManager.initialize();

