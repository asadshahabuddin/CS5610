/*
    Author: Asad Shahabuddin
    File: index.js
    Details: JavaScript for 'index.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("Node2Application", []);
console.log("%c>node2-asadshahabuddin",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("Node2Controller", function($scope, $http)
{
    console.log("%c [echo] Login Controller has been initialized",
                "font-family: Courier New;");

    /* Login to server */
    $scope.login = function(user)
    {
        /* Sanity check */
        if(typeof user === "undefined"
           || typeof user.fname === "undefined"
           || typeof user.email === "undefined")
        {
            console.log("%c[error] Please try again",
                        "color: red; font-family: Courier New;")
        }
        else
        {
            console.log("%c [echo] Attempting to login as '" + user.fname + "'",
                        "font-family: Courier New;");

            $http.post("/api/cookie", user)
            .success(function(response)
            {
                console.log("%c [echo] Your are logged in",
                            "color: green; font-family: Courier New;");
                alert("You can inspect the cookie by typing 'document.cookie' in your " +
                      "browser's console window.");
            });
        }
    }
});
/* End of index.js */