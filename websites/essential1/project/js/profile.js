/*
    Author : Asad Shahabuddin
    File   : profile.js
    Details: JS for 'profile.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("ProfileCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Profile Controller has been initialized",
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
        GlobalService.trace(msg, function(res)
        {
            $scope.feed();
        });
    };

    /* Fetch trace */
    $scope.feed = function()
    {
        GlobalService.feed(function(res)
        {
            if(res != null)
            {
                $scope.activities = res.activity;
            }
        });
    };

    /* Display modal window */
    $scope.showModal = function()
    {
        document.getElementById("as-cover-modal").showModal();
    };

    /* Close modal window */
    $scope.closeModal = function()
    {
        document.getElementById("as-cover-modal").close();
    };

    /* Set cover picture */
    $scope.changeCover = function(cover)
    {
        document.getElementById("as-cover-div").style.backgroundImage = "url(" + cover + ")";
        cover = cover.replace("image/", "image-");
        cover = cover.replace(".", "-");
        GlobalService.setCover(cover, function(res)
        {
            $scope.trace("Changed your cover picture");
        });
    };

    /* Get cover picture */
    $scope.cover = function()
    {
        if(!GlobalService.getUser())
        {
            document.getElementById("as-cover-div").style.backgroundImage = "url(\"image/cover1.jpg\")";
        }
        else
        {
            GlobalService.getCover(function(res)
            {
                document.getElementById("as-cover-div").style.backgroundImage = "url(" + res + ")";
            });
        }
    }

    /* Get thy circle */
    $scope.circle = function()
    {
        GlobalService.getCircle(function(res)
        {
            if(res)
            {
                console.log("%cFollowers>",
                            "font-family: Courier New; font-weight: bold;");
                console.log(res.follower);
                console.log("%cFollowing>",
                            "font-family: Courier New; font-weight: bold;");
                console.log(res.following);

                $scope.followers = [];
                $scope.followings = [];
                for(i = 0; i < res.follower.length; i++)
                {
                    GlobalService.searchPersonById(res.follower[i], function(r)
                    {
                        $scope.followers.push(r.firstName + " " + r.lastName);
                    });
                }
                for(i = 0; i < res.following.length; i++)
                {
                    GlobalService.searchPersonById(res.following[i], function(r)
                    {
                        $scope.followings.push(r.firstName + " " + r.lastName);
                    });
                }
            }
        });
    }

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
        div = div.replace("400", "85");
        return div.concat("</div>");
    };

    /* ===================== */
    /* MUSIC FUNCTIONS : END */
    /* ===================== */

    /* Initialize profile page */
    $scope.u = GlobalService.getUser();
    $scope.cover();
    if($scope.u)
    {
        $scope.feed();
        $scope.circle();
        $scope.getFavBooks();
        $scope.getFavMusic();
    }
});
/* End of profile.js */