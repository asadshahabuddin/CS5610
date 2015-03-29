/*
    Author : Asad Shahabuddin
    File   : books.js
    Details: JS for 'books.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("BooksCtrl", function($rootScope, $scope, $http, $location)
{
    console.log("%c   [echo] Book Controller has been initialized",
                "font-family: Courier New;");
    
    SHORT_DESC_LEN = 256;

    /* Log user activities */
    $scope.trace = function(msg)
    {
        $http.put("/api/user/" + $rootScope.currentUser._id + "/trace/" + msg)
        .success(function(res)
        {
            // TODO
        });
    };

    /* Search by book title */
    $scope.search = function(title)
    {
        $http.get("https://www.googleapis.com/books/v1/volumes?q=" + title)
        .success(function(res)
        {
            var books = [];
            for(var i = 0; i < res.items.length; i++)
            {
                books.push(res.items[i].volumeInfo);
            }
            $scope.books = books;

            console.log("%c   [echo] Book search returned successfully",
                        "font-family: Courier New;");
            console.log("%c Book 1>",
                        "font-family: Courier New; font-weight: bold;")
            console.log(books[0]);
        });

        $scope.trace("Searched books with keyword '" + title + "'");
    };

    /* Clip text */
    $scope.abstract = function(book)
    {
        if(typeof book.description == "undefined")
        {
            return "";
        }

        var desc = book.description;
        var len = (desc.length < SHORT_DESC_LEN) ? desc.length : SHORT_DESC_LEN;
        var suffix = len < SHORT_DESC_LEN ? "" : "...";
        return desc.substring(0, len) + suffix;
    };

    /* Book thumbnail URL */
    $scope.thumbnail = function(book)
    {
        if(typeof book.imageLinks != "undefined"
           && typeof book.imageLinks.smallThumbnail != "undefined")
        {
            return book.imageLinks.smallThumbnail;
        }
        return "image/book.gif";
    };

    /* Bookmark */
    $scope.bookmark = function(book)
    {
        $http.put("/api/user/" + $rootScope.currentUser._id +
                  "/book/" + book.industryIdentifiers[0].identifier)
        .success(function(res)
        {
            // TODO
        });

        $scope.trace("Added " + book.title + " to your favorite books");
    };

    /* Sign out */
    $scope.logout = function()
    {
        if($rootScope
           && typeof $rootScope.currentUser != "undefined")
        {
            $http.post("/api/logout")
            .success(function()
            {
                console.log("%c   [echo] Logged out user '" + $rootScope.currentUser.username + "'",
                            "font-family: Courier New;");   
         
            });
        }
        $location.url("/");
    };
});
/* End of books.js */