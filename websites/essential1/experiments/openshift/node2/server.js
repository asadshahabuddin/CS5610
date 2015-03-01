/*
    Author: Asad Shahabuddin
    File: server.js
    Details: Configuration script for node2-asadshahabuddin.
    Email ID: asad808@ccs.neu.edu
*/

var express    = require("express");
var bodyParser = require("body-parser");
var multer     = require("multer");
var nodemailer = require("nodemailer");
var app        = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

/*  Set the environment variables we need. */
var ip   = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var author = {
    first: "Asad",
    last : "Shahabuddin"
};

/* Mail class */
var MailUtility = function()
{
    var self = this;

    self.setupVariables = function(toEmail, msg)
    {
        /* Create reusable transport method (opens a pool of SMTP connections) */
        self.smtpTransport = nodemailer.createTransport(
        {
            service: "Gmail",
            auth: {
                user: "oracle.java.com@gmail.com",
                pass: "8572659873"
            }
        });

        /* Setup email data with unicode symbols */
        self.mailOptions = {
            from: "The Architect <oracle.java.com@gmail.com>",  /* Sender address */
            to: toEmail,                                        /* List of receivers */
            subject: "You've Got Mail",                         /* Subject line */
            text: msg,                                          /* Plain Text body */
            html: msg                                           /* HTML body */
        }
    }

    /* Send mail with defined transport object */
    self.transmit = function(res)
    {
        self.smtpTransport.sendMail(self.mailOptions, function(error, response)
        {
            if(error)
            {
                res.json(error);
            }
            else
            {
                res.send("Email sent successfully");
            }
        });
    }
};

/* Get listeners : BEGIN */
app.get("/api", function(req, res)
{
    res.send("node2-asadshahabuddin API");
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
/* Get listeners : END */

/* Post listeners : BEGIN */
app.post("/api/cookie", function(req, res)
{
    res.cookie("username", req.body.fname);
    res.writeHead(200, {"Content-Type":"text/html"});
    res.write("Cookie Set. You can inspect it by typing 'document.cookie' " +
              "in your browser's console.");
    res.end();
});

app.post("/api/mail", function(req, res)
{
    var mailUtil = new MailUtility();
    mailUtil.setupVariables(req.body.id, req.body.msg);
    mailUtil.transmit(res);   
});
/* Post listeners : END */

app.listen(port, ip);

/* End of server.js */