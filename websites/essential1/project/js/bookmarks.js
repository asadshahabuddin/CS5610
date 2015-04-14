/*
    Author : Asad Shahabuddin
    File   : bookmarks.js
    Details: JS for 'bookmarks.html'.
    Email  : asad808@ccs.neu.edu
*/

var DELIMITER = "asDelimiter";

/* Remove a track from favorite music */
var remFavMusic = function(meta)
{
    var url = meta.substr(0, meta.indexOf(DELIMITER));
    var title = meta.substr(meta.indexOf(DELIMITER) + 11);
    var xmlHttp = new XMLHttpRequest();
    url = url.replace("http://", "http");
    url = url.replace(new RegExp("/", "g"), DELIMITER);
    xmlHttp.open("DELETE", "/api/user/" + uid + "/music/" + url, false);
    xmlHttp.send(null);
    /* Reload the page since AngularJS scope variable isn't available here */
    location.reload();

    /* Log and trace */
    var msg = "Removed " + title + " from your playlist";
    console.log("%c   [echo] " + msg,
                "font-family: Courier New;");
    xmlHttp.open("PUT", "/api/user/" + uid + "/trace/" + msg, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
};

app.controller("BookmarksCtrl", function($q, $scope, $location, GlobalService)
{
    console.log("%c   [echo] Bookmarks Controller has been initialized",
                "font-family: Courier New;");

    SHORT_DESC_LEN = 256;
    var music      = "";
    var count      = 0;

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
        GlobalService.getFavMusic(GlobalService.getUser()._id, function(res)
        {
            if(res != null)
            {
                for (var i = 0; i < res.audio.length; i++)
                {
                    var url = res.audio[i].replace("http", "http://");
                    url = url.replace(new RegExp(DELIMITER, "g"), "/");
                    console.log("%c   [echo] Searching for track with uri '" + url + "'",
                                "font-family: Courier New;");
                    $scope.embed(url);
                }
                $scope.music = 1;  /* 1 represents true */
            }
        });
    };

    /* Embed a track in HTML */
    $scope.embed = function(url)
    {
        var deferred = $q.defer();

        SC.oEmbed(url, {auto_play: false}, function(track)
        {
            deferred.resolve();
            if(track)
            {
                if(count == 1)
                {
                    console.log("%cTrack 1>",
                                "font-family: Courier New; font-weight: bold;");
                    console.log(track);
                }
                music = music.concat(refine(track, url)) + "<br/><br/><br/>";
                document.getElementById("as-music-div").innerHTML = music;
            }
        });

        return deferred.promise;
    }

    /* Refine HTML */
    var refine = function(obj, url)
    {
        var div = "<div><span class='asMusicTitle'>" + obj.title + "</span> " +
                  "<button onclick='remFavMusic(\"" + url + DELIMITER + obj.title + "\")' class='asBookmarkRemBtn'>Remove</button><br/>" +
                  "<span class='asMusicUrl'>" + obj.author_url + "</span><br/><br/>" +
                  obj.html.replace("100%", "100%");
        div = div.replace("400", "120px");
        return div.concat("</div>");
    };

    /* ===================== */
    /* MUSIC FUNCTIONS : END */
    /* ===================== */

    /* ========================= */
    /* COMMENT FUNCTIONS : BEGIN */
    /* ========================= */

    /* Set comments for this user */
    $scope.setComments = function(comment)
    {
        GlobalService.setComments($scope.u._id, comment, function(res)
        {
            $scope.getComments();
        });
    };

    /* Get comments for this user */
    $scope.getComments = function()
    {
        $scope.commentCount = 0;
        $scope.comments     = [];
        comments            = [];

        GlobalService.getComments($scope.u._id, function(res)
        {
            if(res != null)
            {
                for(var i = 0; i < res.comment.length; i++)
                {
                    var curComment = res.comment[i];
                    var delimIdx = curComment.indexOf(DELIMITER);
                    var uid = curComment.substring(0, delimIdx);
                    $scope.updateComments(uid, delimIdx, curComment);
                }
                $scope.commentCount = res.comment.length;
                $scope.comments     = comments;
            }
        });
    };

    /* Update comments */
    $scope.updateComments = function(uid, delimIdx, curComment)
    {
        var deferred = $q.defer();

        GlobalService.getPersonInfo(uid, function(res)
        {
            deferred.resolve();
            var comment = {
                uid : uid,
                unm : res.firstName + " " + res.lastName,
                post: curComment.substring(delimIdx + 11)
            };
            comments.push(comment);
        });

        return deferred.promise;
    };

    /* ======================= */
    /* COMMENT FUNCTIONS : END */
    /* ======================= */

    $scope.u = GlobalService.getUser();
    $scope.getFavBooks();
    $scope.getFavMusic();
    $scope.getComments();
});
/* End of bookmarks.js */