/*
    Author: Asad Shahabuddin
    File: server.js
    Details: Configuration script for node3-asadshahabuddin.
    Email ID: asad808@ccs.neu.edu
*/

var express    = require("express");
var bodyParser = require("body-parser");
var multer     = require("multer");
var mongoose   = require("mongoose");
var app        = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

/* Set the environment variables we need */
var ip      = process.env.OPENSHIFT_NODEJS_IP      || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT    || 3000;
var connStr = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';

/* Connect to MongoDB instance */
mongoose.connect(connStr);

/* ================================ */
/* SHOPPING LIST COLLECTION : BEGIN */
/* ================================ */

/* Enforce schema */
var itemSchema = new mongoose.Schema({
    itemName: String,
    desc    : String,
    qty     : String,
    by      : []
}, {collection: "shoppinglist"});

/* Model */
var itemModel = mongoose.model("ItemModel", itemSchema);

/* Documents */
var item1 = new itemModel({
    itemName: "Apples",
    desc    : "Red Apples",
    qty     : "12",
    by      : []
});

/* ============================== */
/* SHOPPING LIST COLLECTION : END */
/* ============================== */

/* ========================== */
/* EXPENSE COLLECTION : BEGIN */
/* ========================== */

/* Enforce schema */
var expenseSchema = new mongoose.Schema({
    itemName: String,
    price   : Number,
    paidBy  : String,
    paidFor : String,
    paidOn  : Date
}, {collection: "expense"});

/* Model */
var expenseModel = mongoose.model("ExpenseModel", expenseSchema);

/* ======================== */
/* EXPENSE COLLECTION : END */
/* ======================== */

/* Author */
var author = {
    first: "Asad",
    last : "Shahabuddin"
};

/* ===================== */
/* API LISTENERS : BEGIN */
/* ===================== */

/* GET listeners : BEGIN */
app.get("/api", function(req, res)
{
    res.send("API for node3-asadshahabuddin");
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

app.get("/api/items", function(req, res)
{
    itemModel.find(function(err, data)
    {
        res.json(data);
    });
});

app.get("/api/expense", function(req, res)
{
    expenseModel.find(function(err, data)
    {
        res.json(data);
    });
});

app.get("/api/expense/:id", function(req, res)
{
    expenseModel.findById(req.params.id, function(err, doc)
    {
        res.json(doc);
    });
});

app.get("/api/expense/paidby/:paidBy", function(req, res)
{
    expenseModel.find({paidBy: req.params.paidBy}, function(err, data)
    {
        res.json(data);
    });
});

app.get("/api/expense/paidfor/:paidFor", function(req, res)
{
    expenseModel.find({paidFor: req.params.paidFor}, function(err, data)
    {
        res.json(data);
    });
});

/*
app.get("/api/process", function(req, res)
{
    res.json(process.env);
});
*/
/* GET listeners : END */

/* DELETE listeners : BEGIN */
app.delete("/api/expense/:id", function(req, res)
{
    expenseModel.findById(req.params.id, function(err, doc)
    {
        doc.remove();
        expenseModel.find(function(err, data)
        {
            res.json(data);
        });
    });
});
/* DELETE listeners : END */

/* POST listeners : BEGIN */
app.post("/api/expense", function(req, res)
{
    var expenseItem = new expenseModel(req.body);
    expenseItem.save(function(err, doc)
    {
        expenseModel.find(function(err, data)
        {
            res.json(data);
        });
    });
});
/* POST listeners : END */

/* PUT listeners : BEGIN */
app.put("/api/expense/:id", function(req, res)
{
    expenseModel.update({_id: req.params.id}, {$set: req.body}, function(err, doc)
    {
        // TODO
    });
});
/* PUT listeners : END */

app.listen(port, ip);

/* =================== */
/* API LISTENERS : END */
/* =================== */

/* End of server.js */