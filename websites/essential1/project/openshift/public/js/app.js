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
        controller: "ConsoleCtrl"
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
    .otherwise(
    {
        redirectTo: "/"
    });
});

/* Verify login status */
var checkLogin = function($q, $timeout, $rootScope, $http, $location)
{
    var deferred = $q.defer();

    $http.get("/api/loggedin")
    .success(function(user)
    {
        $rootScope.errorMsg = null;

        if(user != '0')  /* User is authenticated */
        {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
        else           /* User isn't authenticated */
        {
            $rootScope.errorMsg = "You need to sign in";
            deferred.reject();
            $location.url("/");
        }
        if(user)
        {
            console.log("%cCurrent user>",
                        "font-family: Courier New; font-weight: bold");
            console.log(user);
        }
        if($rootScope.errorMsg)
        {
            console.log("%c  [error] " + $rootScope.errorMsg,
                        "color: red; font-family: Courier New;");
        }
    });

    return deferred.promise;
};

/* Configure the application controller */
app.controller("ConsoleCtrl", function($rootScope, $scope, $http, $location, $anchorScroll)
{
    console.log("%c   [echo] Main Controller has been initialized",
                "font-family: Courier New;");

    /* Navigate to 'Sign In' section */
    $scope.gotoSignIn = function()
    {
        $location.hash("signin");
        $anchorScroll();
    };

    /* Register a new account */
    $scope.register = function(user)
    {
        if(user
           && typeof user.username != "undefined"
           && typeof user.password != "undefined"
           && user.password == user.password2)
        {
            console.log("%c   [echo] Attempting to register user '" +
                        user.username + "'",
                        "font-family: Courier New;");

            user["cover"] = "image/cover1.jpg";
            $http.post("/api/register", user)
            .success(function(res)
            {
                console.log("%cSuccess.",
                            "color: green; font-family: Courier New;");
                $rootScope.currentUser = res;
                $location.url("/profile");
            });
        }
        else
        {
            console.log("%c  [error] Invalid/incomplete information has been entered",
                        "color: red; font-family: Courier New;");
            if(user.password != user.password2)
            {
                console.log("%c  [error] Passwords don't match",
                            "color: red; font-family: Courier New;");
            }
            console.log("%c   [echo] Try again",
                        "font-family: Courier New;");
        }
    };

    /* Sign in */
    $scope.login = function(user)
    {
        console.log("%c   [echo] Attempting to sign in user '" +
                    user.username + "'",
                    "font-family: Courier New;");

        $http.post("/api/login", user)
        .success(function(res)
        {
            console.log("%cSuccess.",
                        "color: green; font-family: Courier New;");
            console.log("%cCurrent user>",
                        "font-family: Courier New; font-weight: bold");
            console.log(res);
            $rootScope.currentUser = res;
            $location.url("/profile");
        });
    };

    /* Log user activities */
    $scope.trace = function(msg)
    {
        $http.put("/api/user/" + $rootScope.currentUser._id + "/trace/" + msg)
        .success(function(res)
        {
            // TODO
        });
    };
});
/* End of app.js */