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
app.use(session(
    {
        secret           : "Farpoint Station",
        name             : "gâteau",
        // store            : sessionStore,
        proxy            : true,
        resave           : true,
        saveUninitialized: true
    }
));
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
    city     : String,
    cover    : String
}, {collection: "user"});

/* Model */
var UserModel = mongoose.model("UserModel", UserSchema);

/* ===================== */
/* USER COLLECTION : END */
/* ===================== */

/* ======================== */
/* TRACE COLLECTION : BEGIN */
/* ======================== */

/* Enforce schema */
var TraceSchema = new mongoose.Schema({
    uid : String,
    activity: []
}, {collection: "trace"});

/* Model */
var TraceModel = mongoose.model("TraceModel", TraceSchema);

/* ====================== */
/* TRACE COLLECTION : END */
/* ====================== */

/* ======================= */
/* BOOK COLLECTION : BEGIN */
/* ======================= */

/* Enforce schema */
var BookSchema = new mongoose.Schema({
    uid : String,
    book: []
}, {collection: "book"});

/* Model */
var BookModel = mongoose.model("BookModel", BookSchema);

/* ===================== */
/* BOOK COLLECTION : END */
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
                _id      : user._id,
                username : user.username,
                firstName: user.firstName,
                lastName : user.lastName,
                city     : user.city,
                cover    : user.cover
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
        res.sendStatus(401);
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
                _id      : user._id,
                username : user.username,
                firstName: user.firstName,
                lastName : user.lastName,
                city     : user.city,
                cover    : user.cover
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
        _id       : user._id,
        username : user.username,
        firstName: user.firstName,
        lastName : user.lastName,
        city     : user.city,
        cover    : user.cover
    });
});

/* Sign out */
app.post("/api/logout", function(req, res)
{
    req.logOut();
    res.sendStatus(200);
});
/* POST listeners : END */

/* GET listeners : BEGIN */
app.get("/asciimo", function(req, res)
{
    var link = "http://i.imgur.com/kmbjB.png";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

app.get("/api", function(req, res)
{
    res.send("<body style='font-family: Arial;'><h1>Farpoint</h1><p style='font-size: 18px;'>Console API</p></body>");
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

app.get("/api/user/:id/cover", function(req, res)
{
    UserModel.findOne({_id: req.params.id}, function(err, doc)
    {
        res.send(doc.cover);
    });
});

app.get("/api/user/:id/trace", function(req, res)
{
    TraceModel.findOne({uid: req.params.id}, function(err, doc)
    {
        res.json(doc);
    });
});

app.get("/api/user/:id/books", function(req, res)
{
    BookModel.findOne({uid: req.params.id}, function(err, doc)
    {
        res.json(doc);
    });
});
/* GET listeners : END */

/* PUT listeners : BEGIN */
/* Change cover picture */
app.put("/api/user/:id/cover/:url", function(req, res)
{
    var url = req.params.url.replace("image-", "image/");
    url     = url.replace("-", ".");
    UserModel.update({_id: req.params.id}, {$set: {cover: url}}, function(err, doc)
    {
        res.send(url);
    });
});

/* Add a trace */
app.put("/api/user/:id/trace/:t", function(req, res)
{
    TraceModel.findOne({uid: req.params.id}, function(err, doc)
    {
        if(doc == null)
        {
            trace = new TraceModel({uid: req.params.id, activity: [req.params.t]});
            trace.save(function(err, doc)
            {
                // TODO
            });
        }
        else
        {
            activity = doc.activity;
            activity.push(req.params.t);
            TraceModel.update({uid: req.params.id}, {$set: {activity: activity}}, function(err, doc)
            {
                // TODO
            });
        }
        res.sendStatus(200);
    }); 
});

/* Add a bookmark */
app.put("/api/user/:id/book/:isbn", function(req, res)
{
    BookModel.findOne({uid: req.params.id}, function(err, doc)
    {
        if(doc == null)
        {
            book = new BookModel({uid: req.params.id, book: [req.params.isbn]});
            book.save(function(err, doc)
            {
                // TODO
            });
        }
        else
        {
            book = doc.book;
            book.push(req.params.isbn);
            BookModel.update({uid: req.params.id}, {$set: {book: book}}, function(err, doc)
            {
                // TODO
            });
        }
        res.sendStatus(200);
    });
});
/* PUT listeners : END */

/* DELETE listeners: BEGIN */
/* Remove a bookmark */
app.delete("/api/user/:id/book/:isbn", function(req, res)
{
    BookModel.findOne({uid: req.params.id}, function(err, doc)
    {
        var idx = doc.book.indexOf(req.params.isbn);
        var book = doc.book.splice(idx, 1);
        BookModel.update({uid: req.params.id}, {$set: {book: doc.book}}, function(err, doc)
        {
            res.sendStatus(200);
        });
    });
});
/* DELETE listeners: END */

/* =================== */
/* API LISTENERS : END */
/* =================== */

app.listen(port, ip);
/* End of server.js */