// The model definition is done in /path/to/models/project.js
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
                //console.log("Value :" + value + "   " + bcrypt.getRounds(value));
                if (bcrypt.getRounds(value) == NaN) {
                    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
                    var hash = bcrypt.hashSync(value, salt);
                    console.log('In setter:' + value + ' hash: ' + hash);
                    return this.setDataValue('password', hash);
                } else {
                    return this.setDataValue('password', value);
                }
            }
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        accessToken: DataTypes.STRING
    }, {
        instanceMethods: {
            comparePassword: function (candidatePassword) {
                console.log('Comparing Password : ' + candidatePassword);
                console.log('with hash: ' + this.password);
                var result = bcrypt.compareSync(candidatePassword, this.password)
                console.log('Password comparision result :' + result);
                return result;
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



