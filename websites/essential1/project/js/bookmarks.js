/*
    Author : Asad Shahabuddin
    File   : bookmarks.js
    Details: JS for 'bookmarks.html'.
    Email  : asad808@ccs.neu.edu
*/

/* Remove a track from favorite music */
var remFavMusic = function(url)
{
    console.log("%c   [echo] Removed track with URL '" + url + "' from your playlist",
                "font-family: Courier New;");
    var xmlHttp = new XMLHttpRequest();
    url = url.replace("http://", "http");
    url = url.replace(new RegExp("/", "g"), "asDelimiter");
    xmlHttp.open("DELETE", "/api/user/" + uid + "/music/" + url, false);
    xmlHttp.send(null);
    $scope.getFavMusic();
    $scope.music = null;

    return xmlHttp.responseText;
};

app.controller("BookmarksCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Bookmarks Controller has been initialized",
                "font-family: Courier New;");

    SHORT_DESC_LEN = 256;

    /* Get current user's unique identifier */
    if(GlobalService.getUser())
    {
        uid = GlobalService.getUser()._id;
    }

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

    /* ====================== */
    /* BOOK FUNCTIONS : BEGIN */
    /* ====================== */

    /* Search by ISBN */
    $scope.getFavBooks = function()
    {
        GlobalService.getFavBooks(GlobalService.getUser()._id, function(res)
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
    };

    /* Remove a book from favorites */
    $scope.remFavBook = function(book)
    {
        GlobalService.remFavBook(book, function(res)
        {
            console.log("%c   [echo] Removed a bookmark",
                            "font-family: Courier New;");
            $scope.getFavBooks();
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
    $scope.getFavMusic = function()
    {
        var music = [];
        var count = 0;

        GlobalService.getFavMusic(GlobalService.getUser()._id, function(res)
        {
            if(res != null)
            {
                for (var i = 0; i < res.audio.length; i++)
                {
                    var url = res.audio[i].replace("http", "http://");
                    url = url.replace(new RegExp("asDelimiter", "g"), "/");
                    console.log("%c   [echo] Searching for track with uri '" + url + "'",
                                "font-family: Courier New;");
                    SC.oEmbed(url, {auto_play: false}, function(track)
                    {
                        if(count == 1)
                        {
                            console.log("%cTrack 1>",
                                        "font-family: Courier New; font-weight: bold;");
                            console.log(track);
                        }
                        music = music.concat(refine(track, url)) + "<br/><br/><br/>";
                        document.getElementById("as-music-div").innerHTML = music;
                    });
                }
                $scope.music = music;
            }
        });
    };

    /* Refine HTML */
    var refine = function(obj, url)
    {
        var div = "<div><span class='asMusicTitle'>" + obj.title + "</span> " +
                  "<!-- button onclick='remFavMusic(\"" + url + "\")' class='asBookmarkRemBtn'>Remove</button --><br/>" +
                  "<span class='asMusicUrl'>" + obj.author_url + "</span><br/><br/>" +
                  obj.html.replace("100%", "100%");
        div = div.replace("400", "120px");
        return div.concat("</div>");
    };

    /* ===================== */
    /* MUSIC FUNCTIONS : END */
    /* ===================== */

    $scope.u = GlobalService.getUser();
    $scope.getFavBooks();
    $scope.getFavMusic();
});
/* End of bookmarks.js */