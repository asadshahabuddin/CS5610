/*
    Author: Asad Shahabuddin
    File: index.js
    Details: JavaScript file for 'index.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("ExpenseTrackingApplication", []);
console.log("%c>Expense Tracking",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("ExpenseTrackingController", function($scope, $http)
{
    console.log("%c   [echo] Main Controller has been initialized",
                "font-family: Courier New;");

    $scope.items = [];
    $scope.curDate = new Date();
    $scope.selectedIndex = null;
    $scope.people = [];

    $http.get("/api/expense")
    .success(function(response)
    {
        $scope.items = response;
        updateBalance();
    });

    $scope.saveItem = function(id, item)
    {
        console.log("%c   [echo] Saved item with name '" +
                    item.itemName + "'",
                    "font-family: Courier New;");

        $http.put("/api/expense/" + id, item)
        .success(function(response)
        {
            updateBalance();
        });
    }

    $scope.addItem = function(item)
    {
        console.log("%c   [echo] Added item with name '" +
                    item.itemName + "'",
                    "font-family: Courier New;");

        $http.post("/api/expense", item)
        .success(function(response)
        {
            $scope.items = response;
            updateBalance();
        });
    }

    $scope.editItem = function(index)
    {
        console.log("%c   [echo] Edited item with name '" +
                    $scope.items[index].itemName + "'",
                    "font-family: Courier New;");

        if($scope.selectedIndex === index)
        {
            $scope.selectedIndex = null;
            $scope.item = null;
        }
        else
        {
            $scope.selectedIndex = index;
            $scope.item = $scope.items[index];
        }
    }

    $scope.removeItem = function(id, index)
    {
        console.log("%c   [echo] Removed item with name '" +
                    $scope.items[index].itemName + "'",
                    "font-family: Courier New;");

        $http.delete("/api/expense/" + id)
        .success(function(response)
        {
            $scope.items = response;
            updateBalance();
        });
    }

    var updateBalance = function()
    {
        var posBal = 0;
        var negBal = 0;
        var tempItem = null;
        var tempPeople1 = {};
        var tempPeople2 = {};
        $scope.people = [];

        for(idx in $scope.items)
        {
            tempItem = $scope.items[idx];
            if(!(tempItem.paidBy in tempPeople1))
            {
                tempPeople1[tempItem.paidBy] = true;
                tempPeople2[tempItem.paidBy] = tempItem.price;
            }
            else
            {
                tempPeople2[tempItem.paidBy] += tempItem.price;
            }

            if(!(tempItem.paidFor in tempPeople1))
            {
                tempPeople1[tempItem.paidFor] = true;
                tempPeople2[tempItem.paidFor] = -1 * tempItem.price;
            }
            else
            {
                tempPeople2[tempItem.paidFor] -= tempItem.price;
            }
        }

        for(person in tempPeople2)
        {
            $scope.people.push({name: person, balance: tempPeople2[person]});
        }
    }
});
/* End of index.js */