/*
    Author : Asad Shahabuddin
    File   : app.js
    Details: JS for 'Console'.
    Email  : asad808@ccs.neu.edu
*/

var app = angular.module("ConsoleApp", ["ngRoute"]);
console.log("%c>Console",
            "color: navy; font-family: Courier New; font-weight: bold");

app.config(function($routeProvider)
{
    $routeProvider
    .when("/",
    {
        templateUrl: "html/welcome.html",
        controller: "LoginCtrl"
    })
    .when("/profile",
    {
        templateUrl: "html/profile.html",
        controller: "ProfileCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/profileg",
    {
        templateUrl: "html/profile.html",
        controller: "ProfileCtrl"
    })
    .when("/bookmarks",
    {
        templateUrl: "html/bookmarks.html",
        controller: "BookmarksCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/news",
    {
        templateUrl: "html/news.html",
        controller: "NewsCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/newsg",
    {
        templateUrl: "html/news.html",
        controller: "NewsCtrl"
    })
    .when("/books",
    {
        templateUrl: "html/books.html",
        controller: "BooksCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/booksg",
    {
        templateUrl: "html/books.html",
        controller: "BooksCtrl"
    })
    .when("/music",
    {
        templateUrl: "html/music.html",
        controller: "MusicCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/musicg",
    {
        templateUrl: "html/music.html",
        controller: "MusicCtrl"
    })
    .when("/people",
    {
        templateUrl: "html/people.html",
        controller: "PeopleCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/person",
    {
        templateUrl: "html/person.html",
        controller: "PersonCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .otherwise(
    {
        redirectTo: "/"
    });
});
/* End of app.js */