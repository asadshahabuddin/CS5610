/*
    Author: Asad Shahabuddin
    File: 14-jq-ajax.js
    Details: JS for '14-jq-ajax.html'.
*/
$(".imdbBtn").click(function()
{
    $.ajax(
    {
        url: "http://www.myapifilms.com/imdb?title=Lilya%204-Ever&format=JSONP&aka=0&business=0&seasons=0&seasonYear=0&technical=0&filter=N&exactFilter=0&limit=1&lang=en-us&actors=N&biography=0&trailer=0&uniqueName=0&filmography=0&bornDied=0&starSign=0&actorActress=0&actorTrivia=0&movieTrivia=0&awards=0&moviePhotos=N&movieVideos=N",
        dataType: "jsonp",
        success: function(response)
        {
            console.log(response);
            var responseStr = JSON.stringify(response);

            /* Create relevant regular expressions objects */
            var titlePattern = new RegExp("title(.{3})(?=((?:[^\"])+))");
            var posterPattern = new RegExp("urlPoster(.{3})(?=((?:[^\"])+))");
            var plotPattern = new RegExp("plot(.{3})(?=((?:[^\"])+))");
            
            /* Get relavent fields as strings */
            var title = responseStr.match(titlePattern);
            var poster = responseStr.match(posterPattern);
            var plot = responseStr.match(plotPattern);
            
            /* Update approapriate fields in the web page */
            $(".filmTitle").text(title[2]);
            $(".filmPoster").attr("src", poster[2]);
            $(".filmPlot").text(plot[2]);
        }
    });
});
/* End of 14-jq-ajax.js */