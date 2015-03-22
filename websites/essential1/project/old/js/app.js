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
    .otherwise(
    {
        redirectTo: "/"
    });
});

var checkLogin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get("http://console-farpoint.rhcloud.com/api/loggedin")
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
            $rootScope.errorMsg = "  [error] You need to sign in.";
            deferred.reject();
            $location.url("/");
        }
    });

    return deferred.promise;
};

app.controller("ConsoleCtrl", function($scope, $http, $window)
{
    console.log("%c   [echo] Main Controller has been initialized",
                "font-family: Courier New;");

    /* Login */
    $scope.login = function(user)
    {
        console.log("%c   [echo] Attempting to sign in...",
                    "font-family: Courier New;");

        $http.post("http://console-farpoint.rhcloud.com/api/login", user)
        .success(function(res)
        {
            console.log("%cSUCCESS.",
                        "color: green; font-family: Courier New;")
            console.log(response);
            $rootScope.currentUser = res;
            $location.url("/profile");
        });
    };
});
/* End of app.js */