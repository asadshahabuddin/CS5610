/*
    Author : Asad Shahabuddin
    File   : bookmarks.js
    Details: JS for 'bookmarks.html'.
    Email  : asad808@ccs.neu.edu
*/

var refineBookmark = function(obj, uri)
{
    var div = "<div><span class='asMusicTitle'>" + obj.title + "</span> <br/>" +
              "<span class='asMusicUrl'>" + obj.author_url + "</span><br/><br/>" +
              obj.html.replace("100%", "480px");
    div = div.replace("400", "120px");
    return div.concat("</div>");
};

app.controller("BookmarksCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Bookmarks Controller has been initialized",
                "font-family: Courier New;");

    SHORT_DESC_LEN = 256;

    /* Sign out */
    $scope.logout = function()
    {
        if(GlobalService.getUser())
        {
            GlobalService.logout(function()
            {
                console.log("%c   [echo] Logged out user '" + GlobalService.getUser().username + "'",
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

    /* ====================== */
    /* BOOK FUNCTIONS : BEGIN */
    /* ====================== */

    /* Search by ISBN */
    $scope.getBookmarks = function()
    {
        GlobalService.getFavBooks(function(res)
        {
            if(res != null)
            {
                var books = [];
                for (var i = 0; i < res.book.length; i++)
                {
                    GlobalService.searchBookByISBN(res.book[i], function(res)
                    {
                        for(var i = 0; i < res.items.length; i++)
                        {
                            books.push(res.items[i].volumeInfo);
                        }
                    });
                }
                $scope.books = books;
            }
        });
        $scope.trace("Viewed your favorite books");
    };

    /* Remove a book from favorites */
    $scope.remove = function(book)
    {
        GlobalService.remFavBook(book, function(res)
        {
            console.log("%c   [echo] Removed a bookmark",
                            "font-family: Courier New;");
            $scope.getBookmarks();
        });

        $scope.trace("Removed " + book.title + " from your favorite books");
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

    /* ==================== */
    /* BOOK FUNCTIONS : END */
    /* ==================== */

    /* ======================= */
    /* MUSIC FUNCTIONS : BEGIN */
    /* ======================= */

    /* Initialize the SoundCloud service */
    SC.initialize(
    {
        client_id: '332c1c04065fe2da9ad6537bb285a77c'
    });

    /* Fetch the user's playlist */
    $scope.getPlaylist = function()
    {
        var music = [];
        var count = 0;

        GlobalService.getPlaylist(function(res)
        {
            if(res != null)
            {
                for (var i = 0; i < res.audio.length; i++)
                {
                    var uri = res.audio[i].replace("http", "http://");
                    uri = uri.replace(new RegExp("asDelimiter", "g"), "/");
                    console.log("%c   [echo] Searching track with uri '" + uri + "'",
                                "font-family: Courier New;");
                    SC.oEmbed(uri, {auto_play: false}, function(track)
                    {
                        if(count == 1)
                        {
                            console.log("%cTrack 1>",
                                        "font-family: Courier New; font-weight: bold;");
                            console.log(track);
                        }
                        music = music.concat(refineBookmark(track, uri)) + "<br/><br/><br/>";
                        document.getElementById("as-music-div").innerHTML = music;
                    });
                }
                $scope.music = music;
            }
        });
        $scope.trace("Viewed your favorite music");
    };

    /* ===================== */
    /* MUSIC FUNCTIONS : END */
    /* ===================== */

    $scope.u = GlobalService.getUser();
    $scope.getBookmarks();
    $scope.getPlaylist();
});
/* End of bookmarks.js */