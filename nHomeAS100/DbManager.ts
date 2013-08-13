/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
var Sequelize = require('sequelize-sqlite').sequelize
var sqlite = require('sequelize-sqlite').sqlite

export module DbManager{
    //var sqlite3 = require('sqlite3').verbose();
    //var db = new sqlite3.Database('db/nhomeasdb.db');

    var sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: 'db/nhomeasdb.db'
    });

    export var User = sequelize.import(__dirname + "/models/User");

    export var Area = sequelize.import(__dirname + "/models/Area");

    export var Favourite = sequelize.import(__dirname + "/models/Favourite");

    export var Device = sequelize.import(__dirname + "/models/Device");

    export function initialize() {
        
        User.hasMany(Favourite, { as: 'Favourites' });
        
        Favourite.sync({ force: true });
        
        Area.hasMany(Device);

        User.sync({ force: true }).success(function () {
            var adminUser = User.build({ userName: 'admin', password: 'admin', firstName: 'Lakshman', lastName: 'Peethani' });
            adminUser.save().success(function () {
                
                console.log('user added successfully');
                
                //User.find({ userName: 'admin' }).success(function (user) {
                //    console.log('result:' + user.firstName);
                //    if (user.comparePassword('admin')) {
                //        console.log('Valid Password for someuser');
                //    }
                //});

            }).error(function (error) {
                    console.log('failed to add user' + error);
            });
        });

        Area.sync({ force: true });

        Device.sync({ force: true });
        
    }
}

//module.exports = DbManager;
exports.DbManager = DbManager;
//DbManager.initialize();
