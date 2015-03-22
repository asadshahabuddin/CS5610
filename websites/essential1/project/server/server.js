/*
    Author : Asad Shahabuddin
    File   : server.js
    Details: Configuration script for 'console-farpoint'.
    Email  : asad808@ccs.neu.edu
*/

var express       = require("express");
var bodyParser    = require("body-parser");
var multer        = require("multer");
var passport      = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var cookieParser  = require("cookie-parser");
var session       = require("express-session");
var mongoose      = require("mongoose");
var app           = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "Farpoint Station"}));
app.use(multer());
app.use(passport.initialize());
app.use(passport.session());

/* Set the environment variables we need */
var ip      = process.env.OPENSHIFT_NODEJS_IP      || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT    || 3000;
var connStr = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';

/* Connect to MongoDB instance */
var db = mongoose.connect(connStr);

/* ======================= */
/* USER COLLECTION : BEGIN */
/* ======================= */

/* Enforce schema */
var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    firstName: String,
    lastName : String,
    city     : String
}, {collection: "user"});

/* Model */
var UserModel = mongoose.model("UserModel", UserSchema);

/* ===================== */
/* USER COLLECTION : END */
/* ===================== */

/* Set up passport : BEGIN */
passport.use(new LocalStrategy(
function(username, password, done)
{
    UserModel.findOne({username: username, password: password}, function(err, user)
    {
        if(user)
        {
            return done(null,
            {
                username : user.username,
                firstName: user.firstName,
                lastName : user.lastName,
                city     : user.city
            });
        }
        return done(null, false, {message: "  [error] Unable to login"});
    });
}));

passport.serializeUser(function(user, done)
{
    done(null, user);
});

passport.deserializeUser(function(user, done)
{
    done(null, user);
});

var auth = function(req, res, next)
{
    if(!req.isAuthenticated())
    {
        res.send(401);
    }
    else
    {
        next();
    }
};
/* Set up passport : END */

/* Author */
var author = {
    first : "Asad",
    last  : "Shahabuddin",
    email1: "asad808@ccs.neu.edu",
    email2: "shahabuddin.a@husky.neu.edu",
    url   : "http://net4.ccs.neu.edu/home/asad808/",
    city  : "Boston",
    state : "MA"
};

/* ===================== */
/* API LISTENERS : BEGIN */
/* ===================== */

/* GET listeners : BEGIN */
app.get("/api", function(req, res)
{
    res.send("<body style='font-family: Arial;'><h1>Farpoint</h1><p style='font-size: 18px;'>Console API</p></body>");
});

app.get("/asciimo", function(req, res)
{
    var link = "http://i.imgur.com/kmbjB.png";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

app.get("/api/author", function(req, res)
{
    res.json(author);
});

/* Login status request listener */
app.get("/api/loggedin", function(req, res)
{
    res.send(req.isAuthenticated() ? req.user : '0');
});
/* GET listeners : END */

/* POST listeners : BEGIN */
/* Register a new user */
app.post("/api/register", function(req, res)
{
    var user = new UserModel(req.body);
    user.save(function(err, doc)
    {
        req.login(user, function(err)
        {
            if(err)
            {
                return next(err);
            }
            res.json(
            {
                username : user.username,
                firstName: user.firstName,
                lastName : user.lastName,
                city     : user.city
            });
        });
    });
});

/* Sign in */
app.post("/api/login", passport.authenticate("local"), function(req, res)
{
    var user = req.user;
    res.json(
    {
        username : user.username,
        firstName: user.firstName,
        lastName : user.lastName,
        city     : user.city
    });
});


/* Sign out */
app.post("/api/logout", function(req, res)
{
    req.logout();
    res.send(200);
});
/* POST listeners : END */

/* =================== */
/* API LISTENERS : END */
/* =================== */

app.listen(port, ip);
/* End of server.js */