
var express = require("express");
var engine = require('ejs-locals');
var routes = require('./routes');

var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
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
            if (user.password != password) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        });
    });
}));

var app = express();

app.set('port', process.env.PORT || 3000);
app.engine("ejs", engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('bnplbi1uaG9tZWFzMTAw'));
app.use(express.session({ secret: 'bnplbi1uaG9tZWFzMTAw' }));

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

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', { user: req.user });
});

app.get('/login', function (req, res) {
    res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function (req, res) {
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

