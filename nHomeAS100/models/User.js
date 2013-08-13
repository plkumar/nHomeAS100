﻿// The model definition is done in /path/to/models/project.js
// As you might notice, the DataTypes are the very same as explained above
var bcrypt = require('bcrypt-nodejs');

var SALT_WORK_FACTOR = 10;

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userName: { type: DataTypes.STRING },
        password: {
            type: DataTypes.STRING, get: function () {
                return this.getDataValue('password');
            }, set: function (value) {
                var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
                var hash = bcrypt.hashSync(value, salt);
                console.log('in setter:' + value + ' hash: ' + hash);
                //this.password = hash;
                return this.setDataValue('password', hash);
            }
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING
    }, {
        instanceMethods: {
            comparePassword: function (candidatePassword) {
                //console.log('Comparing Password : ' + candidatePassword);
                //console.log('with : ' + this.password);
                return bcrypt.compareSync(candidatePassword, this.password);
            },
            generateRandomToken : function () {
                var user = this,
                    chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
                    token = new Date().getTime() + '_';
                for ( var x = 0; x < 16; x++ ) {
                    var i = Math.floor( Math.random() * 62 );
                    token += chars.charAt( i );
                }
                return token;
            }
        }
    });

    return User;
}



