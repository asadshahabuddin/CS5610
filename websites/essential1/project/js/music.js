/*
    Author : Asad Shahabuddin
    File   : music.js
    Details: JS for 'music.html'.
    Email  : asad808@ccs.neu.edu
*/

var uid = null;

var refine = function(obj, uri)
{
    var div = "<div><span class='asMusicTitle'>" + obj.title + "</span> " +
              "<button onclick='bookmark(\"" + uri + "\")' class='asBookmarkBtn'>Bookmark</button><br/>" +
              "<span class='asMusicUrl'>" + obj.author_url + "</span><br/><br/>" +
              obj.html.replace("100%", "480px");
    div = div.replace("400", "120px");
    return div.concat("</div>");
};

/* Bookmark */
var bookmark = function(uri)
{
    var xmlHttp = new XMLHttpRequest();
    uri = uri.substring(uri.indexOf("tracks/") + 7);
    xmlHttp.open("PUT", "/api/user/" + uid + "/music/" + uri, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

app.controller("MusicCtrl", function($rootScope, $scope, $http, $location)
{
    console.log("%c   [echo] Music Controller has been initialized",
                "font-family: Courier New;");

    uid = $rootScope.currentUser._id;

    /* Initialize the SoundCloud service */
    SC.initialize(
    {
        client_id: '332c1c04065fe2da9ad6537bb285a77c'
    });

    /* Search for music by keyword */
    $scope.search = function(title)
    {
        var music = "";
        var count = 0;

        SC.get("/tracks", {q: title}, function(res)
        {
            var len = res.length < 10 ? res.length : 10;
            for(var i = 0; i < len; i++)
            {
                SC.oEmbed(res[i].uri, {auto_play: false}, function(track)
                {
                    if(count == 1)
                    {
                        console.log("%cTrack 1>",
                                    "font-family: Courier New; font-weight: bold;");
                        console.log(track);
                    }
                    music = music.concat(refine(track, res[count++].uri)) + "<br/><br/><br/>";
                    document.getElementById("as-music-div").innerHTML = music;
                });
            }
        });
        $scope.music = "[music]";
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
/* End of music.js */