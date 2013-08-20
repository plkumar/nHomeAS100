
var express = require("express");
var engine = require('ejs-locals');
var routes = require('./routes');

var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

var db = require("./DbManager");

function findByUsername(username, fn) {
    db.DbManager.User.find({ where: { userName: username } }).success(function (founduser) {
        return fn(null, founduser);
    }).error(function (error) {
        console.log('Error::' + error);
        return fn(error, null);
    });
}

passport.serializeUser(function (user, done) {
    console.log('Serializing user:' + user.firstName);

    var createAccessToken = function () {
        var token = user.generateRandomToken();

        db.DbManager.User.find({ where: { accessToken: token } }).success(function (existingUser) {
            if (existingUser) {
                console.log('One Match found ');
                if (existingUser) {
                    createAccessToken();
                }
            } else {
                user.accessToken = token;
                user.save().success(function (user) {
                    return done(null, user.accessToken);
                }).error(function (err) {
                    return done(err);
                });
            }
        }).error(function (err) {
            console.log("Error" + err);
        });
    };

    if (user.id) {
        createAccessToken();
    }
});

passport.deserializeUser(function (id, done) {
    db.DbManager.User.find({ where: { accessToken: id } }).success(function (user) {
        if (user) {
            console.log('Found : ' + user.userName);
            done(null, user);
        } else {
            console.log('no matching user.');
            done(null, null);
        }
    }).error(function (error) {
        done(error, null);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
    process.nextTick(function () {
        findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Unknown user ' + username });
            }

            if (!user.comparePassword(password)) {
                return done(null, false, { message: 'Invalid password' });
            } else {
                console.log('Authentication Successful');
            }
            return done(null, user);
        });
    });
}));

var app = express();

app.set('port', process.env.PORT || 8080);
app.engine("ejs", engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('bnplbi1uaG9tZWFzMTAw'));
app.use(express.session({ secret: 'bnplbi1uaG9tZWFzMTAw' }));

app.use(function (req, res, next) {
    if (req.method == 'POST' && req.url == '/login') {
        if (req.body.rememberme) {
            req.session.cookie.maxAge = 2592000000;
        } else {
            req.session.cookie.expires = false;
        }
    }
    next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.set('title', 'nHomeAS100');

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/devices', routes.devices);
app.get('/devices:id', routes.devices.findById);

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', { title: 'Account', user: req.user, message: req.flash('error') });
});

app.get('/login', function (req, res) {
    res.render('login', { title: 'Login', user: req.user, message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function (req, res) {
    console.log('Login Successful');
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

