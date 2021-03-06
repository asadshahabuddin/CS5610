/*
    Author: Asad Shahabuddin
    File: 22-books-service.js
    Details: AngularJS Service for '22-books.html'.
    Email ID: asad808@ccs.neu.edu
*/

app.factory("BookService",
function BookService($http)
{
    var bookmarkedItems = [];

    var searchBooks = function(title, callback)
    {
        /* Output to console */
        console.log("%c[echo] Searching for books with title '" + title + "'...",
    	            "font-family: Courier New;");

        $http.get("https://www.googleapis.com/books/v1/volumes?q=" + title)
        .success(callback);
    }

    var getBookmarks = function()
    {
        return bookmarkedItems;
    }

    var bookmarkItem = function(item)
    {
        /* Output to console */
        console.log("%c[echo] Added item '" + item.title + "' to bookmarks",
                    "font-family: Courier New;");
        bookmarkedItems.push(item);
    }

    var unbookmarkItem = function(item)
    {
    	/* Output to console */
        console.log("%c[echo] Removed item '" + item.title + "' from bookmarks",
                    "font-family: Courier New;");
        bookmarkedItems.splice(bookmarkedItems.indexOf(item), 1);
    }

    return {
    	search: searchBooks,
    	bookmarks: getBookmarks,
    	addBookmark: bookmarkItem,
    	removeBookmark: unbookmarkItem
    }
});
/* End of 22-books-service.js */