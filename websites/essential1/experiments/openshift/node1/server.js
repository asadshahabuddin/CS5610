/*
    Author: Asad Shahabuddin
    File: server.js
    Details: Node.js server configuration.
    Email ID: asad808@ccs.neu.edu
*/

var express    = require("express");
var bodyParser = require("body-parser");
var multer     = require("multer");
var app        = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

/*  Set the environment variables we need. */
var ip   = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

/* Author */
var author = {
    first: "Asad",
    last : "Shahabuddin"
};

/* Items - These make up the shopping list */
var people = [
    {name: "Anna Lee",           relation: "Wife",     phone: "8572658956"},
    {name: "Elizabeth Coolidge", relation: "Mother",   phone: "9874531544"},
    {name: "Marjana Coolidge",   relation: "Aunt",     phone: "7514458621"},
    {name: "Benedict Lee",       relation: "Father",   phone: "5817589654"},
    {name: "Elise Yale",         relation: "Daughter", phone: "8577895245"}
];

var items = [
    {itemName: "Apples",              desc: "Red Apples",               qty: 12, by: [1, 2, 3]},
    {itemName: "Bananas",             desc: "Not Plantains",            qty: 18, by: [2, 4]   },
    {itemName: "Cookies",             desc: "Chocolate Chip Cookies",   qty: 50, by: [1, 0]   },
    {itemName: "Eggs",                desc: "Brown Eggs",               qty: 30, by: [1, 2, 0]},
    {itemName: "Fish",                desc: "One very big fish",        qty: 1,  by: [4]      },
    {itemName: "Granola",             desc: "Its actually not healthy", qty: 4 , by: [1]      },
    {itemName: "Los Angeles Tickets", desc: "Oceanic 815",              qty: 2 , by: [1, 0]   }
];

/* Reminders */
var reminders = [
    "Buy all items in your shopping list",
    "Live Life to the fullest",
    "Watch South Park",
    "Go to A1A Car Wash",
    "Remember to buy all the items",
    "Kill Self"
];

/* Get listeners : BEGIN */
app.get("/api", function(req, res)
{
    res.send("node1-asadshahabuddin API");
});

app.get("/asciimo", function(req, res)
{
    var link = "http://i.imgur.com/kmbjB.png";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

app.get("/api/author", function(req, res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(author);
});

app.get("/api/items", function(req, res)
{
    res.json(items);    
});

app.get("/api/items/:idx", function(req, res)
{
    res.json(items[req.params.idx]);
});

app.get("/api/people", function(req, res)
{
    res.json(people);
});

app.get("/api/people/:idx", function(req, res)
{
    res.json(people[req.params.idx]);
});

app.get("/api/reminders", function(req, res)
{
    res.json(reminders);    
});
/* Get listeners : END */

/* Delete listeners : BEGIN */
app.delete("/api/items/:id", function(req, res)
{
    items.splice(req.params.id, 1);
    res.json(items);
});
/* Delete listeners : END */

/* Post listeners : BEGIN */
app.post("/api/items", function(req, res)
{
    items.push(req.body);
    res.json(items);
});
/* Post listeners : END */

/* Put listeners : BEGIN */
app.put("/api/items/:id", function(req, res)
{
    items[req.params.id] = req.body;
    res.json(items);
});
/* Put listeners : END */

app.listen(port, ip);

/* End of server.js */