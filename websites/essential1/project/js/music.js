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
    console.log("%c   [echo] Added track with URI '" + uri + "' to your playlist",
                "font-family: Courier New;");
    var xmlHttp = new XMLHttpRequest();
    uri = uri.replace("http://", "http");
    uri = uri.replace(new RegExp("/", "g"), "asDelimiter");
    xmlHttp.open("PUT", "/api/user/" + uid + "/music/" + uri, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;   
};

app.controller("MusicCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Music Controller has been initialized",
                "font-family: Courier New;");
    
    uid = GlobalService.getUser()._id;

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
                SC.oEmbed(res[i].permalink_url, {auto_play: false}, function(track)
                {
                    if(count == 1)
                    {
                        console.log("%cTrack 1>",
                                    "font-family: Courier New; font-weight: bold;");
                        console.log(track);
                    }
                    console.log("%c   [echo] Title: " + track.title,
                                "font-family: Courier New;");
                    console.log("%c   [echo] URI: " + res[count].permalink_url,
                                "font-family: Courier New;");

                    music = music.concat(refine(track, res[count++].permalink_url)) + "<br/><br/><br/>";
                    document.getElementById("as-music-div").innerHTML = music;
                });
            }
        });
        $scope.music = "[music]";
    };

    $scope.u = GlobalService.getUser();
});
/* End of music.js */