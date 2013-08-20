/// <reference path="../../DefinitelyTyped/node/node.d.ts" />
/// <reference path="../../DefinitelyTyped/express/express.d.ts" />
//import express = module("express");
import ow = module("OneWire");
var express = require("express");
var engine = require('ejs-locals');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

import db = module("DbManager");

function findByUsername(username, fn) {

    db.DbManager.User.find({ where : { userName: username } }).success(function (founduser) {
        //console.log('Found User ::' + founduser.firstName);
        return fn(null, founduser);
    }).error(function (error) {
        console.log('Error::' + error);
        return fn(error, null);
    });
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    console.log('Serializing user:' + user.firstName);
    //done(null, user.id);
    var createAccessToken = function () {

        var token = user.generateRandomToken();

        db.DbManager.User.find({ where: { accessToken: token } }).success(
            function (existingUser) {
                if (existingUser) {
                    console.log('One Match found ');
                    if (existingUser) {
                        createAccessToken(); // Run the function again - the token has to be unique!
                    }

                } else
                {
                    user.accessToken = token;
                    user.save().success(function (user) {
                        return done(null, user.accessToken);
                    }).error(function (err) {
                            return done(err);
                    });
                }
            }).error(function (err) {
                //user.set('accessToken', token);
                console.log("Error" + err);
            });
    }

    if (user.id) {
        createAccessToken();
    }
});


passport.deserializeUser(function (id, done) {
    //console.log('Deserializing user:' + id );
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


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function (err, user) {
                //console.log('Authenticating User');
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                //if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                if (!user.comparePassword(password)) {
                    return done(null, false, { message: 'Invalid password' });
                } else {
                    console.log('Authentication Successful');
                }
                return done(null, user);
            })
    });
    }
));


var app = express();
// all environments
app.set('port', process.env.PORT || 8080);
app.engine("ejs",engine)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//cookie password - nhomeas100 base64 encoded
app.use(express.cookieParser('bnplbi1uaG9tZWFzMTAw'));
app.use(express.session({ secret: 'bnplbi1uaG9tZWFzMTAw' }));

// Remember Me middleware
app.use(function (req, res, next) {
    if (req.method == 'POST' && req.url == '/login') {
        if (req.body.rememberme) {
            req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
        } else {
            req.session.cookie.expires = false;
        }
    }
    next();
});

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.set('title', 'nHomeAS100');

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/devices', routes.devices);
app.get('/devices:id', routes.devices);

//app.get('/users', user.list);

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', { title: 'Account', user: req.user, message: req.flash('error') });
});

app.get('/login', function (req, res) {
    res.render('login', { title: 'Login', user: req.user, message: req.flash('error') });
});


// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function (req, res) {
        console.log('Login Successful');
        res.redirect('/');
    });

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}


//var onewire = ow.OneWire;

//var deviceManager = onewire.DeviceManager.getInstance();

//var result = deviceManager.getDevices("/mnt/owfs", {});

//for (var index in result)
//{
//    console.log(result[index].renderControl());
//}
