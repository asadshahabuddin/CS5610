/*
    Author: Asad Shahabuddin
    File: 18-coterie-3.js
    Details: JS for 'Coterie'.
*/

var app = angular.module("coterie-app", []);
app.controller("coterie-controller",

function($scope, $http)
{
    /* Output to console */
    console.log("%cCOTERIE application has initialized.",
                "color: navy; font-family: Courier New; font-weight: bold");
    
    $scope.searchBooks = function()
    {
        var searchToken = $scope.searchByTitle;
        $http.get("https://www.googleapis.com/books/v1/volumes?q=" + searchToken)
        .success(function(response)
        {
            var items = [];
            for(var i = 0; i < response.items.length; i++)
            {
                console.log(response.items[i].volumeInfo);
                items.push(response.items[i].volumeInfo);
            }
            $scope.items = items;
        })
    }

    $scope.selectItem = function(item)
    {
        alert("'" + item.title + "' has been selected.");
    }

    $scope.addItem = function(item)
    {
        var authors = [item.author];
        var newItem =
        {
            title: item.title,
            authors: authors,
            description: item.description,
            publishedDate: item.publishedDate,
            averageRating: item.averageRating
        }

        $scope.items.push(newItem);
    }

    $scope.editItem = function(item)
    {
        $scope.item = item;
    }

    $scope.removeItem = function(item)
    {
        $scope.items.splice($scope.items.indexOf(item), 1);
    }
});
/* End of 18-coterie-3.js */