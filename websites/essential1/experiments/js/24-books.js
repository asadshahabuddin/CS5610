/*
    Author: Asad Shahabuddin
    File: 24-books.js
    Details: JavaScript file for '24-books.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("BooksApplication", ["ngRoute"]);

app.config(["$routeProvider",
function($routeProvider)
{
    $routeProvider.
    when("/home",
    {
        templateUrl: "../html/books_partials/home-4.html",
        controller: "HomeController"
    }).
    when("/bookmarks",
    {
        templateUrl: "../html/books_partials/bookmarks-4.html",
        controller: "BookmarksController"
    }).
    when("/details/:isbn",
    {
        templateUrl: "../html/books_partials/details-4.html",
        controller: "DetailsController"
    }).
    otherwise(
    {
        redirectTo: "/home"
    });
}]);

/* Output to console */
console.log("%c>Books",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("HomeController",
function($scope, BookService)
{
    /* Output to console */
    console.log("%c[echo] Home Controller has been initialized",
                "font-family: Courier New;");
    
    $scope.items = [];
    $scope.bookmarkedItems = [];
    $scope.itemDetails = [];

    $scope.searchBooks = function()
    {
        BookService.search($scope.searchTitle,
        function(response)
        {
            var items = [];
            for (var i = 0; i < response.items.length; i++)
            {
                items.push(response.items[i].volumeInfo);
            }
            $scope.items = items;

            /* Output to console */
            console.log("%c[echo] Search returned successfully",
                        "color: green; font-family: Courier New;");
        });
    }

    $scope.selectItem = function(item)
    {
        /* Output to console */
        console.log("%c[echo] '" + item.title + "' has been selected",
                    "font-family: Courier New;");
        alert("'" + item.title + "' has been selected.");
    }

    $scope.addItem = function(item)
    {
        /* Output to console */
        console.log("%c[echo] Added item '" + item.title + "'",
                    "font-family: Courier New;");
        
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
        /* Output to console */
        console.log("%c[echo] Edited item '" + item.title + "'",
                    "font-family: Courier New;");
        $scope.item = item;
    }

    $scope.removeItem = function(item)
    {
        /* Output to console */
        console.log("%c[echo] Removed item '" + item.title + "'",
                    "font-family: Courier New;");
        $scope.items.splice($scope.items.indexOf(item), 1);
    }

    $scope.bookmarkItem = function(item)
    {
        BookService.addBookmark(item);
    }
});

app.controller("BookmarksController",
function($scope, BookService)
{
    /* Output to console */
    console.log("%c[echo] Bookmarks Controller has been initialized",
                "font-family: Courier New;");
    console.log("%c[echo] Fetching bookmarked items from 'Books Service'",
                "font-family: Courier New;");
    console.log("");
    console.log("%cBookmarked objects>",
                "font-family: Courier New; font-weight: bold;");
    
    $scope.bookmarkedItems = BookService.bookmarks();
    console.log($scope.bookmarkedItems);
    console.log("");

    $scope.unbookmarkItem = function(item)
    {
        BookService.removeBookmark(item);
    }
});

app.controller("DetailsController",
function($scope, $routeParams, BookService)
{
    /* Output to console */
    console.log("%c[echo] Details Controller has been initialized",
                "font-family: Courier New;");
    console.log("%c[echo] Fetch details for book with ISBN " + $routeParams.isbn,
                "font-family: Courier New;");

    BookService.details($routeParams.isbn,
    function(response)
    {
        $scope.itemDetails = response.items[0];

        /* Output to console */
        console.log("%c[echo] Search returned successfully",
                    "color: green; font-family: Courier New;");
        console.log("%cItemDetails>",
                     "font-family: Courier New; font-weight: bold;");
        console.log($scope.itemDetails);
    });
});
/* End of 24-books.js */