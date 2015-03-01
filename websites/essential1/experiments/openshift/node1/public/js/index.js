/*
    Author: Asad Shahabuddin
    File: index.js
    Details: JavaScript file for 'index.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("NodeApplication", []);
/* Output to console */
console.log("%c>Shopping List",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("NodeController", function($scope, $http)
{
    /* Output to console */
    console.log("%c[echo] Main Controller has been initialized",
                "font-family: Courier New;");

    $scope.selectedIndex = null;
    $scope.itemDetails = [];

    $http.get("/api/items")
    .success(function(response)
    {
        /* Ouput response object to console */
        console.log("%cItems>",
                    "font-family: Courier New;")
        console.log(response);
        $scope.items = response;
    });

    $scope.saveItem = function(item)
    {
        /* Ouput to console */
        console.log("%c[echo] Saved item with name '" +
                    item.itemName + "'",
                    "font-family: Courier New;")

        $http.put("/api/items/" + $scope.selectedIndex, item).
        success(function(response)
        {
            $scope.items = response;
        });
    }

    $scope.addItem = function(item)
    {
        /* Ouput to console */
        console.log("%c[echo] Added item with name '" +
                    item.itemName + "'",
                    "font-family: Courier New;")

        $http.post("/api/items", item)
        .success(function(response)
        {
            $scope.items = response;
        });
    }

    $scope.editItem = function(index)
    {
        /* Ouput to console */
        console.log("%c[echo] Edited item with name '" +
                    $scope.items[index].itemName + "'",
                    "font-family: Courier New;")

        $scope.itemDetails = [];
        if($scope.selectedIndex === index)
        {
            $scope.selectedIndex = null;
            $scope.item = null;
        }
        else
        {
            $scope.selectedIndex = index;
            $scope.item = $scope.items[index];

            var idx;
            for(idx in $scope.items[index].by)
            {
                $http.get("/api/people/" + $scope.items[index].by[idx])
                .success(function(response)
                {
                    $scope.itemDetails.push(response);
                });
            }
        }
    }

    $scope.removeItem = function(index)
    {
        /* Ouput to console */
        console.log("%c[echo] Removed item with name '" +
                    $scope.items[index].itemName + "'",
                    "font-family: Courier New;")

        $http.delete("/api/items/" + index)
        .success(function(response)
        {
            $scope.items = response;
        });
    }

    $scope.removePersonFromItem = function(index)
    {
        /* Ouput to console */
        console.log("%c[echo] Removed some person (no pinpointing)",
                    "font-family: Courier New;")  

        $scope.itemDetails.splice(index, 1);
        $scope.items[$scope.selectedIndex].by.splice(index, 1);
    }
});
/* End of index.js */