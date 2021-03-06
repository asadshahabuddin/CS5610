/*
    Author : Asad Shahabuddin
    File   : music.js
    Details: JS for 'music.html'.
    Email  : asad808@ccs.neu.edu
*/

var DELIMITER = "asDelimiter";
var uid       = null;

/* Add a track to favorite music */
var addFavMusic = function(meta)
{
    var url = meta.substr(0, meta.indexOf(DELIMITER));
    var title = meta.substr(meta.indexOf(DELIMITER) + 11);
    var xmlHttp = new XMLHttpRequest();
    url = url.replace("http://", "http");
    url = url.replace(new RegExp("/", "g"), DELIMITER);
    xmlHttp.open("PUT", "/api/user/" + uid + "/music/" + url, false);
    xmlHttp.send(null);

    /* Log and trace */
    var msg = "Added " + title + " to your playlist";
    console.log("%c   [echo] " + msg,
                "font-family: Courier New;");
    xmlHttp.open("PUT", "/api/user/" + uid + "/trace/" + msg, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
};

app.controller("MusicCtrl", function($q, $scope, $location, GlobalService)
{
    console.log("%c   [echo] Music Controller has been initialized",
                "font-family: Courier New;");

    var music = "";

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

    /* Initialize the SoundCloud service */
    SC.initialize(
    {
        client_id: '332c1c04065fe2da9ad6537bb285a77c'
    });


    /* Search for music by keyword */
    $scope.search = function(title)
    {
        music = "";
        $scope.music = 1;
        console.log("");
        console.log("%cMusic>",
                    "font-family: Courier New; font-weight: bold;");

        SC.get("/tracks", {q: title}, function(res)
        {
            var len = res.length < 10 ? res.length : 10;
            for(var i = 0; i < len; i++)
            {
                $scope.embed(res[i].permalink_url);
            }
        });
        $scope.trace("Searched music with keyword '" + title + "'");
    };

    /* Embed a track in HTML */
    $scope.embed = function(url)
    {
        var deferred = $q.defer();
        
        SC.oEmbed(url, {auto_play: false}, function(track)
        {
            deferred.resolve();
            console.log("%c   [echo] Title: " + track.title,
                        "font-family: Courier New;");
            console.log("%c   [echo] URI: " + url,
                        "font-family: Courier New;");
            music = music.concat(refine(track, url)) + "<br/><br/><br/>";
            GlobalService.setMusic(music);
            document.getElementById("as-music-div").innerHTML = music;
        });

        return deferred.promise;
    };

    /* Refine HTML */
    var refine = function(obj, url)
    {
        var div = "<div><span class='asMusicTitle'>" + obj.title + "</span> ";
        if($scope.u)
        {
            div = div.concat("<button onclick='addFavMusic(\"" + url + DELIMITER + obj.title + "\")' class='asBookmarkBtn'>Bookmark</button>");
        }
        div = div.concat("<br/><span class='asMusicUrl'>" + obj.author_url + "</span><br/><br/>" + obj.html.replace("100%", "100%"));
        div = div.replace("400", "120");
        
        return div.concat("</div>");
    };

    $scope.u = GlobalService.getUser();
    if(GlobalService.getMusic())
    {
        $scope.music = 1;
        document.getElementById("as-music-div").innerHTML = GlobalService.getMusic();
    }
});
/* End of music.js */