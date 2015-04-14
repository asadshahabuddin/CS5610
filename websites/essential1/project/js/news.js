/*
    Author : Asad Shahabuddin
    File   : news.js
    Details: JS for 'news.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("NewsCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] News Controller has been initialized",
                "font-family: Courier New;");

    $scope.headlines = [];

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
    /* NEWS FUNCTIONS : BEGIN */
    /* ====================== */

    /* Seach news using The New York Times Top Stories API */
    GlobalService.searchNews(function(res)
    {
        console.log("%cHeadlines>",
                    "font-family: Courier New; font-weight: bold;");
        console.log(res);
        $scope.headlines = res.results;
        $scope.trace("Navigated to news");
    });

    /* Execute a Find and Replace on the 'abstract' field */
    $scope.abstract = function(headline)
    {
        return headline.abstract.replace("&#8217;", "'");
    };

    /* ==================== */
    /* NEWS FUNCTIONS : END */
    /* ==================== */

    /* ========================= */
    /* WEATHER FUNCTIONS : BEGIN */
    /* ========================= */

    /* Search weather information using the Weather API */
    $scope.weather = function(city)
    {
        if(city)
        {
            console.log("%c   [echo] Querying weather parameters for city '" + city + "'...",
                        "font-family: Courier New;");

            GlobalService.searchWeather(city, function(res)
            {
                console.log("%cWeather>",
                            "font-family: Courier New; font-weight: bold;");
                console.log(res);

                /* Set weather parameters */
                $scope.city        = res.name;
                $scope.dt          = new Date();
                $scope.time        = $scope.dt.getHours() + ":" +
                                     $scope.dt.getMinutes();
                $scope.weatherMain = res.weather[0].main;
                $scope.temp        = Math.round(res.main.temp - 273.15);
                $scope.humidity    = res.main.humidity;
                $scope.pressure    = res.main.pressure;
                $scope.windSpeed   = res.wind.speed;
            });
            
            if(city != $scope.u.city)
            {
                $scope.trace("Queried weather conditions for " + city);
            }
        }
    };

    /* ======================= */
    /* WEATHER FUNCTIONS : END */
    /* ======================= */

    /*
    (1) Get the current user.
    (2) By default, weather card shows information for the city
        corresponding to the user currently signed in.
    */
    $scope.u = GlobalService.getUser();
    if(GlobalService.getUser()
       && GlobalService.getUser().city != "undefined")
    {
        $scope.weather(GlobalService.getUser().city);
    }
});
/* End of news.js */