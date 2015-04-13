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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());
app.use(session(
    {
        secret           : "Farpoint Station"
        /*
        name             : "gâteau",
        // store            : sessionStore,
        proxy            : true,
        resave           : true,
        saveUninitialized: true
        */
    }
));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

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

/* ======================== */
/* MUSIC COLLECTION : BEGIN */
/* ======================== */

/* Enforce schema */
var MusicSchema = new mongoose.Schema({
    uid  : String,
    audio: []
}, {collection: "music"});

/* Model */
var MusicModel = mongoose.model("MusicModel", MusicSchema);

/* ====================== */
/* MUSIC COLLECTION : END */
/* ====================== */

/* ========================= */
/* CIRCLE COLLECTION : BEGIN */
/* ========================= */

/* Enforce schema */
var CircleSchema = new mongoose.Schema({
    uid      : String,
    following: [],
    follower : []
}, {collection: "circle"});

/* Model */
var CircleModel = mongoose.model("CircleModel", CircleSchema);

/* ======================= */
/* CIRCLE COLLECTION : END */
/* ======================= */

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
        _id      : user._id,
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
    res.send(200);
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

app.get("/api/user/:id", function(req, res)
{
    UserModel.findOne({_id: req.params.id},
                      {username: 1, firstName: 1, lastName: 1, city: 1},
    function(err, doc)
    {
        res.json(doc);
    });
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

app.get("/api/user/:id/music", function(req, res)
{
    MusicModel.findOne({uid: req.params.id}, function(err, doc)
    {
        res.json(doc);
    });
});

app.get("/api/user/:id/circle", function(req, res)
{
    CircleModel.findOne({uid: req.params.id}, function(err, doc)
    {
        res.json(doc);
    });
});

app.get("/api/people", function(req, res)
{
    UserModel.find({}, {username: 1, firstName: 1, lastName: 1, city: 1}, function(err, data)
    {
        res.json(data);
    });
});

app.get("/api/people/:q", function(req, res)
{
    UserModel.find(
        {$or: [
            {username : {$regex: new RegExp(req.params.q, "i")}},
            {firstName: {$regex: new RegExp(req.params.q, "i")}},
            {lastName : {$regex: new RegExp(req.params.q, "i")}},
            {city     : {$regex: new RegExp(req.params.q, "i")}},
        ]}, {username: 1, firstName: 1, lastName: 1, city: 1},
        function(err, data)
        {
            res.json(data);
        }
    );
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
            /* Clip trace to log the last ten activities */
            if(activity.length == 10)
            {
                activity.splice(0, 1);
            }
            activity.push(req.params.t);
            TraceModel.update({uid: req.params.id}, {$set: {activity: activity}}, function(err, doc)
            {
                // TODO
            });
        }
        res.send(200);
    }); 
});

/* Add a bookmark - Books */
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
        res.send(200);
    });
});

/* Add a bookmark - Music */
app.put("/api/user/:id/music/:uri", function(req, res)
{
    MusicModel.findOne({uid: req.params.id}, function(err, doc)
    {
        if(doc == null)
        {
            music = new MusicModel({uid: req.params.id, audio: [req.params.uri]});
            music.save(function(err, doc)
            {
                // TODO
            });
        }
        else
        {
            audio = doc.audio;
            audio.push(req.params.uri);
            MusicModel.update({uid: req.params.id}, {$set: {audio: audio}}, function(err, doc)
            {
                // TODO
            });
        }
        res.send(200);
    });
});

/* Follow a person */
app.put("/api/user/:id/follow/:uid", function(req, res)
{
    CircleModel.findOne({uid: req.params.id}, function(err, doc)
    {
        if(doc == null)
        {
            circle = new CircleModel({uid: req.params.id, following: [req.params.uid]});
            circle.save(function(err, doc)
            {
                // TODO
            });
        }
        else
        {
            following = doc.following;
            following.push(req.params.uid);
            CircleModel.update({uid: req.params.id}, {$set: {following: following}}, function(err, doc)
            {
                // TODO
            });
        }
        res.send(200);
    });
});

/* Add a follower */
app.put("/api/user/:id/followed/:uid", function(req, res)
{
    CircleModel.findOne({uid: req.params.id}, function(err, doc)
    {
        if(doc == null)
        {
            circle = new CircleModel({uid: req.params.id, follower: [req.params.uid]});
            circle.save(function(err, doc)
            {
                // TODO
            });
        }
        else
        {
            follower = doc.follower;
            follower.push(req.params.uid);
            CircleModel.update({uid: req.params.id}, {$set: {follower: follower}}, function(err, doc)
            {
                // TODO
            });
        }
        res.send(200);
    });
});
/* PUT listeners : END */

/* DELETE listeners: BEGIN */
/* Remove a book from favorites */
app.delete("/api/user/:id/book/:isbn", function(req, res)
{
    BookModel.findOne({uid: req.params.id}, function(err, doc)
    {
        var idx = doc.book.indexOf(req.params.isbn);
        doc.book.splice(idx, 1);
        BookModel.update({uid: req.params.id}, {$set: {book: doc.book}}, function(err, doc)
        {
            res.send(200);
        });
    });
});

/* Remove a soundtrack from favorites */
app.delete("/api/user/:id/music/:url", function(req, res)
{
    MusicModel.findOne({uid: req.params.id}, function(err, doc)
    {
        var idx = doc.audio.indexOf(req.params.url);
        doc.audio.splice(idx, 1);
        MusicModel.update({uid: req.params.id}, {$set: {audio: doc.audio}}, function(err, doc)
        {
            res.send(200);
        });
    });
});
/* DELETE listeners: END */

/* =================== */
/* API LISTENERS : END */
/* =================== */

app.listen(port, ip);
/* End of server.js */