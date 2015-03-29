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

app.controller("BookmarksCtrl", function($rootScope, $scope, $http, $location)
{
    console.log("%c   [echo] Bookmarks Controller has been initialized",
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

    /* Search by ISBN */
    $scope.getBookmarks = function()
    {
        $http.get("/api/user/" + $rootScope.currentUser._id + "/books")
        .success(function(res)
        {
            if(res != null)
            {
                var books = [];
                for (var i = 0; i < res.book.length; i++)
                {
                    $http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + res.book[i])
                    .success(function(res)
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

        $http.get("/api/user/" + $rootScope.currentUser._id + "/music")
        .success(function(res)
        {
            if(res != null)
            {
                for (var i = 0; i < res.audio.length; i++)
                {
                    var uri = "https://api.soundcloud.com/tracks/" + res.audio[i];
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
            }
        });

        $scope.trace("Viewed your favorite books");
    };

    $scope.getPlaylist();

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

    $scope.remove = function(book)
    {
        $http.delete("/api/user/" + $rootScope.currentUser._id +
                     "/book/" + book.industryIdentifiers[0].identifier)
        .success(function(res)
        {
            console.log("%c   [echo] Removed a bookmark",
                            "font-family: Courier New;");
            $scope.getBookmarks();
        });

        $scope.trace("Removed " + book.title + " from your favorite books");
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

    $scope.getBookmarks();
});
/* End of bookmarks.js */