var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require("./models/users");
var passport = require('passport');
var auth = require("./config/auth");
var json2xls = require('json2xls');
var LocalStrategy           = require("passport-local").Strategy;
var GoogleStrategy          = require('passport-google-oauth20');
var flash                   = require("connect-flash");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reportsRouter = require('./routes/reports');
var reports = require('./models/reports');
var mongoose = require("mongoose");
var middleware = require("./middleware/index");
var functions = require('./middleware/functions');
mongoose.connect("mongodb://localhost:27017/mylan", { useNewUrlParser: true });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cors());
app.use(flash());
app.use(json2xls.middleware);
app.use(logger('dev'));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(require("express-session")({
    secret: 'Bingo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.use(
    new GoogleStrategy({
        clientID:auth.googleAuth.clientID,
        clientSecret:auth.googleAuth.clientSecret,
        callbackURL:auth.googleAuth.callbackURL
    },(accessToken, refreshToken, profile, done)=>{
        process.nextTick(function() {
            User.findOne({"email": profile.emails[0].value}, function(err, founduser){
                if (err) {
                    return done(err);
                } else {
                    if (founduser) {
                        return done(null, founduser);
                    } else {
                        User.findOne({ 'googleUserId' : profile.id }, function(err, user) {
                            if (err)
                                return done(err);
                            if (user) {
                                // if a user is found, log them in
                                return done(null, user);
                            } else {
                                // if the user isnt in our database, create a new user
                                var newUser = new User();
                                // set all of the relevant information
                                newUser.googleUserId    = profile.id;
                                newUser.name  = profile.displayName;
                                newUser.email = profile.emails[0].value; // pull the first email
                                newUser.username = profile.emails[0].value;
                                newUser.state = "none";
                                newUser.phone = 0;
                                // save the user

                                User.create(new User(newUser), function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                }
            });
            // try to find the user based on their google id
        });
    })
);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
    } else {
        res.locals.currentUser = "";
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
    }
    next();
});

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', reportsRouter);

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (err) {
      console.log(err);
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/auth/google', passport.authenticate('google',{
    scope:[
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

app.post('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin == true) {
            res.redirect("/dashboard");
        } else {
            res.redirect("/users/show");
        }
    } else {
        req.body.user['email'] = req.body['username'];
        req.body.user['username'] = req.body['username'];
        req.body.user['active'] = true;
        var u = new User(req.body.user);
        User.register(new User(u), req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                return null;
            }
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Succesfully signed up!");
                res.redirect('/dashboard');
            });
        });
    }
});

app.post('/login', passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
});

app.get("/reports/download", middleware.isAdmin, function(req, res){
    reports.find({}).lean().exec(function(err, foundReports){
        if (err) {
            console.log(err);
            res.redirect("/reports");
        } else {
            if (functions.isEmpty(foundReports)) {
                res.redirect("/reports");
            } else {
                res.xls('Reports.xls', foundReports);
            }
        }
    });
});

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/dashboard');
    // res.send("Poop!");
});

module.exports = app;
