/*
    Author: Asad Shahabuddin
    File: 27-node.js
    Details: JavaScript file for '27-node.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("NodeApplication", []);
/* Output to console */
console.log("%c>Node",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("NodeController", function($scope, $http)
{
    /* Output to console */
    console.log("%c[echo] Main Controller has been initialized",
                "font-family: Courier New;");

    $scope.queryAuthor = function()
    {
        $http.get("http://node1-asadshahabuddin.rhcloud.com/api/author")
        .success(function(response)
        {
            /* Ouput response object to console */
            console.log("%cAuthor>",
                        "font-family: Courier New;")
            console.log(response);
            $scope.author = response.first + " " + response.last;
        });
    }
});
/* End of 27-node.js */