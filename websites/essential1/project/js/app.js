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
    .when("/books",
    {
        templateUrl: "html/books.html",
        controller: "BooksCtrl",
        resolve: {
            loggedin: checkLogin
        }
    })
    .when("/music",
    {
        templateUrl: "html/music.html",
        controller: "MusicCtrl",
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