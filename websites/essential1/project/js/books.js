/*
    Author : Asad Shahabuddin
    File   : books.js
    Details: JS for 'books.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("BooksCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Book Controller has been initialized",
                "font-family: Courier New;");
    
    SHORT_DESC_LEN = 256;

    /* Sign out */
    $scope.logout = function()
    {
        if(GlobalService.getUser())
        {
            GlobalService.logout(function()
            {
                console.log("%c   [echo] Logged out successfully",
                            "font-family: Courier New;");
            });
        }
        $location.url("/");
    };

    /* Log user activities */
    $scope.trace = function(msg)
    {
        GlobalService.trace(msg, function(res){});
    };

    /* Search by book title */
    $scope.search = function(title)
    {
        GlobalService.searchBooksByTitle(title, function(res)
        {
            var books = [];
            for(var i = 0; i < res.items.length; i++)
            {
                books.push(res.items[i].volumeInfo);
            }
            $scope.books = books;
            GlobalService.setBooks(books);

            console.log("%c   [echo] Book search returned successfully",
                        "font-family: Courier New;");
            console.log("%c Book 1>",
                        "font-family: Courier New; font-weight: bold;")
            console.log(books[0]);
        });
        $scope.trace("Searched books with keyword '" + title + "'");
    };

    /* Add a book to favorites */
    $scope.bookmark = function(book)
    {
        GlobalService.setFavBooks(book, function(res){});
        console.log("%c   [echo] Added " + book.title + " to your reading list",
                    "font-family: Courier New;");
        $scope.trace("Added " + book.title + " to your reading list");
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

    $scope.u = GlobalService.getUser();
    $scope.books = GlobalService.getBooks();
});
/* End of books.js */