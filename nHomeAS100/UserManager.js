(function (UserManager) {
    var User = (function () {
        function User(userid, password, firstName, lastName) {
            this._userId = userid;
        }
        User.prototype.getUserId = function () {
            return this._userId;
        };

        User.prototype.getFirstName = function () {
            return this._userId;
        };

        User.prototype.getLastName = function () {
            return this._lastName;
        };

        User.getUserById = function (userid) {
            return null;
        };
        return User;
    })();
    UserManager.User = User;

    var LoginManager = (function () {
        function LoginManager() {
        }
        LoginManager.prototype.loginUser = function (userId, password) {
            return false;
        };
        return LoginManager;
    })();
    UserManager.LoginManager = LoginManager;
})(exports.UserManager || (exports.UserManager = {}));
var UserManager = exports.UserManager;

